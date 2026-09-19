# Proposal

## Why

业余乒乓球爱好者工作日无球台、周末才打球，技术问题的纠正周期长达 7 天。本 change 交付 TT-Companion 的 MVP（Phase 0）：把「周末发现的问题 → 工作日碎片化离台训练 → 周末验证」跑成闭环，用移动端 PWA + 本地存储，让用户在 1～10 分钟碎片时间里维持并改善「能打好乒乓球的身体与神经系统」。

## What Changes

- 新增移动端优先的 PWA 骨架：底部 4 Tab（首页 / 训练 / 数据 / 我的），桌面 480px 单列居中。
- 新增「场景 + 时长」入口：地铁（坐/站）/ 办公室 / 家 / 球馆 × 1/3/5/10 分钟，2～3 次点击即可开始训练。
- 新增 ONE CUE 系统：每周唯一动作提醒（技术/意识/移动三类型）+ Backlog 生命周期（draft→active→done→archived）。
- 新增动作库（约 24 个离台动作）与训练生成器（规则引擎，按 场景×时长×Cue×状态 生成计划）。
- 新增训练执行：分步 + 倒计时 + 时机化提示（意识/发力感觉类动作按 `atSec` 到点提示）。
- 新增反应训练（5 种刺激模式：方向/正反手/颜色/数字/双条件）与音频提示（语音随机刺激）。
- 新增周末验证：4 档反馈 + Cue 连续 2 周改善自动完成判定。
- 新增数据统计（周次数/连续天数/反应趋势）与本地 `localStorage` 持久化（含导出/清空）。

> 范围说明：本 change 只覆盖 **MVP（Phase 0，对应 M0–M5）**。路线图 Phase 1–4（发力链、张力训练、视频遮挡预判、心理模拟、整合、姿态识别）已记录在 `docs/产品路线图.md`，将作为后续独立 change，不在此范围内。

## Capabilities

### New Capabilities

- `training-onboarding`: 场景与时长选择，2～3 次点击进入训练，地铁场景做坐/站二级选择与动作约束。
- `one-cue`: 每周唯一动作提醒的生命周期管理（创建/激活/归档/完成）与 Backlog 优先级排序。
- `exercise-library`: 离台动作库（含场景、空间、强度、cueMap、时机化提示序列等元数据）。
- `training-generator`: 按场景×时长×当前 Cue×当日状态生成训练计划的规则引擎（纯函数）。
- `training-execution`: 分步执行训练计划，倒计时、暂停/跳过/结束，时机化提示展示。
- `reaction-training`: 随机刺激反应训练（方向/正反手/颜色/数字/双条件，可配置刺激时长与间隔）。
- `audio-cue`: 耳机语音随机刺激（左/右/正手/反手/短/长），通勤不盯屏可用。
- `weekend-feedback`: 周末对本周 ONE CUE 迁移效果的 4 档反馈，并触发 Cue 完成/继续判定。
- `training-stats`: 训练数据统计（周完成率、连续天数、反应时间趋势、累计次数）。
- `data-persistence`: 训练数据本地 `localStorage` 持久化（刷新保留、导出、清空）。

### Modified Capabilities

<!-- 无：全新项目，无既有 spec 需要修改 -->

## Impact

- **代码**：`src/`（types / lib / stores / hooks / features / components / data）、`package.json` 统一命令、`CLAUDE.md`。
- **技术栈**：React 19 + TS + Vite + Tailwind v4；新增 Zustand、React Router（HashRouter）、`vite-plugin-pwa`。
- **存储**：本地 `localStorage`（`ttc:` 命名空间，schema 版本化），无后端、无账号。
- **CI/部署**：`.github/workflows/ci.yml`（verify）+ `deploy.yml`（GitHub Pages，地址 `https://codertony.github.io/TT-Companion/`）。
- **依赖新增**：`zustand`、`react-router-dom`、`vite-plugin-pwa`。
