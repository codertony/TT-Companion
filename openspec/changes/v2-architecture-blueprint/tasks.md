# Tasks

## 1. 蓝图规格校验

- [x] 1.1 运行 `openspec validate v2-architecture-blueprint`，确认通过且无 zero-delta、Purpose 过短或 Requirement 缺 Scenario 错误，记录通过结果
- [x] 1.2 核对 proposal「New Capabilities」的 7 个路径与 `specs/architecture/` 下 7 个 `spec.md` 一一对应，验证 `openspec status --change v2-architecture-blueprint` 中 proposal/specs/design/tasks 均显示 done

## 2. 路线图分解为子 change 待办

- [x] 2.1 在 `docs/` 落地《V2.0 子 change 分解清单》，把 Phase 0–4 与 Epic A–F 逐条映射为未来子 change 名称与验收标准，验证每个 Phase/Epic 都有对应条目且无遗漏
- [x] 2.2 标注首个纵向切片（单腿稳定/下肢控制 → 步法稳定）与「现在做」的 Phase 0（真实性与工程地基）为最高优先级子 change，验证该切片完整链路在 `architecture/roadmap` 规格中可追溯

## 3. 非目标与验收锚点记录

- [x] 3.1 在分解清单中固化「明确不做」边界与「五个问题」闭环，验证与 V2.0 文档第 21、22 节一致，作为后续每个子 change 的验收锚点
