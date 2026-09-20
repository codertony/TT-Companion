# Proposal

## Why

当前 TT-Companion 本质上是「离台训练内容库 + 计时执行器 + ONE CUE 记录器」：反应、预判、遮挡、张力等专项功能各自平行，动作库与用户能力模型混在同一个 `Ability` 枚举里，训练生成器只会按场景/时长排序动作，训练结果没有统一持久化。它无法回答五个关键问题——今天是否适合训练、当前真正限制表现的能力是什么、今天为什么练这些、训练过程中发生了什么、几周后用什么证据判断有效。

要升级为「以个人状态和能力瓶颈为输入、以安全可执行可复测的训练处方为输出的个人训练操作系统」，必须先做一次架构级重构。本 change 是 **V2.0 总纲蓝图**：把目标架构、领域模型、核心引擎、数据架构和分阶段路线图固化为 OpenSpec 规格，作为后续按 Phase / Epic 拆解子 change 的权威依据。本 change 只做规划，不修改仓库代码。

## What Changes

- 建立七能力域产品架构：用户目标与约束 / 健康与状态 / 能力评估 / 训练决策 / 训练执行 / 专项验证 / 洞察与复测，外加「内容与规则治理」横切域。
- **BREAKING** 将 `Ability` 枚举拆解为 `Capacity`（用户能力状态）、`TrainingTarget`（训练目标）、`ExerciseCategory`（动作分类），动作库与用户能力模型解耦。
- 建立四层数据模型 `Observation → AssessmentResult → CapacityState → LimiterFinding`：原始测量值持久化，派生能力状态与短板结论可重算、带置信度。
- 引入三态安全门（Green / Yellow / Red）与可解释规则引擎；大模型只能解释决策，不得改变安全状态或训练准入。
- **BREAKING** 将训练生成器 `generatePlan()` 拆为六阶段纯函数链：安全过滤 → 能力与前置条件过滤 → 训练配比分配 → 动作与剂量选择 → 会话排程与负荷校验 → 解释与替代方案。
- 统一训练执行器为 `Block → Set → Step → Event` 模型，覆盖计时动作、组次力量、反应刺激、视频遮挡、心理模拟、评估测试、恢复、球台验证；引入统一 `ExecutionEvent` 以支持中途恢复、跳过原因、疼痛事件、质量自评。
- **BREAKING** 数据架构升级为模块化单体：`Repository` 接口 + IndexedDB 存事件与时间序列（Observation/Session/Event），Zustand 仅存 UI 状态与偏好；新增真实 JSON 下载/导入/校验/schema 迁移，数据源与协议版本可追溯。
- 定义分阶段路线图 Phase 0–4 与 Epic A–F；首个纵向切片为「单腿稳定/下肢控制 → 步法稳定」。
- 明确非目标：不做疾病诊断与医学风险评分、不压成单一总分、不先上云端多用户、首版不接 HealthKit/Health Connect、评估协议稳定前不做大模型自动处方、不先建复杂摄像头动作识别。

## Capabilities

### New Capabilities

- `architecture/product-domains`: 七能力域与核心功能模块（首页 Today / 评估中心 / 计划中心 / 训练执行器 / 内容库 / 洞察 / 设置），以及四 Tab 导航职责重定义。
- `architecture/domain-model`: 二维能力地图（一般身体能力 × 乒乓球表现能力）、四层数据模型与 Limiter 引擎（短板优先级计算）。
- `architecture/safety-readiness`: 三态安全门（Green/Yellow/Red）、`SafetyDecision` 规则、Readiness 原因分解。
- `architecture/prescription`: 六阶段处方引擎、`TrainingAllocation` 配比、`TrainingPrescription` 的「为什么 + 替代方案」。
- `architecture/execution`: 统一执行器 `Block/Set/Step/Event` 模型与 `ExecutionEvent` 协议。
- `architecture/data-storage`: 模块化单体、Repository 接口、IndexedDB 与 Zustand 分工、导入导出优先级与数据来源版本。
- `architecture/roadmap`: 分阶段迭代（Phase 0–4）、Epic A–F 任务拆分、质量与测试金字塔、领域不变量、最小产品指标与非目标。

### Modified Capabilities

（无——本 change 为总纲蓝图，不改动既有行为规格；现有能力规格由后续子 change 按需修改。）

## Impact

- **领域模型与类型**：`src/types/index.ts` 中的 `Ability` 将被拆解，影响动作库、训练生成器、数据页与各专项训练页。
- **训练生成器**：`src/lib/generator.ts` 将拆为安全/配比/选择/排程四层纯函数。
- **训练执行**：`TrainRun.tsx`、`ReactionTrainer`、`OcclusionPage`、心理模拟等需适配统一 `Block/Set/Step/Event` 模型。
- **持久化**：新增 Repository 与 IndexedDB 层，现有 Session/Cue/Feedback 需 schema 迁移，且不丢数据。
- **数据页与导航**：数据页从打卡统计升级为决策解释与趋势中心；四 Tab 职责重定义。
- **PWA 与测试**：补真实 PWA 能力或降级文案；新增规则黄金用例、属性测试与主流程 E2E 基线。

> 本 change 交付物为规格与路线图；所有代码改动由后续 `/opsx:apply` 驱动的子 change 完成。
