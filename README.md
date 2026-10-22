# 墨棋 · 中国象棋 MVP

现代网页象棋，原生 HTML / CSS / JavaScript，无构建依赖。

## 本地运行

在项目目录执行 `python3 -m http.server 5173 --directory dist`，浏览器打开 http://localhost:5173 。也可以直接打开 dist/index.html（字体加载需要网络，离线回退系统字体）。

## 功能

- 本地双人与入门 / 标准人机（标准使用两层搜索）
- 中国象棋走法、蹩马腿、塞象眼、炮架、九宫、过河、将帅照面、自陷将军校验
- 合法落点、将军提醒、无合法走法判负
- 吃子粒子 / 冲击波 / 震屏与合成音效，均可关闭
- 悔棋、翻转棋盘、棋谱、吃子记录，响应式布局

## MVP 边界

无在线联机、账户、云端存档；刷新重置棋局。暂不实现长将长捉及重复局面裁定。AI 为轻量体验版。

## 测试

`node tests/engine.test.cjs`

本机也可以双击 `启动墨棋.command`，然后打开浏览器访问上述地址。当前机器无系统 Node 时，启动器会使用 ChatGPT 附带的 Node。

已经通过 11 项引擎测试与浏览器实际操作检查：人机落子及回棋、悔棋、切换双人、炮吃马、吃子特效和吃子记录。

## GitHub Pages 部署

项目已包含 `.github/workflows/deploy-pages.yml`。在 GitHub 仓库的 Settings → Pages 中，将 Source 设置为 GitHub Actions。推送到仓库默认分支后，工作流会运行棋规测试，然后将 `dist/` 部署至 GitHub Pages。也支持在 Actions 页面手动运行。

页面资源使用相对路径，支持 `https://用户名.github.io/仓库名/` 形式的项目地址。
