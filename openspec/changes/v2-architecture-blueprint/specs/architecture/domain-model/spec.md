# Spec Delta

## Purpose

定义二维能力地图（一般身体能力 × 乒乓球表现能力）与四层数据模型（Observation → AssessmentResult → CapacityState → LimiterFinding），把用户能力状态从动作分类中解耦，并规范动作内容库与内容治理的可计算资源结构与证据引用。

## ADDED Requirements

### Requirement: 能力模型与动作分类解耦

系统 SHALL 将现有 `Ability` 枚举拆解为三个独立概念：`Capacity`（用户能力状态）、`TrainingTarget`（训练目标）、`ExerciseCategory`（动作分类），使动作库与用户能力模型互不绑定。

#### Scenario: 动作分类与用户能力状态独立演化

- **WHEN** 新增一个训练动作或改变用户能力状态
- **THEN** 不需要修改另一方的类型定义，二者通过目标（Target）间接关联

### Requirement: 二维能力地图

系统 SHALL 以二维能力地图描述用户状态：一般身体能力（健康状态、身体基础）与乒乓球表现能力（专项身体预备、感知与控制、技术与表现），并按「一般 × 专项」组合决定训练策略。

#### Scenario: 一般与专项组合决定训练策略

- **WHEN** 系统识别用户的一般身体能力与专项能力水平组合（如低/高、高/低）
- **THEN** 系统按对应策略分配训练重点（如「一般低、专项高」时上调 General 权重并限制高冲击专项训练）

### Requirement: 四层数据模型与原始事实不可覆盖

系统 SHALL 将数据分为四层：`Observation`（原始测量）、`AssessmentResult`（协议结果）、`CapacityState`（派生状态）、`LimiterFinding`（决策结论），且派生分数不得覆盖原始 Observation，规则升级后可从原始数据重新计算。

#### Scenario: 算法升级后能力状态可重算

- **WHEN** 能力派生算法或规则版本升级
- **THEN** 系统从保留的原始 Observation 重新计算 CapacityState，历史原始测量不被覆盖

### Requirement: Limiter 引擎优先级计算

系统 SHALL 用「缺口 × 目标相关度 × 迁移证据 × 数据置信度 × 可训练性」计算 Limiter 优先级，而非简单取最低分。

#### Scenario: 短板优先级可解释

- **WHEN** 系统输出一个 Limiter 排序
- **THEN** 每个 limiter 附判断理由、支持证据、反证或不确定性、推荐训练方向、复测协议与时间，以及什么结果会使该 limiter 失效

### Requirement: 动作作为可计算处方资源

系统 SHALL 将动作条目建模为可计算资源，至少包含 `id`、`version`、`title`、`targets`（能力目标）、`scenes`、`equipment`、`doseOptions`、`load`（心肺/冲击/协调负荷）、`jointLoadTags`、`prerequisites`、`contraindicationTags`、`regressionIds`、`progressionIds`、`instructions`、`stopRules`、`evidenceRefs` 与 `reviewStatus`。

#### Scenario: 处方引擎消费动作资源

- **WHEN** 处方引擎选择动作
- **THEN** 能基于动作的 targets、load、prerequisites、contraindicationTags 与 regression/progression 关系进行过滤、剂量与退阶/进阶

### Requirement: 内容治理与证据引用

系统 SHALL 为动作内容建立发布状态（Draft → Technical Review → Sports/Medical Review → Published → Deprecated）与证据引用 `EvidenceRef`（来源类型含 guideline/paper/expert/tutorial），并对绝对表述、适用人群、疼痛与心肺风险、左右手持拍差异、退阶/进阶方案进行审核。

#### Scenario: 动作内容发布前可追溯审核状态

- **WHEN** 动作内容进入训练库
- **THEN** 该动作具有明确的 `reviewStatus` 与证据引用，未经审核的内容不进入默认处方
