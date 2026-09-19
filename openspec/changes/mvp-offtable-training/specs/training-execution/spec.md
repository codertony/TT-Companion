# Spec Delta

## Purpose

分步执行训练计划：按顺序展示每个动作并倒计时，在正确时机展示时机化提示，训练中常驻显示当前 ONE CUE，完成后写入会话记录。

## ADDED Requirements

### Requirement: 分步执行与倒计时
系统 SHALL 逐 step 展示动作（名称 / 说明 / 常见错误 / 安全提示）并对每个 step 进行倒计时，到时自动进入下一步。

#### Scenario: 执行一个 step
- **WHEN** 用户开始执行某 step
- **THEN** 系统显示该动作信息并启动倒计时，倒计时归零后进入下一步

### Requirement: 时机化提示展示
系统 SHALL 按动作 timedPrompts 的 atSec 时间点切换当前提示，且任意时刻最多显示 1 条提示。

#### Scenario: 到点切换提示
- **WHEN** 某动作执行到 atSec=8 的时刻
- **THEN** 系统将当前提示替换为该时间点对应的提示文本

### Requirement: ONE CUE 常驻
训练执行过程中，系统 SHALL 在顶部常驻显示当前 ONE CUE，与中部的时机化提示区分。

#### Scenario: 训练中查看 Cue
- **WHEN** 用户处于训练执行页
- **THEN** 顶部始终显示当前 ONE CUE 文本

### Requirement: 控制与防误触
系统 SHALL 提供暂停 / 跳过 / 结束控制；「结束」操作 SHALL 需要二次确认。

#### Scenario: 结束训练
- **WHEN** 用户点击「结束」
- **THEN** 系统弹出二次确认，确认后才退出训练

### Requirement: 完成记录
训练完成时，系统 SHALL 写入一条训练会话记录（含日期、场景、时长、类型、状态、完成时间）。

#### Scenario: 完成训练
- **WHEN** 用户完成全部 step
- **THEN** 系统生成一条 completed=true 的会话记录
