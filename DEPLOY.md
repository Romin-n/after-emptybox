# 公开部署指南

> AFTER 不是纯静态网页：聊天、语音、音乐列表都要经过 `server.mjs` 的 `/api/*` 代理。
> 所以不能直接丢 GitHub Pages / Netlify 静态托管，需要一台能跑 Node 的服务。

---

## 方法 0：不用 Git，网页上传（推荐给没装 Git 的人）

### 1. 生成发布包

```bash
node tools/make-release.mjs
```

会生成 `release/`，约 16 MB，已经排除 OST、`ref/`、截图、`.env`。

### 2. 注册 GitHub

<https://github.com/signup>，免费，只要邮箱、用户名、密码。

### 3. 新建仓库

GitHub 右上角 **+ → New repository**：

- 名字：`after-emptybox`
- 选 **Public**
- 不要勾 README / .gitignore
- Create

### 4. 上传 release 的内容

1. 打开新建的仓库，点 **Add file → Upload files**
2. 打开 `release/` 文件夹，**全选里面的所有内容**（`assets`、`css`、`js`、`after.html`、`server.mjs` 等）
3. 拖进网页
4. 等上传完，点 **Commit changes**

⚠️ 不要把 `release` 文件夹本身拖进去；要拖它**里面的内容**，保证 `server.mjs` 在仓库根目录。

### 5. Render 部署

1. <https://render.com> → 用 GitHub 登录
2. **New → Web Service** → 选 `after-emptybox`
3. Runtime **Node**，Start Command `npm start`
4. 环境变量：

| Key | Value |
|---|---|
| `HOST` | `0.0.0.0` |
| `ALLOWED_UPSTREAMS` | `api.deepseek.com,api.openai.com,api.moonshot.cn,open.bigmodel.cn,dashscope.aliyuncs.com,api.siliconflow.cn,openrouter.ai,generativelanguage.googleapis.com,www.xinyuntoken.com,xinyuntoken.com` |

5. Deploy，等几分钟
6. 打开 `https://xxx.onrender.com/after.html`

之后电脑可以关，Render 在云上跑。

---

## 方法 1：有 Git 的话

### 1. 准备仓库

确认这些**不要**提交：

- `assets/music-local/`（版权 OST）
- `.env*`（任何 Key）
- `shots/`（测试截图，可选）

`.gitignore` 已经包含 `music-local` 和 `.env*`。

```bash
git init
git add .
git commit -m "AFTER"
git remote add origin <你的 GitHub 仓库>
git push -u origin main
```

### 2. 在 Render 建 Web Service

1. 打开 <https://render.com>，用 GitHub 登录
2. **New → Web Service**，选你的仓库
3. 设置：
   - Runtime：**Node**
   - Build Command：`npm install --omit=dev`
   - Start Command：`npm start`
   - Plan：**Free**
4. 环境变量：

| Key | Value |
|---|---|
| `HOST` | `0.0.0.0` |
| `ALLOWED_UPSTREAMS` | `api.deepseek.com,api.openai.com,api.moonshot.cn,open.bigmodel.cn,dashscope.aliyuncs.com,api.siliconflow.cn,openrouter.ai,generativelanguage.googleapis.com,www.xinyuntoken.com,xinyuntoken.com` |

`ALLOWED_UPSTREAMS` 是**必须的**：不然 `/api/chat` 会变成任何人都能用的任意代理（SSRF）。
用户要用别的 OpenAI 兼容站，把它加进这个逗号分隔的列表即可。

5. 点 **Create Web Service**，等 2–5 分钟
6. 打开 `https://<服务名>.onrender.com/after.html`

也可以直接用仓库里的 `render.yaml`（Render 支持 Blueprint 一键部署）。

### 3. 自定义域名（可选）

Render → Settings → Custom Domain，按提示加 CNAME。
免费档不用域名也能玩，只是地址长一点。

---

## 备选方案

### VPS / 云服务器

```bash
# 装 Node 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 拉代码
git clone <仓库> && cd <仓库>
npm install --omit=dev

# 用 pm2 常驻
sudo npm i -g pm2
HOST=0.0.0.0 ALLOWED_UPSTREAMS=... pm2 start server.mjs --name after
pm2 save && pm2 startup
```

Nginx 反代到 `127.0.0.1:5173`，再上 Certbot 证书。

### Docker

```bash
docker build -t after .
docker run -d -p 8080:8080 --env-file .env after
```

### 只想先给朋友看（临时）

Cloudflare Tunnel 把本机 5173 映射出去：

```bash
cloudflared tunnel --url http://127.0.0.1:5173
```

电脑关机就断，适合演示，不适合长期。

---

## 上线前检查

- [ ] `assets/music-local/` 没进仓库
- [ ] `.env*` 没进仓库
- [ ] `ALLOWED_UPSTREAMS` 已设置
- [ ] 关于页的联系方式正确
- [ ] 试一遍：聊天、语音、CG、权限、主动消息
- [ ] 手机打开一次，确认竖屏布局
- [ ] 官方 CG / 角色的版权声明已在「关于」里

## 成本与注意

- **Render 免费档**会休眠：一段时间没人访问，首次打开要等 30–60 秒
- 用户自带 AI / TTS Key，存在浏览器 localStorage；服务器只做转发
- `music-local` 不会部署，公开版「一起听」是空的；要放歌就放**可商用/已授权**的进 `assets/music/`
- 免费档带宽有限，CG 总量约 5 MB，够用；别把 4K 原图直接塞进去
- 公开版请保留「关于 / 版权」里的原作者署名与联系方式
