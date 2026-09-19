# Spec Delta

## Purpose

将训练数据（Cue、会话、反馈、设置等）持久化在本地 localStorage，保证刷新后数据不丢失，并支持导出与清空。

## ADDED Requirements

### Requirement: 刷新保留
系统 SHALL 将全部训练数据持久化到本地 localStorage，页面刷新后数据 SHALL 保持不丢失。

#### Scenario: 刷新页面
- **WHEN** 用户完成一次训练后刷新页面
- **THEN** 会话记录、Cue、反馈等数据仍然存在

### Requirement: 命名空间
所有存储键 SHALL 使用 `ttc:` 前缀命名空间，避免与站点其他数据冲突。

#### Scenario: 检查存储键
- **WHEN** 系统写入任意数据
- **THEN** 存储键均以 `ttc:` 开头

### Requirement: 导出
系统 SHALL 允许用户将全量数据导出为 JSON 字符串。

#### Scenario: 导出数据
- **WHEN** 用户在设置中点击导出
- **THEN** 系统返回包含所有 `ttc:` 键值对的 JSON 文本

### Requirement: 清空
系统 SHALL 允许用户清空全部数据，且清空操作 SHALL 需要二次确认。

#### Scenario: 清空数据
- **WHEN** 用户点击清空并确认
- **THEN** 系统删除所有 `ttc:` 前缀的存储项
