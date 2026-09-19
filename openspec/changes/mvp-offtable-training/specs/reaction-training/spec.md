# Spec Delta

## Purpose

提供随机刺激反应训练，通过全屏随机刺激训练「视觉刺激 → 动作选择」的快速映射，MVP 阶段采用自评而非自动判分。

## ADDED Requirements

### Requirement: 刺激模式
系统 SHALL 支持五种刺激模式：方向（direction）、正反手（stroke）、颜色（color）、数字（number）与双条件（dual）。

#### Scenario: 选择刺激模式
- **WHEN** 用户进入反应训练并选择一种模式
- **THEN** 系统按该模式生成对应刺激序列

### Requirement: 可配置参数
系统 SHALL 允许用户配置刺激显示时长（300/500/800/1000ms）、刺激间隔（随机范围）与训练总时长。

#### Scenario: 调整参数
- **WHEN** 用户在设置中修改刺激显示时长为 500ms
- **THEN** 后续反应训练按 500ms 显示每次刺激

### Requirement: 自评
MVP 阶段系统 SHALL 提供「正确 / 跳过」两个自评大按钮，不自动判断正确性。

#### Scenario: 自评正确
- **WHEN** 刺激出现后用户点击「正确」
- **THEN** 系统记录一次自评结果，继续下一次刺激

### Requirement: 全屏刺激
刺激 SHALL 以全屏大字号 / 大色块展示，训练中保持屏幕常亮（在浏览器支持时）。

#### Scenario: 展示刺激
- **WHEN** 反应训练进行中
- **THEN** 刺激占据屏幕中央大面积区域，非小尺寸提示
