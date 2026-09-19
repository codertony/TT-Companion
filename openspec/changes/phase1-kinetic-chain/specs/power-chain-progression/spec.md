# Spec Delta

## Purpose

提供发力训练的分级进阶路径，让用户从身体感知逐步过渡到带节奏的连续动作（Phase 1 覆盖 Level 0–3）。

## ADDED Requirements

### Requirement: Level 0 身体感知
系统 SHALL 提供 Level 0 不挥拍的身体感知训练，覆盖足底、髋、转体、肩臂放松。

#### Scenario: Level 0
- **WHEN** 用户选择 Level 0
- **THEN** 系统提供不挥拍的足底 / 髋 / 转体 / 肩臂放松练习

### Requirement: Level 1 分段动作
系统 SHALL 提供 Level 1 极慢分段训练，顺序为脚 → 髋 → 身体 → 手。

#### Scenario: Level 1
- **WHEN** 用户选择 Level 1
- **THEN** 系统按「脚 → 髋 → 身体 → 手」分段提示，每段之间停顿

### Requirement: Level 2 连续动作
系统 SHALL 提供 Level 2 连续动作训练，不分段停顿，形成连续波动。

#### Scenario: Level 2
- **WHEN** 用户选择 Level 2
- **THEN** 系统不再分段停顿，引导连续完成

### Requirement: Level 3 节奏变化
系统 SHALL 提供 Level 3 节奏训练，节奏为「慢 → 慢 → 快」，即前半段建立动作、击球前加速。

#### Scenario: Level 3
- **WHEN** 用户选择 Level 3
- **THEN** 系统以「慢 → 慢 → 快」节奏提示，后半段为加速
