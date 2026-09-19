# Spec Delta

## Purpose

把用户常见的技术问题映射到对应的训练专题与 Primary Cue，使系统能据此推荐离台训练内容。

## ADDED Requirements

### Requirement: 问题映射库
系统 SHALL 内置「技术问题 → 训练专题 + Primary Cue」的映射，至少覆盖：正手大臂抢、反手起下旋抬臂、总被球顶住、脚到了但击球不稳。

#### Scenario: 映射查询
- **WHEN** 用户选择「正手大臂抢」
- **THEN** 系统返回推荐专题（张力 + 髋旋转 + 手臂滞后）与 Primary Cue「身体先走」

### Requirement: 训练推荐
用户选定问题后，系统 SHALL 将推荐专题纳入训练生成，并将 Primary Cue 设为建议的 ONE CUE。

#### Scenario: 推荐生成
- **WHEN** 用户确认某问题的推荐
- **THEN** 系统按推荐专题生成训练，并建议对应 Primary Cue
