# Design

## Context

现状（见 proposal.md - Why）：TT-Companion 是移动端优先、无后端、localStorage 存储的 React 19 + TS + Vite + Zustand + HashRouter 应用。当前 `src/lib/generator.ts` 只做过滤与排序；`Ability` 枚举同时承担内容分类与用户能力模型；反应/预判/遮挡/张力结果只存在页面局部 state；`DataPage` 是打卡统计而非能力 Dashboard；文档宣称 PWA 但代码无完整 PWA 实现。

约束：移动端优先（触控 ≥48px、桌面 max-width 480px 单列）、纯函数可单测、领域类型集中、`pnpm verify` 全绿 + 真实浏览器验证为完成标准。本 change 只产出规划，不改代码。

## Goals / Non-Goals

**Goals:**
- 把 V2.0 目标架构、领域模型、核心引擎、数据架构与路线图固化为可追溯的规格与设计。
- 为后续按 Phase / Epic 拆子 change 提供权威边界与验收锚点。
- 明确「领域内核 + 纵向切片」的演进策略，避免重写式大爆炸。

**Non-Goals:**
- 不在本 change 内实现任何代码、迁移或页面改动。
- 不固定具体阈值/配比数值（作为可校准产品假设，非医学标准）。
- 不设计多用户、教练、远程评估、云同步的具体协议——仅预留扩展点。

## Decisions

1. **方案 C：领域内核 + 纵向切片**（优于 A「继续堆页面」与 B「先做完整平台底座」）。理由：最快验证核心价值、架构可持续；初期覆盖指标少是可接受代价。推翻条件见 proposal/roadmap 规格。
2. **模块化单体，不做微服务**。理由：个人、本地优先应用，分布式无价值。
3. **规则引擎负责安全与处方边界，大模型只解释决策**。理由：医疗与训练准入不能被模型自由裁量；规则全部带版本与测试用例。
4. **能力模型与动作库解耦**：`Ability` 拆为 `Capacity` / `TrainingTarget` / `ExerciseCategory`。理由：用户状态是事实、动作是可处方资源，不应绑定。
5. **记录原始事实、派生结果可重算**：四层模型 `Observation → AssessmentResult → CapacityState → LimiterFinding`，派生分数不覆盖原始值。
6. **Layer 0 是全局约束层**，不是孤立页面：影响首页、计划、动作过滤、强度、复测与数据解释。
7. **先打通一个纵向闭环**：首个切片「单腿稳定/下肢控制 → 步法稳定」，再扩指标。
8. **存储分工**：Zustand 只存 UI 状态/偏好；Repository 接口隔离领域与存储；时间序列落 IndexedDB；导入优先级「手工 → JSON → CSV → 平台适配 → 原生健康」。
9. **目录分层**：`domain/`（纯函数，不依赖 React/浏览器/Zustand）、`application/`（编排用例）、`features/`（交互）、`content/`（版本化知识资产）、`infrastructure/`（持久化/导入导出/sync）、`shared/`（通用 UI/时间/ID/校验）。
10. **统一执行器**：`Block → Set → Step → Event` 取代多套互不相容页面状态，现有 `ReactionTrainer` 适配统一接口而非废弃。

## Risks / Trade-offs

- [评估填写成本高、拖累启动率] → 首次建档仅 3–6 项最小测试；Check-in 目标中位 ≤20 秒；训练启动率不低于基线 85% 的阈值。
- [安全规则误拦截或错误放行] → 阈值作为可校准假设，采集误拦截反馈，红/黄触发率纳入最小产品指标。
- [IndexedDB 引入增加复杂度] → Phase 0 先建 Repository 接口，Phase 1 再决定是否直接落 IndexedDB，先保持 localStorage 可运行。
- [大范围重构破坏现有功能] → 增量交付，保持现有 UI 可运行，不一次性重写页面；Phase 0 先修真实性问题再上领域内核。
- [派生结论不被信任] → 每个 limiter/处方附理由、证据、反证与失效条件；数据不足显式标记而非伪造分数。

## Migration Plan

1. Phase 0 先修复 `club` 空计划、补真实 PWA 或降级文案、实现 JSON 导入导出与 schema 迁移，建立 Repository 接口与统一结果模型（现有 Session/Cue/Feedback 迁到 schema v2，不丢数据）。
2. 再引入领域内核（Epic A），拆分 `Ability` 并新增 `domain/safety`、`capacity`、`assessment`、`prescription`，保持 UI 可运行。
3. 沿「单腿稳定纵向切片」（Epic D）打通评估→处方→执行→验证→复测，再接入 Readiness（Epic C）与处方引擎（Epic E）、统一执行器（Epic F）。
4. 每阶段以 `pnpm verify` + 规则黄金用例 + E2E 纵向链路 + 真实浏览器验证为回滚边界；任一阶段失败可回退到上一可运行快照。

## Open Questions

- IndexedDB 是否在 Phase 1 直接接入，还是先通过 Repository 保持 localStorage。
- 是否需要原生壳接健康平台（HealthKit/Health Connect 无法作为纯 PWA 浏览器 API）。
- 视频素材的版权、存储与标注方案。
- 是否支持多用户、教练与远程评估。
- 是否将动作识别项目与 TT-Companion 合并。
