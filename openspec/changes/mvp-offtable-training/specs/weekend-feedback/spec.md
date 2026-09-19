# Spec Delta

## Purpose

在周末真实打球后，让用户对本周 ONE CUE 的迁移效果做一次简单反馈，并据此驱动 Cue 的继续或完成判定，形成训练闭环。

## ADDED Requirements

### Requirement: 四档反馈
系统 SHALL 提供「明显改善 / 略有改善 / 没有变化 / 更差」四档结果供用户选择，并允许填写可选备注。

#### Scenario: 提交反馈
- **WHEN** 用户选择「略有改善」并填写备注后提交
- **THEN** 系统保存一条反馈记录（含日期、Cue、结果、备注）

### Requirement: 完成判定联动
系统 SHALL 根据反馈结果更新 Cue 的 doneWeeks：改善档 +1，无变化/更差不增加；达到 2 时自动完成 Cue。

#### Scenario: 改善累计
- **WHEN** 用户提交「明显改善」且该 Cue 上周也为改善
- **THEN** 该 Cue 被标记为 done，提示用户激活下一个 Cue

### Requirement: 单指标聚焦
反馈页 SHALL 只针对当前 ONE CUE 一个动作指标提问，并给出「只观察这一点」的验证提示。

#### Scenario: 查看反馈页
- **WHEN** 用户进入周末反馈页
- **THEN** 页面只显示当前 ONE CUE 与一条单指标观察提示，不含其他技术问题
