# Spec Delta

## Purpose

定义本地优先的模块化单体数据架构：Repository 接口、IndexedDB 与 Zustand 的分工、Observation 数据来源与协议版本、以及 JSON/CSV 导入导出的优先级，为后续云同步与设备接入预留扩展点。

## ADDED Requirements

### Requirement: 本地优先模块化单体

系统 SHALL 采用模块化单体架构，UI 通过应用服务访问领域规则与 Repository 接口，Repository 再落到 localStorage 与 IndexedDB，并预留可替换的同步适配器。

#### Scenario: 领域层不依赖存储实现

- **WHEN** 领域规则或处方引擎读写数据
- **THEN** 通过 Repository 接口访问，而不直接依赖 localStorage/IndexedDB 实现，便于替换或接入同步

### Requirement: Zustand 与领域数据分工

系统 SHALL 将 Zustand persist 仅用于 UI 状态与偏好（主题、提示设置、当前会话状态），而把用户档案、Observation、Assessment、Session、Event 等时间序列数据交给 Repository + IndexedDB 存储。

#### Scenario: 时间序列数据不塞进 Zustand

- **WHEN** 系统记录一次评估或训练事件
- **THEN** 该记录写入 IndexedDB 并可按键值/日期/指标/来源查询，而非仅作为 UI 状态

### Requirement: Observation 数据来源与协议版本

系统 SHALL 为每个观测值记录稳定 ID、单位、时间、数据来源（manual / assessment / csv_import / device_import / health_connect / healthkit）、协议版本、导入批次与去重键。

#### Scenario: 观测值可追溯来源与版本

- **WHEN** 系统写入一个 Observation
- **THEN** 包含稳定 id、metricId、value、unit、observedAt、source、protocolVersion、importBatchId 与去重键

### Requirement: 真实导入导出

系统 SHALL 支持 JSON 完整备份的下载、导入、校验与 schema 版本迁移，导入时处理重复数据，且清空前有备份提示。

#### Scenario: 空环境完整恢复

- **WHEN** 用户在一个空浏览器中导入此前导出的 JSON 备份
- **THEN** 数据完整恢复，重复记录被去重，schema 版本差异触发迁移而非静默丢失

### Requirement: 导入优先级

系统 SHALL 按「手工录入 → JSON 完整备份恢复 → CSV 通用导入 → 运动平台导出适配 → 原生 Health Connect/HealthKit」的优先级支持数据接入，且首版不因缺少原生壳而阻塞核心闭环。

#### Scenario: 纯 PWA 不依赖原生健康接口

- **WHEN** 浏览器环境无 HealthKit/Health Connect 能力
- **THEN** 核心训练闭环仍可运行，设备接入作为后续可替换适配器处理
