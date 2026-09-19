# Spec Delta

## Purpose

把感知、判断、移动、稳定、发力与还原串成完整的认知—运动训练，让看见的信息驱动真实移动与模拟击球，而非只停留在屏幕上判断。

## ADDED Requirements

### Requirement: 随机来球模拟
系统 SHALL 随机给出 FH Topspin、FH Backspin、BH Topspin、BH Backspin 四类来球，要求用户完成「判断 → 移动 → 稳定 → 发力 → 模拟击球 → 还原」全链路。

#### Scenario: 一次整合训练
- **WHEN** 用户开始整合训练
- **THEN** 系统随机给出一个来球类型，用户完成判断、到位、稳定、模拟击球、还原后再出下一球

### Requirement: 进阶等级
系统 SHALL 支持 Power Chain Level 4–7：Level 4 随机触发、Level 5 方向随机、Level 6 正反手随机、Level 7 球路模拟。

#### Scenario: 等级递进
- **WHEN** 用户选择 Level 6
- **THEN** 系统随机给出 FH / BH 刺激，用户完成判断、脚步、稳定与对应动作

### Requirement: 连续影子回合
系统 SHALL 支持 Full Shadow Rally：连续多球、无暂停的影子回合，随机切换来球类型。

#### Scenario: 连续回合
- **WHEN** 用户开始 Full Shadow Rally
- **THEN** 系统连续给出随机来球，用户持续完成移动与模拟击球直至结束

### Requirement: 还原提示
整合训练的每个来球 SHALL 在模拟击球后提示「还原到准备姿态」，形成「再次感知」的循环。

#### Scenario: 还原
- **WHEN** 用户完成一次模拟击球
- **THEN** 系统提示用户回到准备姿态，再进入下一球
