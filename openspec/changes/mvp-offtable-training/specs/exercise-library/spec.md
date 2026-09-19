# Spec Delta

## Purpose

提供离台训练动作库，每个动作携带场景、空间、强度、问题标签以及时机化提示序列等元数据，供训练生成器与执行器消费。

## ADDED Requirements

### Requirement: 动作元数据
每个动作 SHALL 包含以下字段：名称、所属能力维度（ability）、可用场景（scenes）、空间需求（space）、器材（equipment）、时长（durationMin）、强度（intensity）、问题标签（cueMap）、静态提示（cue）与时机化提示（timedPrompts）。

#### Scenario: 读取动作
- **WHEN** 系统加载动作库
- **THEN** 每个动作对象包含上述全部字段

### Requirement: 时机化提示序列
意识类与发力感觉类动作 SHALL 提供按时间点（atSec）触发的提示序列；反应类动作的 timedPrompts SHALL 为空数组。

#### Scenario: 意识类动作
- **WHEN** 用户执行「足底三点感知」动作
- **THEN** 该动作 timedPrompts 非空，且每个提示含 atSec、type、text

#### Scenario: 反应类动作
- **WHEN** 用户执行「颜色反应」动作
- **THEN** 该动作 timedPrompts 为空数组，由刺激驱动而非时间提示

### Requirement: 场景归属
每个动作 SHALL 声明其允许出现的场景列表（scenes），生成器据此过滤。

#### Scenario: 过滤动作
- **WHEN** 生成器按「地铁坐姿」场景筛选动作
- **THEN** 仅返回 scenes 包含 metro_sit 的动作
