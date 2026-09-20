# Spec Delta

## Purpose

定义统一训练执行器模型（TrainingPrescription → Block → Set → Step → ExecutionEvent），使计时动作、组次力量、反应刺激、视频遮挡、心理模拟、评估测试、恢复与球台验证共享同一套执行与事件协议。

## ADDED Requirements

### Requirement: 统一执行层级模型

系统 SHALL 用 `TrainingPrescription → Block → Set → Step → ExecutionEvent` 统一承载所有训练类型，避免每种训练建立互不相容的页面状态。

#### Scenario: 不同类型训练共享同一执行器

- **WHEN** 用户执行计时动作、组次训练、反应刺激或评估测试中的任意一种
- **THEN** 均通过 Block/Set/Step 层级执行，并产出统一格式的执行事件

### Requirement: Block 类型覆盖

系统 SHALL 支持以下 Block 类型：`timed_exercise`、`repetition_exercise`、`reaction_stimulus`、`assessment`、`video_occlusion`、`mental_rehearsal`、`recovery`、`on_table_validation`。

#### Scenario: 每种训练有对应 Block 类型

- **WHEN** 处方中包含计时动作、力量组次、反应、遮挡、心理模拟、恢复或球台验证
- **THEN** 每个训练单元都能映射到对应的 Block 类型

### Requirement: 统一执行事件

系统 SHALL 以 `ExecutionEvent` 记录执行事件，包含 `id`、`sessionId`、`blockId`、`type`（start / pause / resume / complete / skip / pain / quality）、`at` 与可选 `payload`。

#### Scenario: 完整记录训练过程

- **WHEN** 用户开始、暂停、恢复、完成、跳过、报告疼痛或提交质量自评
- **THEN** 每个动作产生对应的执行事件，可用于恢复、真实时长统计与后续行为分析

### Requirement: 中途退出与恢复

系统 SHALL 支持训练中途退出后恢复到退出点，而非从头开始。

#### Scenario: 训练中断可恢复

- **WHEN** 用户在训练中途退出（如锁屏或切走）
- **THEN** 再次进入可恢复到中断的 Block/Set/Step 位置，真实训练时长与已完成事件被保留

### Requirement: 质量反馈与疼痛退出

系统 SHALL 在动作完成后采集质量反馈（而非仅「完成」），并支持疼痛事件导致的中途退出。

#### Scenario: 质量反馈与疼痛退出

- **WHEN** 动作完成或用户报告疼痛
- **THEN** 系统记录质量自评或 pain 事件，疼痛事件可触发退出并反映在后续处方与安全决策中

### Requirement: 动作条目作为可计算资源被统一执行

系统 SHALL 使执行器消费动作条目的训练目的、标准动作与 ONE CUE、组/次/时间/休息、常见错误、停止条件、退阶/进阶、左右侧要求，而不依赖各页面自行硬编码。

#### Scenario: 动作条目驱动执行界面

- **WHEN** 执行器展示一个动作
- **THEN** 从动作资源读取目的、提示、组次、休息、错误、停止条件与退阶/进阶，统一渲染而非散落实现
