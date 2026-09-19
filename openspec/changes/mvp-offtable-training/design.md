# Design

## Context

项目已搭好脚手架（React 19 + TS + Vite + Tailwind v4 + 统一命令 + CI/部署），本地 `pnpm verify` 全绿，线上 `https://codertony.github.io/TT-Companion/` 可访问。当前 `src/` 只有 demo 首页、`types/index.ts`（领域类型）与 `lib/storage.ts`。动机见 proposal.md - Why，完整技术细节见 `docs/技术方案.md`。

关键约束：
- 移动端优先，桌面 480px 单列；无后端、无账号，数据本地 `localStorage`。
- 部署到 GitHub Pages（项目子路径），需静态托管兼容。
- 训练生成器必须是可单测的纯函数。

## Goals / Non-Goals

**Goals:**
- 用最小改动把 demo 升级为可用的 MVP 闭环（场景/时长 → 训练 → 反馈 → 统计）。
- 保证 `pnpm verify`（lint + typecheck + test + build）始终全绿，CI 与本地同一套命令。
- 领域类型先行，纯函数逻辑（生成器、Cue 判定）可单测。

**Non-Goals:**
- 不做 PWA 的 service worker/离线缓存（`vite-plugin-pwa` 留到 M5）。
- 不做摄像头/姿态识别、视频遮挡预判、AI Coach（路线图 Phase 1–4）。
- 不做账号、云同步、i18n、深色主题以外的复杂视觉。

## Decisions

### D1：路由用 HashRouter，而非 BrowserRouter
- **选择**：React Router v7 的 `HashRouter`，URL 形如 `/#/train`。
- **理由**：GitHub Pages 是纯静态托管、无服务端 rewrite，BrowserRouter 直接访问子路径会 404；HashRouter 无需 404 回退，且不影响 PWA 添加到主屏。
- **备选**：BrowserRouter + `basename` + `404.html` 拷贝技巧——URL 更干净但多一处脆弱配置，放弃。

### D2：`base: './'` 相对路径，而非硬编码 `/TT-Companion/`
- **选择**：Vite `base: './'`，产物资源用相对路径。
- **理由**：不绑定仓库名，将来改名或绑自定义域名零改动；本地 dev/preview 无需带前缀。
- **备选**：`base: '/TT-Companion/'`——显式但硬编码，放弃。

### D3：状态管理用 Zustand + persist，持久层用薄封装 `storage.ts`
- **选择**：持久化 store 用 Zustand `persist` 中间件（自带 version/migrate）；`storage.ts` 只提供 `get/set/remove/exportAll/clearAll` 工具。
- **理由**：Zustand 极轻，persist 原生支持 schema 版本迁移；`storage.ts` 作为唯一 localStorage 触点，未来迁 IndexedDB/云端只换这一层。
- **备选**：手写 Context + useReducer——样板多；手写迁移——与 persist 的 version 机制重复，放弃。

### D4：训练生成器为纯函数 + 依赖注入
- **选择**：`generatePlan(input)` 纯函数，`exercises` 作为参数注入。
- **理由**：可单测、输入相同输出相同，符合 CLAUDE.md「纯函数必须可单测、依赖注入」约束。
- **备选**：生成器内部 import 动作库——测试需 mock，放弃。

### D5：时机化提示用 `useTimedPrompts` hook 调度
- **选择**：执行器按 step 的 `timedPrompts`（按 `atSec` 排序）到点切换当前提示，一次只显示 1 条；顶部 ONE CUE 条独立常驻。
- **理由**：意识/发力类动作需要「在正确时机」提示，而非一次性倒出；用 `endAt` 时间戳校正避免计时漂移。
- **备选**：静态列表展示全部提示——违背「一屏一任务、一次一条」的交互原则，放弃。

### D6：语音用浏览器 `SpeechSynthesis`
- **选择**：内置 TTS，零依赖，`lang='zh-CN'`。
- **理由**：无需音频文件；锁屏/后台不可用时降级提示。
- **备选**：预录音频（Web Audio）——需音频素材，MVP 先不用，留作 V2 兜底。

## Risks / Trade-offs

- [SpeechSynthesis 在部分移动端后台/锁屏静音] → 能力检测 + 降级提示「请保持前台」；V2 预录音频兜底。
- [localStorage 5MB 上限] → 数据量极小（纯文本），风险低；超标再迁 IndexedDB（只换 storage 层）。
- [计时漂移] → 用 `endAt = Date.now() + remainMs` 校正，不用 setInterval 累加。
- [iOS PWA 兼容差异（wakeLock / standalone）] → 能力检测 + 静默降级。
- [Tailwind v4 生态兼容] → 用官方 `@tailwindcss/vite`，不走旧 PostCSS 链。
- [TypeScript 版本被钉在 5.9.3] → `typescript-eslint` 尚不支持 TS 7，锁 5.x 直到其支持。

## Open Questions

<!-- 无：影响 spec 或任务拆分的决策均已在上述 Decisions 中确定 -->
