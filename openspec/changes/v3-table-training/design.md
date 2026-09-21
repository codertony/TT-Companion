# Design

## Context

V2 已建立离台训练的领域内核（`domain/safety.ts` 安全门、`domain/capacity.ts` 能力派生、`domain/limiter.ts` 短板排序、`domain/prescription.ts` 配比分配）、Repository 模式（`lib/repository.ts`）、Zustand persist（`ttc:` 命名空间）、HashRouter 导航与统一结果模型。V3 新增一个**并行的台上训练领域**，复用上述模式而不改动既有离台类型与数据。动机见 proposal.md。

## Goals / Non-Goals

**Goals:**
- 台上训练可独立「选目标 → 生成进阶链 → 编排课表 → 计时执行 → 记录」，纯函数核心可单测。
- 与离台数据只读整合：ONE CUE / limiter / Check-in 安全门 → 台上重点。
- 移动端优先、中文单语、复用现有 Tailwind/设计语言。

**Non-Goals:**
- 不做摄像头/骨架动作识别（V2 Phase 4 已排除）。
- 不接发球机/多球硬件——只输出训练指导文案。
- 不做云端多用户、不做 LLM 自动处方（规则驱动、可解释、离线可用）。
- 不改动既有离台训练的行为规格与 localStorage 数据。

## Decisions

### 1. 台上训练作为并行领域，而非扩展 Exercise

`Drill` 是「球路 / 双方任务 / 随机度 / 升级条件」语义，与离台 `Exercise`（单人不持拍动作，含 `scenes`/`equipment`/`intensity`）差异大。强行复用会产生大量可空字段。
- **决策**：新增 `src/types` 中 `ProgressionLayer`、`Drill`、`BallSource`、`TableSession`、`DrillDimension` 等类型，独立于既有 `Exercise`/`Capacity`。
- **备选**：扩展 `Exercise` 加 `drill` 字段——否决，语义混淆且污染处方引擎。

### 2. 内容库用种子数据 + 生成公式用纯函数

- **决策**：`src/data/tableDrills.ts` 存 L1–L7 球路套路种子数据（对应 `data/exercises.ts`）；`src/domain/tableGenerator.ts` 提供纯函数 `generateDrillChain(target, ballSource, level)` 按「技术 × 落点 × 移动 × 旋转 × 随机度 × 前后板」组合出进阶链。
- **备选**：LLM 实时生成——否决，规则可解释、可单测、离线可用，且不引入新依赖。

### 3. 七层模型以 §三 表为权威

文档 §三 给出权威 7 层表（L1 单技术 / L2 固定落点 / L3 固定移动 / L4 半随机 / L5 随机 / L6 发接发前三板 / L7 条件比赛）；但 §五/§六 内容小节自带编号「L2 固定移动 / L3 固定组合」，与权威表错位一位。
- **决策**：以 §三 表为层定义；§四–§十 的具体球路内容按**语义**归入对应层（固定移动/固定组合内容归入 L2/L3）。
- **备选**：沿用 §五/§六 编号——否决，会导致「固定落点」层无定义、编号与进阶链不齐。

### 4. 配比与随机度演进用可校准常量

训练配比（当前 30/25/20/15/10 → 目标 15/20/25/20/20）与随机度演进是产品假设，仿照 `prescription.ts` 的 `allocateTraining` 做法：纯函数 + 集中常量 + `rationale` 说明。
- **决策**：`src/domain/tableRatio.ts` 输出五类配比与理由，常量集中便于校准。

### 5. 球源降难度用标签驱动的纯函数过滤

球搭子水平（一般/更高）作为输入，`adaptForPartner(drill, partnerLevel)` 纯函数输出降难度后的规则文案（落点放宽到半台、速度改高弧线、旋转先上旋）。发球机/多球适用性作为 `Drill.ballSources` 标签 + 专项提示文案。

### 6. 台上训练课执行用轻量计时器

复用 `TrainRun.tsx` 的 StepRunner 风格：按课表段计时 + 3–6 分钟换人提醒，不做复杂事件协议（V2 的 `ExecutionEvent` 已够用）。台上无法自动判断击球质量，升级条件用「自评达标」记录，不夸大自动化。

### 7. 整合只读离台 store、写独立命名空间

- **读**：`useCueStore`（primary CUE）、`useAssessmentStore`/limiter（短板）、`useCheckinStore` + `evaluateSafety`（安全门）、`useFeedbackStore`（移动迁移）。
- **写**：新增 `ttc:tableSession` 命名空间存 `TableSession`；周末验证继续复用 `Feedback.movementResult`。既有数据零迁移。

### 8. 自我教练闭环用纯函数 + 自检记录 store

五问自检、四道门槛、Level A–G 进阶/退阶、3 球诊断均为可单测纯函数，集中在 `src/domain/tableCheck.ts`；自检记录 `SelfCheckRecord`（六指标 + 最常见失误分类）持久化到 `ttc:tableCheck`，驱动反馈递减与主注意点迁移。`Drill` 数据模型增加 `focusPoint`（唯一主注意点）、`gates`（四道门槛阈值）、`selfCheck`（五问自检项）字段，升级条件引用门槛而非纯板数。

## Risks / Trade-offs

- [七层编号错位（§三 vs §五/六）导致归层混乱] → 以 §三 表为权威，本设计记录映射，实现时在内容库每条标注 `layer`。
- [训练配比常量不贴合个体] → 常量集中、UI 标注「可调」，后续可加个性化校准。
- [发球机/多球只有文案指导、无硬件] → 明确为训练指导（Non-Goal），不承诺自动喂球。
- [台上无真实计时/自动判断] → 以「升级条件自评 + 换人提醒」代替，文案不夸大自动化。
- [与离台类型耦合] → 只读离台 store、不写；`TableSession` 独立命名空间；新增类型不改既有字段。
- [自检为主观自评、缺客观验证] → 用明确阈值文案 + 六指标记录 + 反馈递减明确为「自我教练」，不夸大自动判断；姿态识别属远期目标。

## Migration Plan

- 纯新增：新增类型、`data/tableDrills.ts`、`domain/tableGenerator.ts`、`domain/tableRatio.ts`、`stores/tableStore.ts`、页面与路由。
- 数据：`ttc:tableSession` 为全新 key，无迁移；既有离台数据不变。
- 部署：沿用 GitHub Pages + HashRouter，`base: './'`，新增路由无需后端。

## Open Questions

（无——发球机/多球硬件对接、摄像头识别等均已在 Non-Goals 排除，若后续要做另立 change。）
