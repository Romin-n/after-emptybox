/**
 * EmptyBox OS · 本地服务器
 *
 *   node server.mjs            # 启动，默认 http://127.0.0.1:5173
 *   node server.mjs --open     # 启动并自动打开浏览器
 *
 * 同时提供三件事：
 *   1. 静态文件（手机前端）
 *   2. /api/chat   AI 代理（支持 function calling / tools）
 *   3. /api/mcp/*  网易云音乐 MCP 桥（stdio 子进程）
 */

import http from 'node:http';
import { createReadStream } from 'node:fs';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const WANT_OPEN = process.argv.includes('--open');

// 公开部署时用环境变量限制上游，避免 /api/chat 变成任意代理（SSRF）。
// 本地不设置则保持开放。
const ALLOWED_UPSTREAMS = (process.env.ALLOWED_UPSTREAMS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.flac': 'audio/flac',
  '.m4a': 'audio/mp4',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.aac': 'audio/aac',
};

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readBody(req, limit = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error('请求体过大'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function clip(s, n = 300) {
  const str = String(s || '').replace(/\s+/g, ' ').trim();
  return str.length > n ? `${str.slice(0, n)}…` : str;
}

/* ---------------- AI 代理 ---------------- */
async function handleChat(req, res) {
  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch (e) {
    return sendJson(res, 400, { error: `请求解析失败：${e.message}` });
  }

  const { endpoint, key, model, messages, temperature = 1, maxTokens = 200, tools, toolChoice, stream = false } = payload || {};
  const base = String(endpoint || '').trim().replace(/\/+$/, '');
  if (!base) return sendJson(res, 400, { error: '缺少接口地址' });
  if (!/^https?:\/\//i.test(base)) return sendJson(res, 400, { error: '接口地址必须以 http:// 或 https:// 开头' });
  if (!Array.isArray(messages) || !messages.length) return sendJson(res, 400, { error: '缺少 messages' });

  if (ALLOWED_UPSTREAMS.length) {
    let host = '';
    try {
      host = new URL(base).hostname.toLowerCase();
    } catch {
      /* ignore */
    }
    const ok = host && ALLOWED_UPSTREAMS.some((h) => host === h || host.endsWith(`.${h}`));
    if (!ok) return sendJson(res, 403, { error: '该接口地址不在允许列表内' });
  }

  const url = /\/chat\/completions$/i.test(base) ? base : `${base}/chat/completions`;
  const headers = { 'Content-Type': 'application/json' };
  if (key) headers.Authorization = `Bearer ${key}`;

  const upstreamBody = {
    model: model || 'deepseek-chat',
    messages,
    temperature,
    max_tokens: maxTokens,
    stream: !!stream,
  };
  if (Array.isArray(tools) && tools.length) {
    upstreamBody.tools = tools;
    upstreamBody.tool_choice = toolChoice || 'auto';
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), stream ? 180000 : 60000);

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(upstreamBody),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      const raw = await upstream.text();
      return sendJson(res, 502, { error: `上游返回 ${upstream.status}：${clip(raw)}` });
    }

    if (stream) {
      const ct = String(upstream.headers.get('content-type') || '').toLowerCase();
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      });

      if (!ct.includes('text/event-stream')) {
        const raw = await upstream.text();
        let data = null;
        try {
          data = JSON.parse(raw);
        } catch {
          /* not JSON */
        }
        const text = data?.choices?.[0]?.message?.content;
        if (text) {
          res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: String(text) } }] })}\n\n`);
        } else {
          res.write(`data: ${JSON.stringify({ error: `上游没有返回内容：${clip(raw)}` })}\n\n`);
        }
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      }

      const reader = upstream.body.getReader();
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(decoder.decode(value, { stream: true }));
        }
      } finally {
        res.end();
      }
      return;
    }

    const raw = await upstream.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return sendJson(res, 502, { error: `上游返回的不是 JSON：${clip(raw)}` });
    }

    const message = data?.choices?.[0]?.message || {};
    const content = message.content;
    const toolCalls = message.tool_calls || null;
    if (!content && !toolCalls) {
      return sendJson(res, 502, { error: `上游没有返回内容：${clip(raw)}` });
    }
    return sendJson(res, 200, {
      text: content ? String(content).trim() : '',
      toolCalls,
      model: data.model || model,
    });
  } catch (e) {
    const message =
      e.name === 'AbortError' ? '请求超时（60 秒）' : `连接失败：${e.message}`;
    return sendJson(res, 502, { error: message });
  } finally {
    clearTimeout(timer);
  }
}

/* ---------------- MCP 桥（netease-music-mcp） ---------------- */
class McpClient {
  constructor(script) {
    this.script = script;
    this.proc = null;
    this.id = 0;
    this.pending = new Map();
    this.buffer = '';
    this.tools = [];
    this.ready = false;
    this.error = null;
  }

  start() {
    this.proc = spawn(process.execPath, [this.script], {
      cwd: ROOT,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    this.proc.stdout.setEncoding('utf8');
    this.proc.stdout.on('data', (chunk) => this.onData(chunk));
    this.proc.stderr.setEncoding('utf8');
    this.proc.stderr.on('data', (d) => process.stderr.write(d));
    this.proc.on('exit', (code) => {
      this.ready = false;
      this.error = `MCP 进程退出（code ${code}）`;
    });
    this.init().catch((e) => {
      this.error = e.message;
      console.error('[mcp] 初始化失败：', e.message);
    });
  }

  onData(chunk) {
    this.buffer += chunk;
    let idx;
    while ((idx = this.buffer.indexOf('\n')) >= 0) {
      const line = this.buffer.slice(0, idx).trim();
      this.buffer = this.buffer.slice(idx + 1);
      if (!line) continue;
      let msg;
      try {
        msg = JSON.parse(line);
      } catch {
        continue;
      }
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || 'MCP 错误'));
        else resolve(msg.result);
      }
    }
  }

  request(method, params, timeout = 8000) {
    if (!this.proc) return Promise.reject(new Error('MCP 未启动'));
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`MCP 超时：${method}`));
      }, timeout);
      this.pending.set(id, {
        resolve: (v) => {
          clearTimeout(timer);
          resolve(v);
        },
        reject: (e) => {
          clearTimeout(timer);
          reject(e);
        },
      });
      this.proc.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
    });
  }

  notify(method, params) {
    if (this.proc) {
      this.proc.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method, params })}\n`);
    }
  }

  async init() {
    await this.request('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'emptybox-os', version: '1.0.0' },
    });
    this.notify('notifications/initialized', {});
    const list = await this.request('tools/list', {});
    this.tools = list.tools || [];
    this.ready = true;
    console.log(`[mcp] netease-music-mcp 已连接 · ${this.tools.length} 个工具`);
  }

  async callTool(name, args) {
    const result = await this.request('tools/call', { name, arguments: args || {} }, 10000);
    const text = result && result.content && result.content[0] && result.content[0].text;
    if (!text) throw new Error('MCP 没有返回内容');
    return JSON.parse(text);
  }

  async readPlayer() {
    const result = await this.request('resources/read', { uri: 'music://player' });
    const text = result && result.contents && result.contents[0] && result.contents[0].text;
    if (!text) throw new Error('MCP 没有返回播放状态');
    return JSON.parse(text);
  }
}

const mcp = new McpClient(path.join(ROOT, 'mcp', 'netease-music-mcp.mjs'));
mcp.start();

/* ---------------- 静态文件 ---------------- */
async function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel === '/' || rel === '') rel = '/index.html';
  if (/(^|\/)\.env(\.|$)/.test(rel) || rel.includes('/.git/')) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 Not Found');
  }

  const filePath = path.normalize(path.join(ROOT, rel));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden');
  }

  let stat;
  try {
    stat = await fs.stat(filePath);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 Not Found');
  }
  if (stat.isDirectory()) {
    res.writeHead(302, { Location: `${pathname.replace(/\/?$/, '/')}index.html` });
    return res.end();
  }

  const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';

  // Range 支持，视频拖动进度需要
  const range = req.headers.range;
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (m) {
      let start = m[1] ? Number(m[1]) : 0;
      let end = m[2] ? Number(m[2]) : stat.size - 1;
      if (start >= stat.size) {
        res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` });
        return res.end();
      }
      end = Math.min(end, stat.size - 1);
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-store',
      });
      return createReadStream(filePath, { start, end }).pipe(res);
    }
  }

  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-store',
  });
  createReadStream(filePath).pipe(res);
}

async function handleTts(req, res) {
  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch (e) {
    return sendJson(res, 400, { error: `请求解析失败：${e.message}` });
  }

  const { provider = 'minimax', key, groupId, voiceId, text, model, speed, pitch, endpoint } = payload || {};
  const content = String(text || '').trim();
  if (!content) return sendJson(res, 400, { error: '缺少文本' });
  if (content.length > 300) return sendJson(res, 400, { error: '文本太长（最多 300 字）' });

  try {
    if (provider === 'minimax') {
      const useKey = key || process.env.MINIMAX_API_KEY;
      const useGroup = groupId || process.env.MINIMAX_GROUP_ID || '';
      if (!useKey) return sendJson(res, 400, { error: '缺少 MiniMax Key' });

      const base = String(endpoint || 'https://api.minimax.chat/v1/t2a_v2').replace(/\/+$/, '');
      const url = useGroup ? `${base}?GroupId=${encodeURIComponent(useGroup)}` : base;
      const upstream = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${useKey}`,
        },
        body: JSON.stringify({
          model: model || 'speech-02-hd',
          text: content,
          stream: false,
          voice_setting: {
            voice_id: voiceId || 'male-qn-jingying',
            speed: Number(speed) || 1,
            vol: 1,
            pitch: Number(pitch) || 0,
          },
          audio_setting: {
            sample_rate: 32000,
            bitrate: 128000,
            format: 'mp3',
            channel: 1,
          },
        }),
      });

      const raw = await upstream.text();
      if (!upstream.ok) return sendJson(res, 502, { error: `MiniMax ${upstream.status}：${clip(raw)}` });

      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        return sendJson(res, 502, { error: `MiniMax 返回的不是 JSON：${clip(raw)}` });
      }
      if (data && data.base_resp && data.base_resp.status_code !== 0) {
        return sendJson(res, 502, { error: data.base_resp.status_msg || 'MiniMax 合成失败' });
      }
      const hex = data && data.data && data.data.audio;
      if (!hex) return sendJson(res, 502, { error: 'MiniMax 没有返回音频' });

      const buf = Buffer.from(String(hex), 'hex');
      if (!buf.length) return sendJson(res, 502, { error: '音频为空' });
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buf.length,
        'Cache-Control': 'no-store',
      });
      return res.end(buf);
    }

    if (provider === 'elevenlabs') {
      const useKey = key || process.env.ELEVENLABS_API_KEY;
      if (!useKey) return sendJson(res, 400, { error: '缺少 ElevenLabs Key' });

      const voice = voiceId || '21m00Tcm4TlvDq8ikWAM';
      const base = String(
        endpoint || `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}`
      ).replace(/\/+$/, '');
      const upstream = await fetch(base, {
        method: 'POST',
        headers: {
          'xi-api-key': useKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: content,
          model_id: model || 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      });
      if (!upstream.ok) {
        const raw = await upstream.text();
        return sendJson(res, 502, { error: `ElevenLabs ${upstream.status}：${clip(raw)}` });
      }
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buf.length,
        'Cache-Control': 'no-store',
      });
      return res.end(buf);
    }

    if (provider === 'openai') {
      const useKey = key || process.env.OPENAI_API_KEY;
      if (!useKey) return sendJson(res, 400, { error: '缺少 OpenAI Key' });
      const base = String(endpoint || 'https://api.openai.com/v1/audio/speech').replace(/\/+$/, '');
      const upstream = await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${useKey}` },
        body: JSON.stringify({
          model: model || 'tts-1',
          voice: voiceId || 'alloy',
          input: content,
          response_format: 'mp3',
        }),
      });
      if (!upstream.ok) {
        const raw = await upstream.text();
        return sendJson(res, 502, { error: `OpenAI ${upstream.status}：${clip(raw)}` });
      }
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buf.length,
        'Cache-Control': 'no-store',
      });
      return res.end(buf);
    }

    return sendJson(res, 400, { error: '未知的语音服务' });
  } catch (e) {
    return sendJson(res, 502, { error: e.message });
  }
}

/* ---------------- 启动 ---------------- */
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');

  if (url.pathname === '/api/chat') {
    if (req.method !== 'POST') return sendJson(res, 405, { error: '只接受 POST' });
    return handleChat(req, res);
  }

  if (url.pathname === '/api/tts') {
    if (req.method !== 'POST') return sendJson(res, 405, { error: '只接受 POST' });
    return handleTts(req, res);
  }

  if (url.pathname === '/api/health') {
    return sendJson(res, 200, { ok: true, mcp: mcp.ready });
  }

  if (url.pathname === '/api/music/list') {
    const dirs = [
      { dir: path.join(ROOT, 'music'), base: 'music', local: false },
      { dir: path.join(ROOT, 'assets', 'music'), base: 'assets/music', local: false },
      { dir: path.join(ROOT, 'assets', 'music-local'), base: 'assets/music-local', local: true },
    ];
    const tracks = [];
    for (const { dir, base, local } of dirs) {
      try {
        const files = await fs.readdir(dir);
        for (const f of files) {
          if (!/\.(mp3|flac|m4a|wav|ogg|aac)$/i.test(f)) continue;
          tracks.push({
            name: f.replace(/\.[^.]+$/, ''),
            file: f,
            url: `/${base}/${encodeURIComponent(f)}`,
            local,
          });
        }
      } catch {
        /* folder missing is fine */
      }
    }
    tracks.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    return sendJson(res, 200, { tracks });
  }

  if (url.pathname === '/api/music/open') {
    const ip = req.socket.remoteAddress || '';
    const local = /^(::1|127\.|::ffff:127\.)/.test(ip);
    if (!local || process.platform !== 'win32') {
      return sendJson(res, 403, { error: '仅本地 Windows 版可用' });
    }
    try {
      spawn('explorer.exe', [path.join(ROOT, 'music')], { detached: true, stdio: 'ignore' }).unref();
      return sendJson(res, 200, { ok: true });
    } catch (e) {
      return sendJson(res, 500, { error: e.message });
    }
  }

  if (url.pathname === '/api/mcp/status') {
    return sendJson(res, 200, {
      connected: mcp.ready,
      error: mcp.error,
      tools: mcp.tools.map((t) => ({ name: t.name, description: t.description })),
    });
  }

  if (url.pathname === '/api/mcp/state') {
    if (!mcp.ready) return sendJson(res, 503, { error: mcp.error || 'MCP 未连接' });
    try {
      const state = await mcp.readPlayer();
      return sendJson(res, 200, { ok: true, state });
    } catch (e) {
      return sendJson(res, 502, { error: e.message });
    }
  }

  if (url.pathname === '/api/mcp/call') {
    if (req.method !== 'POST') return sendJson(res, 405, { error: '只接受 POST' });
    if (!mcp.ready) return sendJson(res, 503, { error: mcp.error || 'MCP 未连接' });
    try {
      const payload = JSON.parse(await readBody(req));
      if (!payload || !payload.name) return sendJson(res, 400, { error: '缺少工具名' });
      const result = await mcp.callTool(payload.name, payload.arguments || {});
      return sendJson(res, 200, { ok: true, result });
    } catch (e) {
      return sendJson(res, 502, { error: e.message });
    }
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('405 Method Not Allowed');
  }

  return serveStatic(req, res, url.pathname);
});

const basePort = Number(process.env.PORT) || 5173;
const HOST = process.env.HOST || (process.argv.includes('--lan') ? '0.0.0.0' : '127.0.0.1');

function listen(port, attempt = 0) {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempt < 12) {
      listen(port + 1, attempt + 1);
    } else {
      console.error('[心跳] 启动失败：', err.message);
      process.exit(1);
    }
  });
  server.listen(port, HOST, () => {
    const url = `http://127.0.0.1:${port}`;
    console.log('');
    console.log('  ▣  EmptyBox OS · 被托管的手机');
    console.log(`     打开：${url}`);
    if (HOST === '0.0.0.0') {
      for (const list of Object.values(os.networkInterfaces())) {
        for (const item of list || []) {
          if (item.family === 'IPv4' && !item.internal) {
            console.log(`     手机：http://${item.address}:${port}/after.html`);
          }
        }
      }
    }
    console.log(`     旧版游戏：${url}/game.html`);
    console.log(`     网易云 MCP：${mcp.ready ? '已连接' : '连接中…'}`);
    console.log('     Ctrl+C 结束服务');
    console.log('');
    if (WANT_OPEN) {
      const cmd = process.platform === 'win32' ? 'cmd' : process.platform === 'darwin' ? 'open' : 'xdg-open';
      const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url];
      spawn(cmd, args, { detached: true, stdio: 'ignore' }).unref();
    }
  });
}

listen(basePort);
