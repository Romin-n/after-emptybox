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

  const { provider = 'minimax', key, groupId, voiceId, text, model, speed, pitch, endpoint } = payload;
  const content = String(text || '').trim();
  if (!content) return res.status(400).json({ error: '缺少文本' });
  if (content.length > 300) return res.status(400).json({ error: '文本太长（最多 300 字）' });

  try {
    if (provider === 'minimax') {
      const useKey = key || process.env.MINIMAX_API_KEY;
      const useGroup = groupId || process.env.MINIMAX_GROUP_ID || '';
      if (!useKey) return res.status(400).json({ error: '缺少 MiniMax Key' });

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
      if (!upstream.ok) return res.status(502).json({ error: `MiniMax ${upstream.status}：${clip(raw)}` });

      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        return res.status(502).json({ error: `MiniMax 返回的不是 JSON：${clip(raw)}` });
      }
      if (data && data.base_resp && data.base_resp.status_code !== 0) {
        return res.status(502).json({ error: data.base_resp.status_msg || 'MiniMax 合成失败' });
      }
      const hex = data && data.data && data.data.audio;
      if (!hex) return res.status(502).json({ error: 'MiniMax 没有返回音频' });

      const buf = Buffer.from(String(hex), 'hex');
      if (!buf.length) return res.status(502).json({ error: '音频为空' });
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).send(buf);
    }

    if (provider === 'elevenlabs') {
      const useKey = key || process.env.ELEVENLABS_API_KEY;
      if (!useKey) return res.status(400).json({ error: '缺少 ElevenLabs Key' });

      const voice = voiceId || '21m00Tcm4TlvDq8ikWAM';
      const base = String(
        endpoint || `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}`,
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
        return res.status(502).json({ error: `ElevenLabs ${upstream.status}：${clip(raw)}` });
      }
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).send(buf);
    }

    if (provider === 'openai') {
      const useKey = key || process.env.OPENAI_API_KEY;
      if (!useKey) return res.status(400).json({ error: '缺少 OpenAI Key' });
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
        return res.status(502).json({ error: `OpenAI ${upstream.status}：${clip(raw)}` });
      }
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).send(buf);
    }

    return res.status(400).json({ error: '未知的语音服务' });
  } catch (e) {
    return res.status(502).json({ error: e.message });
  }
}
