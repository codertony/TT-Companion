# CLAUDE.md

## 项目简介

乒乓球离台训练伴侣（TT-Companion）：移动端优先的 PWA，帮助业余乒乓球爱好者在无球台的工作日做离台专项训练，周末回真实球台验证。完整方案见 `docs/`（产品方案 / 技术方案 / 交互与体验设计 / 产品路线图）。

## 技术栈

- React 19 + TypeScript + Vite
- Tailwind CSS v4（`@tailwindcss/vite`，CSS-first 配置）
- 状态 Zustand（后续引入）；数据本地 `localStorage`
- 测试 Vitest + jsdom；Lint ESLint（flat config）

## 目录结构

- `docs/` —— 产品/技术/交互/路线图四份文档
- `src/` —— 源码（`types` / `lib` / `features` / `components` / `stores` / `hooks` / `data`）
- `.github/workflows/` —— CI（verify）+ GitHub Pages 部署

## 命令

- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm lint` / `pnpm typecheck` / `pnpm test`
- `pnpm verify` = `lint + typecheck + test + build`

## 编码约束

- 中文单语 UI；移动端优先（触控目标 ≥ 48px，桌面 max-width 480px 单列居中）
- 纯函数（如训练生成器）必须可单测、依赖注入
- 领域类型集中在 `src/types/index.ts`，类型先行

## 修改原则

- **任何代码修改完成后必须执行 `pnpm verify`。**
- **任何用户可见 Web UI 修改，都必须进行真实浏览器验证（Playwright MCP），不得仅根据代码推断 UI 工作正常。**

## Definition of Done

- `pnpm verify` 全绿（lint + typecheck + test + build）
- 涉及 UI 的改动已完成浏览器验证
- 本地与 CI 使用同一套命令，不允许两套标准
