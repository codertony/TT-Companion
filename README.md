# 离台训练伴侣 · TT-Companion

移动端优先的乒乓球**离台训练 PWA**：帮助业余乒乓球爱好者在无球台的工作日，利用通勤 / 办公室 / 家里的碎片时间做离台专项训练（感知 · 发力 · 反应 · 预判 · 整合），周末回到真实球台验证。

> 核心命题：没有球台的五天里，维持并改善「能打好乒乓球的身体与神经系统」。

## 技术栈

- **React 19 + TypeScript + Vite**（PWA，移动端优先，桌面 480px 单列）
- **Tailwind CSS v4**（CSS-first）
- **本地 `localStorage`** 存储（无后端、无账号）
- **Vitest + ESLint**（flat config）

## 快速开始

```bash
pnpm install     # 安装依赖
pnpm dev         # 本地开发
pnpm verify      # 一键验证（见下方）
```

## 命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动 Vite dev server |
| `pnpm build` | 类型检查 + 生产构建（`dist/`） |
| `pnpm preview` | 预览构建产物 |
| `pnpm lint` | ESLint 检查 |
| `pnpm typecheck` | `tsc --noEmit` 类型检查 |
| `pnpm test` | Vitest 单测 |
| `pnpm verify` | `lint + typecheck + test + build`（改代码后必跑） |

## 目录结构

```
docs/                    # 产品方案 / 技术方案 / 交互设计 / 路线图
src/
  types/                 # 领域类型（类型先行）
  lib/                   # storage 等纯函数封装
  features/              # 页面（home / train / reaction / ...）
  components/ hooks/ stores/ data/   # 后续按方案填充
.github/workflows/       # ci.yml（verify）+ deploy.yml（GitHub Pages）
CLAUDE.md                # 项目开发约定
```

## 部署

GitHub Pages（自动发布，`deploy.yml`）：

**https://codertony.github.io/TT-Companion/**

首次需在仓库 **Settings → Pages → Source 设为「GitHub Actions」**。

## 文档

| 文档 | 内容 |
| --- | --- |
| [产品方案](docs/产品方案.md) | 功能级详细规格 |
| [技术方案](docs/技术方案.md) | 技术栈 / 类型 / 数据层 / 实现 |
| [交互与体验设计](docs/交互与体验设计.md) | 设计系统 / 交互 / 时机化提示 |
| [产品路线图](docs/产品路线图.md) | 能力模型 / 方法论 / 分阶段规划 |
