# Spec Delta

## Purpose

让用户以最少的点击次数（目标 2～3 次）选择训练场景与时长，快速进入一次离台训练，并按场景约束过滤不适合的动作。

## ADDED Requirements

### Requirement: 场景选择
系统 SHALL 提供地铁、办公室、家、球馆四种训练场景供选择；当用户选择地铁时，系统 SHALL 追加「坐姿 / 站姿」二级选择。

#### Scenario: 选择地铁场景
- **WHEN** 用户在场景选择页选择「地铁」
- **THEN** 系统显示「坐姿 / 站姿」二级选择，而非直接进入时长选择

#### Scenario: 选择非地铁场景
- **WHEN** 用户选择「办公室」「家」或「球馆」
- **THEN** 系统直接进入下一步，不显示坐/站二级选择

### Requirement: 时长选择
系统 SHALL 提供 1 / 3 / 5 / 10 分钟四个训练时长档位，并 SHALL 默认推荐 3 分钟或 5 分钟。

#### Scenario: 查看时长档位
- **WHEN** 用户进入时长选择页
- **THEN** 系统显示四个档位，其中 3 分钟与 5 分钟标记为「推荐」

### Requirement: 地铁动作约束
在地铁场景下生成的训练计划 SHALL 不包含任何需要空间（space > 0）或高强度（intensity = high）的动作。

#### Scenario: 地铁场景生成训练
- **WHEN** 用户在地铁场景生成训练计划
- **THEN** 计划中所有动作的 space 为 0 且 intensity 不为 high
