# Proposal

## Why

前几阶段的训练若彼此割裂，就会出现「手机上判断很快、球台上站着不动」。Phase 3 把感知、判断、移动、发力串成完整的认知—运动训练（Cognitive-Motor Training），并让系统能根据用户的技术问题自动推荐专题与 Primary Cue。

## What Changes

- 新增整合训练：随机给出 FH/BH Topspin/Backspin 来球，用户完成「判断 → 移动 → 稳定 → 发力 → 模拟击球 → 还原」全链路。
- 新增 Power Chain Level 4–7：随机触发 → 方向随机 → 正反手随机 → 球路模拟。
- 新增 Full Shadow Rally：连续多球影子回合。
- 新增「错误 → 专题」映射：根据问题（大臂抢 / 反手抬臂 / 被球顶住 / 脚到不稳）推荐专题与 Primary Cue。

> 范围：本 change 覆盖路线图 Phase 3（整合与实战耦合）。Phase 4（姿态识别 + AI）不在范围内。

## Capabilities

### New Capabilities

- `integration`: 认知—运动整合训练，把反应 + 步法 + 发力模拟串成完整击球链路（含 Power Chain Level 4–7 与 Full Shadow Rally）。
- `error-to-drill-mapping`: 技术问题到训练专题与 Primary Cue 的映射，驱动训练推荐。

### Modified Capabilities

<!-- 无：整合训练组合既有能力，不改变其各自行为契约 -->

## Impact

- **代码**：`src/features/`（整合训练页）、`src/lib/`（来球模拟、错误映射表）、组合既有 hooks / 动作库。
- **数据**：新增错误→专题映射数据；整合训练会话记录。
- **依赖**：复用 Phase 0（反应/步法/执行）+ Phase 1（发力链）+ Phase 2（预判）能力。
