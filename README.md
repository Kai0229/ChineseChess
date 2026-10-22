# 墨棋 · 中国象棋

使用 **Node.js 24 + Vite 8** 开发、构建，部署至 **Vercel**。

## 本地开发

```sh
npm ci
npm run dev
```

访问终端显示的地址（默认 http://localhost:5173）。本机也可双击 `启动墨棋.command`。

## 验证与生产构建

```sh
npm run check
npm test
npm run build
npm run preview
```

构建结果位于 `dist/`；该目录由 Vite 生成，不提交到仓库。生产预览默认在 http://localhost:4173。

## Vercel 部署

从 Vercel 导入 GitHub 仓库 `Kai0229/ChineseChess`，配置如下：

- Framework Preset：Vite
- Root Directory：仓库根目录
- Node.js：24.x
- Install Command：`npm ci`
- Build Command：`npm run build`
- Output Directory：`dist`

配置已写入 `vercel.json` 和 `package.json`。关联 GitHub 后，默认分支的提交触发生产部署，其他分支和 PR 可生成预览部署。也可通过 Vercel CLI 在根目录执行 `vercel --prod`。

GitHub Actions 负责语法检查、棋规测试和 Vite 构建；站点发布交由 Vercel。

## 源码结构

- `index.html`：网页入口
- `src/main.js`：界面交互、音效、吃子特效、人机回合
- `src/engine.js`：象棋规则与轻量 AI，采用 ES Modules
- `src/style.css`：响应式现代中式界面
- `tests/engine.test.js`：11 项棋规及 AI 验证

## 功能与 MVP 边界

支持本地双人、两档人机、合法落点、将军提示、无合法走法判负、悔棋、翻转棋盘、棋谱、吃子记录和可关闭的动态特效及音效。

当前为浏览器本地对弈；Node.js 用于开发和构建。暂不包含在线联机、账户和云端存档；刷新会重置棋局，暂不裁定长将、长捉和重复局面。
