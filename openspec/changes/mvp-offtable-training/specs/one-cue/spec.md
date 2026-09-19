# Spec Delta

## Purpose

管理每周唯一的动作提醒（ONE CUE）及其待办（Backlog）的完整生命周期，确保用户一次只专注纠正一个技术问题。

## ADDED Requirements

### Requirement: 唯一激活
系统 SHALL 保证任意时刻最多只有一个 Cue 处于 active（激活）状态。

#### Scenario: 激活新 Cue
- **WHEN** 用户将某个 Cue 设为「本周 Cue」而当前已有激活 Cue
- **THEN** 旧激活 Cue 自动转为 archived，新 Cue 成为唯一 active

### Requirement: Cue 类型
每个 Cue SHALL 具有一个类型字段，取值为「技术（technique）/ 意识（perception）/ 移动（movement）」之一。

#### Scenario: 创建 Cue
- **WHEN** 用户创建新 Cue
- **THEN** 系统要求用户为该 Cue 选择一个类型，并允许勾选问题标签（tags）

### Requirement: Backlog 排序
Backlog SHALL 支持按优先级（priority）升序排列，并支持上移 / 下移调整顺序。

#### Scenario: 调整 Backlog 顺序
- **WHEN** 用户将某条 Backlog 上移一位
- **THEN** 该条目的 priority 减小并排到更靠前位置

### Requirement: 完成判定
当某 Cue 连续两周收到「明显改善」或「略有改善」的周末反馈时，系统 SHALL 自动将其标记为 done 并移入历史。

#### Scenario: 连续两周改善
- **WHEN** 当前 active Cue 的 doneWeeks 达到 2
- **THEN** 系统将该 Cue 标记为 done，并提示用户激活下一个 Cue
