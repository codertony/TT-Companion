# Proposal

## Why

很多业余球友以为「反应慢」，实际是看球信息获取太晚、不会在球飞出前从对方动作里读线索。通勤碎片时间最适合做预判与遮挡训练。Phase 2 把反应训练从「点色块」升级到「触球前预判 + 视频遮挡 + 视觉注意 + 心理模拟」。

## What Changes

- 新增预判进阶（Awareness Level 3–7）：击球选择 → 球分类 → 触球前预判 → 遮挡训练。
- 新增视频遮挡预判（Temporal Occlusion）：触球前 T−100/200/300ms 截断，判断方向/旋转/长短，记录 Early Cue Level。
- 新增视觉注意专题：只追球 → 看对方拍 → 身体+球拍 三阶段。
- 新增结构化心理模拟（Mental Rehearsal）：语音引导「看见→判断→第一步→稳定→ONE CUE→还原」。
- 新增预判指标：Accuracy（正确率）、Decision Time（选择时间）、Early Cue Level（最早可稳定判断时点）。

> 范围：本 change 覆盖路线图 Phase 2（反应与预判）。整合训练（Phase 3）见 `phase3-integration`。

## Capabilities

### New Capabilities

- `anticipation`: 触球前预判与球分类进阶（Awareness Level 3–7），从对方身体运动学信息判断方向 / 旋转 / 长短。
- `temporal-occlusion`: 视频遮挡预判训练，支持多截断时点与 Early Cue Level 指标。
- `visual-attention`: 视觉注意三阶段训练，训练「更早找到有用信息」而非死盯球。
- `mental-rehearsal`: 结构化心理模拟，语音引导完整击球链路。

### Modified Capabilities

<!-- 无：均为新增能力，不改变既有反应训练等行为契约 -->

## Impact

- **代码**：`src/features/`（预判 / 遮挡 / 视觉 / 心理模拟页）、`src/hooks/`（遮挡计时、指标计算）、`src/types`（OcclusionConfig 已存在）。
- **资产**：需要真实乒乓球视频片段（触球前动作）。
- **数据**：新增预判结果记录（Accuracy / Decision Time / Early Cue Level）。
- **交互**：深色训练页 + 遮挡黑屏问答 + 语音引导。
