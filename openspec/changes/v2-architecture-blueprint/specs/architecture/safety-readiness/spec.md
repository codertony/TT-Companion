# Spec Delta

## Purpose

定义训练准入的三态安全门（Green / Yellow / Red）与可解释规则引擎，确保安全决策只使用可解释、带版本的规则，readiness 以原因分解呈现而非神秘总分。

## ADDED Requirements

### Requirement: 三态安全门

系统 SHALL 将训练准入状态建模为 Green / Yellow / Red 三态，并分别约束产品行为与禁止行为。

#### Scenario: Green 正常处方

- **WHEN** 安全状态为 Green
- **THEN** 系统正常处方并按 limiter 调权，且不宣称「完全健康」

#### Scenario: Yellow 自动降负荷

- **WHEN** 安全状态为 Yellow
- **THEN** 系统自动降负荷、去除高冲击动作、缩短组数或建议恢复训练，且不推荐跳跃、HIIT、随机高速变向等被规则禁用内容

#### Scenario: Red 停止自动处方

- **WHEN** 安全状态为 Red
- **THEN** 系统停止自动处方并提示休息或寻求专业评估，且不通过生成低强度替代计划来绕过警示

### Requirement: 安全决策结构与规则版本

系统 SHALL 以 `SafetyDecision` 结构输出安全决策，包含 `state`、`reasons`、`allowedIntensity`、`blockedExerciseTags`、`expiresAt` 与 `ruleSetVersion`，且所有规则带版本与测试用例。

#### Scenario: 安全决策可解释可审计

- **WHEN** 系统输出一个安全决策
- **THEN** 用户能看到状态、原因、允许强度、被禁用的动作标签、失效时间与规则集版本

### Requirement: 警示症状进入 Red 路径

系统 SHALL 将用户主动报告的胸痛、晕厥/接近晕厥、异常气促等警示症状路由到 Red 路径，而不是由模型或强度阈值自行决定。

#### Scenario: 警示症状触发 Red

- **WHEN** 用户在 Check-in 中报告胸痛或晕厥等警示症状
- **THEN** 系统进入 Red 状态并停止处方，提示休息或寻求专业评估

### Requirement: 缺数据不等于高风险

系统 SHALL 在信息不足时输出「信息不足」与保守建议，而非自动判为高风险。

#### Scenario: 缺数据保守处理

- **WHEN** 某安全输入（如静息心率）缺少个人基线数据
- **THEN** 系统标记「信息不足」并给出保守建议，静息心率首版基于 7–14 天个人趋势而非单次读数判断

### Requirement: Readiness 原因分解

系统 SHALL 以原因分解呈现 readiness（如「睡眠 5.5h；疲劳 7/10；静息心率较 14 日中位数高 8 bpm」及其对训练时长/内容的影响），而非压缩为单一总分。

#### Scenario: Readiness 原因透明

- **WHEN** 系统显示今日状态（如 Yellow）
- **THEN** 显示触发该状态的具体原因与对训练的影响（时长调整、去除高冲击/高心肺动作）
