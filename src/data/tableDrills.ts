// 台上训练套路内容库（L1–L7），每条按统一模板填写：
// 训练方法(rule) → 唯一注意点(focusPoint) → 正确体感(correctFeel) → 常见错误体感(commonErrorFeel)
// → 自检指标(selfCheck) → 进阶阈值(upgradeCondition) → 保持测试(retentionTest) → 迁移测试(transferTest) → 下一级训练(nextDrillId)
import type { Drill, TargetTechnique } from '../types';

type PartialDrill = Omit<Drill, 'ballSources' | 'randomness' | 'selfCheck'> &
  Partial<Pick<Drill, 'ballSources' | 'randomness' | 'selfCheck'>>;

const FIVE = '准·净·松·顺·回';

function d(x: PartialDrill): Drill {
  return { ballSources: ['partner'], randomness: 'fixed', selfCheck: FIVE, ...x };
}

export const tableDrills: Drill[] = [
  // ===== L1 单技术 =====
  d({ id: 'l1_fh_drive', layer: 'L1', target: '正手攻', rule: 'A 正手斜线 ↔ B 正手斜线', focusPoint: '击球距离', partnerTask: 'B 正手斜线稳定回球', upgradeCondition: '连续 20 板 × 3 组，上台率≥85%', nextDrillId: 'l1_fh_line', correctFeel: '每板身体到球距离相近', commonErrorFeel: '球贴身体、够着打', retentionTest: '热身后直接 10 球 ≥8 球达标', transferTest: '来球 ±30cm 随机仍正常完成' }),
  d({ id: 'l1_bh_drive', layer: 'L1', target: '反手攻', rule: 'A 反手斜线 ↔ B 反手斜线', focusPoint: '迎前', partnerTask: 'B 反手斜线稳定回球', upgradeCondition: '连续 20 板 × 3 组，上台率≥85%', nextDrillId: 'l1_bh_line', correctFeel: '球在身体前面', commonErrorFeel: '被球顶、后仰', retentionTest: '热身后直接 10 球 ≥8 球达标', transferTest: '来球 ±30cm 随机仍正常完成' }),
  d({ id: 'l1_fh_line', layer: 'L1', target: '正手直线', rule: 'A 正手直线 → B 反手挡', focusPoint: '击球距离', partnerTask: 'B 反手稳定挡回', upgradeCondition: '连续 15 板 × 3 组', nextDrillId: 'l1_fh_loop', correctFeel: '落点直线、身体到球距离稳定', commonErrorFeel: '手腕变线、身体转过度', retentionTest: '热身后直接 8 球 ≥6 球达标', transferTest: '正手斜线/直线交替仍稳定' }),
  d({ id: 'l1_bh_line', layer: 'L1', target: '反手直线', rule: 'A 反手直线 → B 正手挡', focusPoint: '迎前', partnerTask: 'B 正手稳定挡回', upgradeCondition: '连续 15 板 × 3 组', nextDrillId: 'l1_bh_loop', correctFeel: '直线落点、身体朝前', commonErrorFeel: '肘抬、身体侧转过多', retentionTest: '热身后直接 8 球 ≥6 球达标', transferTest: '反手斜线/直线交替仍稳定' }),
  d({ id: 'l1_fh_loop', layer: 'L1', target: '正手拉上旋', rule: 'A 正手拉上旋 → B 挡', focusPoint: '节奏', partnerTask: 'B 稳定挡球', upgradeCondition: '连续 15 板 × 3 组，上台率≥80%', nextDrillId: 'l1_fh_backspin', correctFeel: '等球进入击球区、不抢点', commonErrorFeel: '抢点、身体前冲', retentionTest: '热身后直接 8 球 ≥6 球达标', transferTest: '球速轻微变化仍能拉' }),
  d({ id: 'l1_bh_loop', layer: 'L1', target: '反手拉上旋', rule: 'A 反手拉上旋 → B 挡', focusPoint: '还原', partnerTask: 'B 稳定挡球', upgradeCondition: '连续 15 板 × 3 组，上台率≥80%', nextDrillId: 'l1_bh_backspin', correctFeel: '打完马上回、下一板不仓促', commonErrorFeel: '打完停住、手回不来', retentionTest: '热身后直接 8 球 ≥6 球达标', transferTest: '球速轻微变化仍能拉' }),
  d({ id: 'l1_fh_backspin', layer: 'L1', target: '正手起下旋', rule: 'B 搓下旋 → A 正手拉', focusPoint: '看清下降/上升阶段', partnerTask: 'B 稳定搓下旋', upgradeCondition: '连续 10 球 × 3 组，上台率≥80%', nextDrillId: 'l2_fh_placement', correctFeel: '击球甜区明显、不抢', commonErrorFeel: '抢拉、板边多', retentionTest: '热身后直接 8 球 ≥6 球达标', transferTest: '下旋深浅变化仍能起' }),
  d({ id: 'l1_bh_backspin', layer: 'L1', target: '反手起下旋', rule: 'B 搓下旋 → A 反手拉', focusPoint: '节奏', partnerTask: 'B 稳定搓下旋', upgradeCondition: '连续 10 球 × 3 组，上台率≥80%', nextDrillId: 'l2_bh_placement', correctFeel: '稍微等球、减少板边', commonErrorFeel: '抬整条手臂、板边', retentionTest: '热身后直接 8 球 ≥6 球达标', transferTest: '下旋深浅变化仍能起' }),

  // ===== L2 固定落点 =====
  d({ id: 'l2_fh_placement', layer: 'L2', target: '正手固定落点', rule: 'A 正手连续落到 B 反手半台约 1/3 区域', focusPoint: '落点', partnerTask: 'B 稳定回球到正手位', upgradeCondition: '连续 20 板，落点命中≥70%', nextDrillId: 'l3_two_point_fh', correctFeel: '落点稳定、弧线一致', commonErrorFeel: '落点飘、弧线忽高忽低', retentionTest: '热身后直接 10 球落点命中≥7', transferTest: '两个落点切换仍稳定' }),
  d({ id: 'l2_bh_placement', layer: 'L2', target: '反手固定落点', rule: 'A 反手连续落到 B 正手半台约 1/3 区域', focusPoint: '落点', partnerTask: 'B 稳定回球到反手位', upgradeCondition: '连续 20 板，落点命中≥70%', nextDrillId: 'l3_fh_bh_switch', correctFeel: '落点稳定、身体朝向不变', commonErrorFeel: '靠手腕变落点', retentionTest: '热身后直接 10 球落点命中≥7', transferTest: '两个落点切换仍稳定' }),

  // ===== L3 固定移动 =====
  d({ id: 'l3_two_point_fh', layer: 'L3', target: '两点正手', rule: '中路 → 正手位 → 中路 → 正手位，全部正手', focusPoint: '到位再打', partnerTask: 'B 反手稳定挡两点', upgradeCondition: '连续 12 板 × 3 组，动作不散', nextDrillId: 'l3_fh_bh_switch', correctFeel: '脚先到、击球时身体稳定', commonErrorFeel: '手先动、够着打', retentionTest: '热身后直接 8 球 ≥6 球达标', transferTest: '两点落点随机仍稳定' }),
  d({ id: 'l3_fh_bh_switch', layer: 'L3', target: '正反手转换', rule: '反手 → 正手 → 反手 → 正手', focusPoint: '还原', partnerTask: 'B 稳定回两点', upgradeCondition: '连续 12 板 × 3 组，不仓促', nextDrillId: 'l3_falkenberg', correctFeel: 'BH→FH→BH→FH 顺畅不慌', commonErrorFeel: '转体不到位、手够', retentionTest: '热身后直接 8 球 ≥6 球达标', transferTest: '正反手两点随机仍稳定' }),
  d({ id: 'l3_falkenberg', layer: 'L3', target: 'Falkenberg', rule: '反手 → 侧身正手 → 扑正手 → 回反手', focusPoint: '到位再打', partnerTask: 'B 稳定挡三点', upgradeCondition: '动作不散、每点到位（不计速度）', nextDrillId: 'l3_bh2_fh2', correctFeel: '侧身/大范围移动后身体仍稳', commonErrorFeel: '跑到了但动作散了', retentionTest: '热身后直接一轮 4 点循环仍稳定', transferTest: '移动方向随机仍到位' }),
  d({ id: 'l3_bh2_fh2', layer: 'L3', target: '反手2板正手2板', rule: '反手 2 板 → 正手 2 板 → 循环', focusPoint: '还原', partnerTask: 'B 稳定回两点', upgradeCondition: '连续 3 轮循环 × 3 组', nextDrillId: 'l3_bh_mid_wide', correctFeel: '转换不急、节奏稳', commonErrorFeel: '第二板就乱', retentionTest: '热身后直接一轮循环稳定', transferTest: '两板数量随机变化仍稳定' }),
  d({ id: 'l3_bh_mid_wide', layer: 'L3', target: '反手中路大正手', rule: '反手 → 中路正手 → 反手 → 大正手', focusPoint: '到位再打', partnerTask: 'B 挡中路/大正手两点', upgradeCondition: '连续 10 板 × 3 组', nextDrillId: 'l3_fh_line2', correctFeel: '大范围移动到位、身体稳', commonErrorFeel: '大正手够球、身体倒', retentionTest: '热身后直接 6 板稳定', transferTest: '中路/大正手随机仍到位' }),
  d({ id: 'l3_fh_line2', layer: 'L3', target: '正手斜线直线', rule: '正手斜线 2 板 → 正手直线 2 板', focusPoint: '落点', partnerTask: 'B 稳定挡回', upgradeCondition: '连续 3 轮循环 × 3 组', nextDrillId: 'l4_bh_fixed_fh_random', correctFeel: '同一动作改变落点', commonErrorFeel: '变落点靠手腕/身体转过度', retentionTest: '热身后直接一轮循环稳定', transferTest: '斜线/直线随机切换仍稳定' }),

  // ===== L4 半随机 =====
  d({ id: 'l4_bh_fixed_fh_random', layer: 'L4', target: '半随机', randomness: 'semi', rule: '第一球固定反手，第二球随机中路 / 正手', focusPoint: '读取来球', partnerTask: 'B 反手一球 + 中路/正手随机一球', upgradeCondition: '连续 10 组判断正确 ≥7', nextDrillId: 'l5_full_random', correctFeel: '看球判断、不背套路', commonErrorFeel: '提前移动、猜球', retentionTest: '热身后直接 8 组 ≥6 正确', transferTest: '第一球也随机化仍能判断' }),

  // ===== L5 随机 =====
  d({ id: 'l5_full_random', layer: 'L5', target: '全台随机', randomness: 'random', rule: 'A 所有球回到 B 反手；B 随机打大正手 / 追身（肘部）/ 大反手', focusPoint: '全台移动+判断', partnerTask: 'B 反手控制三点（大正手/追身/大反手）', upgradeCondition: '连续 10 板移动到位 ≥7', nextDrillId: 'l6_attack_1', correctFeel: '看→判断→启动，不被顶', commonErrorFeel: '提前启动、中路球站死', retentionTest: '热身后直接 8 板 ≥6 到位', transferTest: '球速/落点随机仍到位' }),

  // ===== L6 发接发+前三板 =====
  d({ id: 'l6_attack_1', layer: 'L6', target: '发抢 1', randomness: 'semi', rule: 'A 发下旋短球 → B 搓长反手 → A 反手起板 → 自由', focusPoint: '搓长→起板→连续', partnerTask: 'B 搓长反手', upgradeCondition: '发抢起板上台率≥70%', nextDrillId: 'l6_attack_2', correctFeel: '起板后能衔接下一板', commonErrorFeel: '起板后站死', retentionTest: '热身后直接 8 球起板 ≥6 上台', transferTest: '搓长正手/反手二选一仍能起' }),
  d({ id: 'l6_attack_2', layer: 'L6', target: '发抢 2', randomness: 'semi', rule: 'A 发下旋 → B 搓长正手 / 反手二选一 → A 判断后正手或反手起板', focusPoint: '判断后起板', partnerTask: 'B 搓长正手或反手随机', upgradeCondition: '判断正确率≥70% 且起板上台≥70%', nextDrillId: 'l6_attack_3', correctFeel: '先判断再启动、不猜', commonErrorFeel: '提前侧身、猜方向', retentionTest: '热身后直接 8 球判断 ≥6 正确', transferTest: '摆短/劈长随机仍能处理' }),
  d({ id: 'l6_attack_3', layer: 'L6', target: '发抢 3', randomness: 'semi', rule: 'A 发短球 → B 摆短 / 劈长 → A 短球继续控制、长球起板', focusPoint: '短控长起', partnerTask: 'B 摆短或劈长', upgradeCondition: '长球起板上台率≥70%', nextDrillId: 'l7_condition_match', correctFeel: '长短判断清晰、处理果断', commonErrorFeel: '摆短/劈长看不清就出手', retentionTest: '热身后直接 8 球处理 ≥6 正确', transferTest: '摆短/劈长/拧拉随机仍能处理' }),

  // ===== L7 条件比赛 =====
  d({ id: 'l7_condition_match', layer: 'L7', target: '条件比赛', randomness: 'random', rule: '条件局：发下旋必须第三板起球', focusPoint: '强制使用第三板起球', partnerTask: 'B 正常接发回球', upgradeCondition: '条件局中第三板起球使用率≥80%', nextDrillId: undefined, correctFeel: '比赛中主动用出第三板起球', commonErrorFeel: '一比赛又侧身正手老套路', retentionTest: '隔次条件局仍主动起球', transferTest: '换一种条件（接发只许搓长）仍能执行' }),
  d({ id: 'l7_receive_long', layer: 'L7', target: '条件比赛', randomness: 'random', rule: '条件局：接发球只允许搓长', focusPoint: '接发只搓长', partnerTask: 'B 正常发球', upgradeCondition: '接发搓长执行率≥90%', correctFeel: '接发不慌、果断搓长', commonErrorFeel: '接发又想摆短又想拧', retentionTest: '隔次条件局仍执行', transferTest: '换一种条件仍能执行' }),
  d({ id: 'l7_bh_score', layer: 'L7', target: '条件比赛', randomness: 'random', rule: '条件局：反手起板成功得 2 分', focusPoint: '主动反手起板', partnerTask: 'B 正常比赛', upgradeCondition: '反手起板主动使用率≥70%', correctFeel: '有机会就反手起板', commonErrorFeel: '有机会仍只侧身正手', retentionTest: '隔次条件局仍主动反手起板', transferTest: '换一种条件仍能执行' }),
  d({ id: 'l7_elbow_first', layer: 'L7', target: '条件比赛', randomness: 'random', rule: '条件局：第一板必须攻击肘部（追身）', focusPoint: '第一板攻追身', partnerTask: 'B 正常比赛', upgradeCondition: '第一板攻追身执行率≥70%', correctFeel: '有意识把第一板打到追身', commonErrorFeel: '一紧张又打常规落点', retentionTest: '隔次条件局仍执行', transferTest: '换一种条件仍能执行' }),
];

export function getDrill(id: string): Drill | undefined {
  return tableDrills.find((x) => x.id === id);
}

/** 目标技术 → 代表套路（用于编排页展示双方任务） */
export const TARGET_DRILL: Record<TargetTechnique, string> = {
  forehand_drive: 'l1_fh_drive',
  backhand_drive: 'l1_bh_drive',
  forehand_loop: 'l1_fh_loop',
  backhand_loop: 'l1_bh_loop',
  forehand_backspin: 'l1_fh_backspin',
  backhand_backspin: 'l1_bh_backspin',
  two_point_forehand: 'l3_two_point_fh',
  fh_bh_switch: 'l3_fh_bh_switch',
  serve_attack: 'l6_attack_1',
  receive_attack: 'l6_attack_2',
};
