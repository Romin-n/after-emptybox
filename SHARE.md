# 不用账号，先让大家玩到

## 方案 A：Cloudflare 临时隧道（最快，推荐先试）

不需要注册，电脑开着就能生成一个公网地址。

1. 先在项目根目录开一个终端，运行：

   ```bash
   node server.mjs
   ```

2. 再开一个终端，运行：

   ```powershell
   .\share.ps1
   ```

   第一次会自动下载 `cloudflared.exe`（约 30 MB）。

3. 终端会打印一行：

   ```
   https://xxxx-xxxx.trycloudflare.com
   ```

   把它发给朋友，打开：

   ```
   https://xxxx-xxxx.trycloudflare.com/after.html
   ```

**注意：**

- 你的电脑必须一直开着、服务器不能关
- 每次重启地址都会变
- 国内访问 `trycloudflare.com` 的速度看网络，可能慢
- 关掉终端 = 链接失效

---

## 方案 B：同一个 Wi-Fi（完全不用外网）

```bash
node server.mjs --lan
```

终端会打印：

```
http://192.168.x.x:5173/after.html
```

手机连同一个 Wi-Fi，直接打开。适合在家里/宿舍给身边的人玩。

---

## 方案 C：打包给别人，让他们自己跑

1. 先构建干净的发布包：

   ```powershell
   node tools/make-release.mjs
   Compress-Archive -Path release\* -DestinationPath after-emptybox.zip -Force
   ```

   发布包已经排除 `assets/music-local/`、`assets/ref/`、`shots/`、`.env*`。

2. 对方装 Node 20+，解压后：

   ```bash
   npm start
   ```

3. 打开 `http://127.0.0.1:5173/after.html`

缺点：玩家要装 Node，适合懂电脑的朋友。

---

## 方案 D：长期公开（需要账号）

想要一个**固定、电脑关了也能访问**的地址，就必须有一个托管账号：

- **GitHub + Render 免费档**：注册免费，约 10 分钟；步骤见 [DEPLOY.md](DEPLOY.md)
- **VPS**：需要买服务器，最稳
- **Cloudflare Tunnel + 自己的域名**：需要 Cloudflare 账号

没有账号又想长期公开，基本没有免费又稳定的办法——这是现实。

---

## 上线前

- 别把 `assets/music-local/` 发出去
- 关于页的联系方式、版权声明保留
- 公开版 AI / TTS 的 Key 由玩家自己填
