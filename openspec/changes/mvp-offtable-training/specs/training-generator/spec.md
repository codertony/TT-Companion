# Spec Delta

## Purpose

按「场景 × 时长 × 当前 Cue × 当日状态」生成分步训练计划，作为纯函数规则引擎，保证输入相同则输出相同。

## ADDED Requirements

### Requirement: 输入与输出
训练生成器 SHALL 接受场景（scene）、时长（durationMin）、当前 Cue（cue）、当日状态（feeling）作为输入，并输出一个含 steps 数组的训练计划。

#### Scenario: 生成计划
- **WHEN** 以「家 / 10 分钟 / 有 Cue / 状态好」调用生成器
- **THEN** 返回的计划含非空 steps，且总时长接近 600 秒（±15 秒）

### Requirement: 场景过滤
生成器 SHALL 仅从动作库中挑选 scenes 包含目标场景的动作；地铁场景 SHALL 额外排除 space > 0 或 intensity = high 的动作。

#### Scenario: 地铁场景
- **WHEN** 以 metro_sit 场景调用生成器
- **THEN** 所有输出动作的 scenes 含 metro_sit，且 space = 0、intensity ≠ high

### Requirement: 状态降负荷
当 feeling = tired 时，生成器 SHALL 排除高强度动作，并优先排列放松（relaxation）与活动度（mobility）类动作。

#### Scenario: 疲劳状态
- **WHEN** 以 feeling = tired 调用生成器
- **THEN** 输出不含 intensity = high 的动作，且 relaxation/mobility 动作排在前面

### Requirement: Cue 命中优先
当传入当前 Cue 且其 tags 非空时，生成器 SHALL 将与 Cue 的 tags 命中的动作置顶，保证计划中至少一步关联当前问题。

#### Scenario: 关联 Cue
- **WHEN** 传入 tags 为 [hand_first] 的 Cue
- **THEN** 计划首步命中 cueMap 含 hand_first 的动作

### Requirement: 纯函数
对相同输入，生成器 SHALL 产生完全相同的输出（无副作用、无随机性）。

#### Scenario: 重复调用
- **WHEN** 以完全相同参数调用生成器两次
- **THEN** 两次返回的计划逐字段相等
