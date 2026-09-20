# Spec Delta

## Purpose

定义六阶段训练处方引擎、训练配比模型与处方「为什么 + 替代方案」解释要求，使训练计划从「动作排序」升级为「可解释、可复测的训练处方」。

## ADDED Requirements

### Requirement: 六阶段处方流水线

系统 SHALL 将计划生成拆为六个阶段：安全过滤 → 能力与前置条件过滤 → 训练配比分配 → 动作与剂量选择 → 会话排程与负荷校验 → 解释与替代方案。

#### Scenario: 生成器分阶段可单测

- **WHEN** 系统生成训练处方
- **THEN** 每个阶段是独立纯函数（安全过滤、配比、选择、排程、解释），可单独测试并固定输入产出固定结果

### Requirement: 训练配比模型

系统 SHALL 以 `TrainingAllocation` 表达训练配比，包含 general / movement / perception / technique / recovery 五个分量与决策理由，配比数值作为可校准的产品假设而非固定科学标准。

#### Scenario: 按状态输出配比

- **WHEN** 系统根据用户状态（如基础明显不足、基础正常但技术瓶颈、疲劳 Yellow）计算配比
- **THEN** 输出对应的五分量比例与 rationale，且比例随状态变化

### Requirement: 处方包含为什么

系统 SHALL 使 `TrainingPrescription` 包含 `id`、`date`、`safetyDecisionId`、`allocation`、`blocks`、`reasons`、`alternatives` 与 `ruleSetVersion`，任何推荐动作都能回答为什么是它、针对哪个 limiter 或 Cue、为什么这个剂量、为什么没推荐更高一级、可替换为什么。

#### Scenario: 推荐动作可追溯

- **WHEN** 处方中推荐一个动作
- **THEN** 该动作附「为什么推荐、针对哪个短板/ Cue、为什么是这个剂量、为什么不推荐更高一级、不方便时可替换为什么」

### Requirement: 总时长与负荷校验

系统 SHALL 校验处方总时长不超预算，且禁用标签（来自安全决策的 `blockedExerciseTags`）不进入处方。

#### Scenario: 处方不超预算且不含禁用动作

- **WHEN** 系统生成处方
- **THEN** 总时长不超出用户可用时间预算，且任何被安全规则禁用的动作标签不进入计划

### Requirement: 处方可解释到输入与规则版本

系统 SHALL 使训练处方能够解释到输入数据与规则版本，规则更新不静默篡改历史决策。

#### Scenario: 历史处方决策不变

- **WHEN** 规则集版本更新
- **THEN** 历史已生成的处方保留其生成时的规则版本与决策理由，不被静默改写
