# Tasks

## 1. 领域类型与七层模型

- [x] 1.1 在 `src/types/index.ts` 新增台上训练类型：`ProgressionLayer`（L1–L7）、`Randomness`（fixed/semi/random）、`BallSource`（partner/robot/multiball）、`Drill`（八要素）、`DrillDimension`（六维度）、`TableSession`，不改既有字段；验证 `pnpm typecheck` 通过
- [x] 1.2 在 `src/domain/tableLayer.ts` 定义七层常量（每层三要素：是否知道下一球/主要目的/核心训练）与进阶链顺序；验证单测断言 L1/L2/L3=知道、L4/L6=部分知道、L5/L7=不知道，且进阶链为「固定→半随机→随机→比赛」
- [x] 1.3 在 `src/domain/tableRatio.ts` 实现训练配比纯函数（当前 30/25/20/15/10，随水平演进到 15/20/25/20/20）与「稳定性→落点→节奏→速度→力量」常量；验证单测断言配比和为 100、随机/比赛占比随水平单调不降、固定占比单调不升

## 2. 训练套路内容库

- [x] 2.1 在 `src/data/tableDrills.ts` 建 L1–L7 种子数据（L1 单技术 8 项、L2/L3 固定移动与组合、L4 半随机、L5 随机、L6 发抢 1/2/3、L7 条件局），每条按统一模板（训练方法/唯一注意点/正确体感/常见错误体感/自检指标/进阶阈值/保持测试/迁移测试/下一级训练）含八要素与双方任务；验证单测断言每层至少一条、每条含 A/B 双方任务与自检要素
- [x] 2.2 三点落点统一为「大正手 / 追身（肘部）/ 大反手」；验证单测断言内容库中三点落点不含「左/中/右」字面

## 3. 生成公式与球源适配

- [x] 3.1 在 `src/domain/tableGenerator.ts` 实现 `generateDrillChain(target, ballSource, level)`：按「技术×落点×移动×旋转×随机度×前后板」生成「固定→两落点→随机→发抢→起板后固定→起板后随机→条件比赛」进阶链；验证单测断言给定「反手起下旋」输出从固定到随机的变体序列
- [x] 3.2 在 `src/domain/tablePartner.ts` 实现球搭子协议八条规则与 `adaptForPartner(drill, partnerLevel)`；验证单测断言低水平时落点放宽到半台、旋转改为先上旋后下旋，高水平时提示 70% 质量
- [x] 3.3 在 `src/domain/tableBallSource.ts` 实现发球机（L1–L4 + 位置/深浅/频率随机提示）与多球（下旋起板进阶）适配；验证单测断言发球机随机训练提示加入扰动、多球按「固定下旋→深浅变化→正反手随机」进阶

## 4. 训练课编排

- [x] 4.1 在 `src/domain/tableSession.ts` 实现 `buildTableSession({ target, ballSource, durationMin, ratio, safety })`：输出 90–120 分钟课表（热身→基本球→核心动作→固定移动→半随机→前三板→开放→条件比赛）各段时长；验证单测断言段序正确、总时长匹配、Red 状态返回空课表
- [x] 4.2 高质量专项前置：核心动作段安排在热身与基本球之后；验证单测断言核心动作段位置在热身/基本球段之后

## 5. 执行器与持久化

- [x] 5.1 新增 `src/stores/tableStore.ts`（`ttc:tableSession` 持久化 TableSession 记录）；验证 `pnpm test` 通过 + 浏览器检查记录写入后可查看
- [x] 5.2 新增 `src/features/table/TablePlanPage.tsx`：选目标技术 + 球源 + 水平 → 生成进阶链与课表展示；验证 Playwright 浏览器验证移动端布局、生成结果、双方任务展示
- [x] 5.3 新增 `src/features/table/TableRunPage.tsx`：按课表段计时 + 3–6 分钟换人提醒 + 升级条件自评记录；验证 Playwright 浏览器验证计时与换人提示

## 6. 整合与导航

- [x] 6.1 首页新增「台上训练」入口（与「开始训练」并列），`src/App.tsx` 增补 `/table` 相关路由；验证 Playwright 浏览器验证入口可见可点
- [x] 6.2 台上重点由 ONE CUE/limiter 推导（读 `useCueStore` primary CUE 与 limiter → 推荐训练重点）；验证单测断言给定 CUE/limiter 输出对应重点
- [x] 6.3 遵守安全门：Red 不生成台上训练课、Yellow 降负荷；验证单测断言 Red 返回空课表、Yellow 降负荷且不含高强度段
- [x] 6.4 数据页展示台上训练历史与周末验证闭环（移动迁移同视图）；验证 Playwright 浏览器验证台上记录与移动迁移在同一趋势视图

## 7. 测试与验证

- [x] 7.1 补领域单测（七层/配比/生成/球源降难度/课表/整合），`pnpm test` 全绿
- [x] 7.2 `pnpm verify` 全绿（lint + typecheck + test + build），Playwright 浏览器验证核心路径后提交

## 8. 自我教练闭环

- [x] 8.1 在 `src/types/index.ts` 新增自检类型：`SelfCheckResult`（五问结果）、`SelfCheckRecord`（六指标 + 最常见失误分类）、`Gate`（四道门槛）、`FocusPoint`（主注意点）；验证 `pnpm typecheck` 通过
- [x] 8.2 在 `src/domain/tableCheck.ts` 实现五问自检、四道门槛判定、Level A–G 进阶/退阶、3 球诊断纯函数；验证单测断言五问结果映射、门槛判定、崩掉退一级、连续 3 次同类错误才诊断
- [x] 8.3 新增 `src/stores/tableCheckStore.ts`（`ttc:tableCheck` 持久化自检记录），驱动主注意点迁移与反馈递减；验证单测 + 浏览器检查记录写入与迁移
- [x] 8.4 在 `TableRunPage` 集成自检闭环（每组结束五问自检 + 六指标 + 最常见失误分类 + 过关/退阶提示）；验证 Playwright 浏览器验证自检表单与过关/退阶提示
- [x] 8.5 补领域单测（五问/门槛/进阶/诊断/记录），`pnpm verify` 全绿
