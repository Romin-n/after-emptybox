# AFTER · EmptyBox 陪伴 App

《EmptyBox 空盒子》真结局之后的非商业陪伴 App：一台手机里的 **AFTER** 应用，三位角色 —— **Load**、**左见**、**林创**。

> 这是一个非商业陪伴 App，与官方无隶属关系。角色、CG、原作音乐版权归 **MIMU 製作組** 及原作者所有，详见 [NOTICE.md](NOTICE.md)。

## 现在能做什么

- **开场**：矢量「EMPTY BOX」盒子 → AFTER，静音自动播放
- **主页**：Load → 左见 → 林创，全屏 CG，交叉淡入切换
- **对话**：整张 CG + 游戏式台词（无聊天框），Palatino 角色名
- **自由聊天**：接 OpenAI 兼容接口；每个角色独立记忆，存在浏览器本地
- **语音**：19 条预生成日语语音包（无 Key 可播）；MiniMax / ElevenLabs 可选；自动判断中日文；自由聊天可先翻译成日语再读
- **主动消息**：按角色性格触发，玩家可选「克制 / 标准 / 粘人」，开启前有消耗提示
- **CG 画廊**：查看、保存
- **一起听**：本地音乐播放器；按角色分「他的歌 / 全部」；不内置任何音乐
- **权限（模拟）**：允许后，离开超过 15 秒再回来，角色会先开口

## 运行

```bash
node server.mjs            # http://127.0.0.1:5173/after.html
node server.mjs --lan      # 局域网，手机可访问
```

公开部署（Render / VPS / Docker）见 [DEPLOY.md](DEPLOY.md)；没有账号的临时分享见 [SHARE.md](SHARE.md)。

手机和电脑连同一个 Wi-Fi，打开：

```
http://<电脑局域网IP>:5173/after.html
```

首页 `index.html` 是旧的手机 OS 原型；当前主线是 `after.html`。

## 配置

### 聊天 AI

对话面板右上角 **⚙** → 填接口地址 / 模型 / Key。默认 DeepSeek：

```
https://api.deepseek.com/v1
deepseek-chat
```

Key 只存在浏览器 localStorage，不会上传到别处（除了你填的接口本身）。

### 语音

对话面板右上角 **🎵** 是「一起听」；语音设置在 **设置 → 语音设置**：

- **预生成语音包**：优先播放，不需要 Key
- **MiniMax / ElevenLabs**：需要各自的 Key，可实时合成
- **语音语言**：自动 / 中文 / 日语

重新生成语音包：

```bash
# 1. 在项目根目录建 .env.local（不要提交）
# MINIMAX_API_KEY=...
# 2. 编辑 assets/voice/lines.json 里的 text / say / voice
node tools/tts-generate.mjs
```

生成结果在 `assets/voice/`，索引是 `assets/voice/index.json`；已有文件会跳过。

### 音乐

- **`assets/music/`**：公开曲目，只放可商用 / 已授权的音乐，会随项目发布
- **`assets/music-local/`**：个人曲目，放 OST、自己买的歌等；已在 `.gitignore` 中，不随公开版发布
- 当前本地已导入 EmptyBox 角色 OST 和两首 MP3，仅你自己能听
- `assets/music/licenses.json` 标记授权：`free`（可商用）/ `personal`（仅个人）/ 未标记为「待确认」
- `assets/music/characters.json` 配置角色专属歌单（按歌名匹配）
- 界面里 `music-local` 的曲目会显示「仅本地」

## 目录

```
after.html                  AFTER 主界面
css/after.css               样式
js/after.js                 交互 / 聊天 / 语音 / 音乐 / 权限
server.mjs                  静态服务 + /api/chat + /api/tts + /api/music/list + MCP 桥
assets/cg/                  角色 CG
assets/voice/               预生成语音 + lines.json / index.json
assets/music/               用户自己的音乐
assets/intro/               开场视频（可选）
mcp/netease-music-mcp.mjs   旧版音乐 MCP（模拟播放器）
tools/                      截图、OCR、语音生成、测试
```

## 已知限制

- **手机端布局**还在调整（比例 / 黑边）
- **主动消息**只在页面打开时检查，没有后台推送
- **权限**是页面内的模拟，不会真的读取系统或其他应用
- 自由聊天的**日语配音**需要聊天 AI 的 Key 来做翻译
- 网易云 MCP 是模拟播放器，没有真实音频；真实播放走「一起听」本地音乐

## 内容警告

含心理恐怖、元叙事、监控 / 控制关系描写，以及不适暗示。**这不是一款轻松的恋爱游戏。**

## 版权声明

- 《EmptyBox 空盒子》及其角色、剧情、CG、音乐版权归 **七零 / 巴洛**（MIMU 製作組）所有
- 本项目是**非商业陪伴 App**，不售卖、不代表官方；如原作者不希望这个项目存在，会立即停止并删除
- 角色 CG 来自官方公开素材，仅用于非商业展示；如权利人要求，会立即删除
- 语音为 **MiniMax** 合成的 AI 语音，并非原作声优
- 对话由 **AI** 生成，不代表官方剧情
- 原作鸣谢：**七零**（程序 / 制作人）、**巴洛**（美术）、**YUKILUV**（音乐）；抖音：**Sevenzero（53470993）**
- 前端制作：**Romi**
- 代码采用 MIT 许可；角色 / CG / 语音等素材**不在** MIT 范围内

删除请求与联系方式见 [NOTICE.md](NOTICE.md)。

## License

代码：MIT（见 [LICENSE](LICENSE)）。素材：归各自权利人所有。
