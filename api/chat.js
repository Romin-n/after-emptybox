const ALLOWED = (process.env.ALLOWED_UPSTREAMS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const clip = (s) => String(s || '').slice(0, 300);

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: '只接受 POST' });

  let payload = req.body || {};
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      return res.status(400).json({ error: '请求解析失败' });
    }
  }

  const { endpoint, key, model, messages, temperature = 1, maxTokens = 200 } = payload;
  const base = String(endpoint || '').trim().replace(/\/+$/, '');
  if (!base) return res.status(400).json({ error: '缺少接口地址' });
  if (!/^https?:\/\//i.test(base)) return res.status(400).json({ error: '接口地址必须以 http:// 或 https:// 开头' });
  if (!Array.isArray(messages) || !messages.length) return res.status(400).json({ error: '缺少 messages' });

  if (ALLOWED.length) {
    let host = '';
    try {
      host = new URL(base).hostname.toLowerCase();
    } catch {
      /* ignore */
    }
    const ok = host && ALLOWED.some((h) => host === h || host.endsWith(`.${h}`));
    if (!ok) return res.status(403).json({ error: '该接口地址不在允许列表内' });
  }

  const url = /\/chat\/completions$/i.test(base) ? base : `${base}/chat/completions`;
  const headers = { 'Content-Type': 'application/json' };
  if (key) headers.Authorization = `Bearer ${key}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 55000);

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model || 'deepseek-chat',
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: false,
      }),
      signal: controller.signal,
    });

    const raw = await upstream.text();
    if (!upstream.ok) return res.status(502).json({ error: `上游返回 ${upstream.status}：${clip(raw)}` });

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(502).json({ error: `上游返回的不是 JSON：${clip(raw)}` });
    }

    const message = (data && data.choices && data.choices[0] && data.choices[0].message) || {};
    const content = message.content;
    const toolCalls = message.tool_calls || null;
    if (!content && !toolCalls) {
      return res.status(502).json({ error: `上游没有返回内容：${clip(raw)}` });
    }
    return res.status(200).json({
      text: content ? String(content).trim() : '',
      toolCalls,
      model: data.model || model,
    });
  } catch (e) {
    const code = e.cause && e.cause.code ? `（${e.cause.code}）` : '';
    const message = e.name === 'AbortError' ? '请求超时（55 秒）' : `连接失败：${e.message}${code}`;
    return res.status(502).json({ error: message });
  } finally {
    clearTimeout(timer);
  }
}
