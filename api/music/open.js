export default function handler(req, res) {
  res.status(403).json({ error: '公开版不能打开文件夹，请用「添加本地音乐」' });
}
