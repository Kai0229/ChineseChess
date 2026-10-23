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

## 手机适配

900px 以下使用对弈 / 设置 / 棋谱导航，切换面板保留当前棋局；支持安全区、整格触摸落点、44px 起的操作按钮及系统减少动态效果偏好。小屏竖屏压缩顶部内容，横屏将操作按钮放在棋盘侧边。浏览器验证包含 320×568、375×667、390×844、430×932、768×1024、844×390 和桌面布局。

## 最高难度与中国风棋盘

棋力选项新增并默认选择「巅峰对决 · 最高难度」。最高难度使用 Web Worker 后台计算、约 4 秒时间预算、迭代加深、Alpha-Beta 剪枝、置换缓存及吃子静态延伸搜索；会优先检查将杀和吃子交换。具体搜索深度随设备和局面变化，不标注未经测量的等级分。悔棋、重开、切换模式或棋力会取消旧计算，避免过期落子。

棋盘采用鎏金框线与金箔底色；棋子采用深浅翡翠玉色、金属包边和描金文字。楚河汉界包含连续平移的远近山峦、流水波纹、雾气、微光及行舟。关闭动态特效会暂停河道，系统减少动态效果偏好也会禁用动画。

测试现包含 11 项棋规测试与 7 项搜索测试（将杀、避免亏子、解将、时间预算、输入不变及走法生成一致性）。
