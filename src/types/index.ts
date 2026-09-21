// 领域类型定义（与 docs/技术方案.md §4 对齐）

export type Scene = 'metro_sit' | 'metro_stand' | 'office' | 'home' | 'club';

export type Ability =
  | 'mobility'
  | 'stability'
  | 'strength'
  | 'agility'
  | 'reaction'
  | 'coordination'
  | 'relaxation'
  | 'technique';

/** Cue 关联的问题标签，与动作库 Exercise.cueMap 对齐 */
export type CueTag =
  | 'arm_stiff'
  | 'hand_first'
  | 'footwork_slow'
  | 'recovery_slow'
  | 'early_hit';

export type Skill =
  | 'forehand_drive'
  | 'backhand_drive'
  | 'footwork'
  | 'serve'
  | 'receive'
  | 'other';

export type Feeling = 'good' | 'normal' | 'tired';
export type CueStatus = 'draft' | 'active' | 'done' | 'archived';
export type CueType = 'technique' | 'perception' | 'movement';
export type FeedbackResult = 'much' | 'slight' | 'none' | 'worse';
export type ReactionMode = 'direction' | 'stroke' | 'color' | 'number' | 'dual';
export type Intensity = 'low' | 'medium' | 'high';
export type Equipment = 'none' | 'band' | 'mat' | 'phone';

/** 时机化提示类型（见 docs/交互与体验设计.md §6） */
export type PromptType =
  | 'cue'
  | 'instruction'
  | 'awareness'
  | 'force'
  | 'safety'
  | 'encourage';

export interface TimedPrompt {
  atSec: number;
  type: PromptType;
  text: string;
}

export interface Cue {
  id: string;
  text: string;
  skill: Skill;
  tags: CueTag[];
  type: CueType;
  priority: number;
  status: CueStatus;
  activeSince?: string;
  doneWeeks: number;
}

export interface ExerciseRef {
  title: string;
  url: string;
}

export interface Exercise {
  id: string;
  name: string;
  ability: Ability;
  scenes: Scene[];
  space: number;
  equipment: Equipment;
  durationMin: number;
  intensity: Intensity;
  cueMap: CueTag[];
  cue: string;
  timedPrompts: TimedPrompt[];
  description: string;
  commonMistakes: string[];
  safety: string;
  mode?: ReactionMode;
  chainStage?: string; // 发力链阶段（Phase 1），如 pelvis_rotation
  level?: number; // 发力/进阶等级（Phase 1/3），如 Power Chain Level
  refs?: ExerciseRef[]; // 外部参考（文章/视频）
}

export interface PlanStep {
  exerciseId: string;
  name: string;
  durationSec: number;
  cue: string;
  mode?: ReactionMode;
}

export interface TrainingPlan {
  id: string;
  scene: Scene;
  durationMin: number;
  cueText?: string;
  steps: PlanStep[];
  /** 无法生成计划时的明确原因（steps 为空时给出），用于 UI 提示 */
  reason?: string;
}

export interface Session {
  id: string;
  date: string;
  scene: Scene;
  durationMin: number;
  types: Ability[];
  cueId?: string;
  feeling: Feeling;
  completed: boolean;
  completedAt: number;
  /** 真实训练时长（秒），由 startedAt → completedAt 计算 */
  actualSec?: number;
}

/** 训练执行事件（统一执行模型，Phase 0 最小集） */
export type RunEventType = 'start' | 'pause' | 'resume' | 'complete' | 'skip';

export interface RunEvent {
  at: number; // timestamp ms
  type: RunEventType;
  stepIdx: number;
}

export interface Feedback {
  date: string;
  cueId: string;
  result: FeedbackResult;
  note?: string;
  /** 移动迁移（两点步法）验证结果，纵向切片用于评估下肢稳定是否迁移 */
  movementResult?: FeedbackResult;
}

/** 专项训练结果类型（统一结果模型，Phase 0） */
export type ResultKind = 'reaction' | 'reaction_time' | 'occlusion' | 'tension';

/** 统一训练结果：反应/预判/张力等专项训练的持久化结果，可跨页面查看 */
export interface TrainingResult {
  id: string;
  kind: ResultKind;
  date: string; // YYYY-MM-DD
  at: number; // timestamp ms
  mode?: ReactionMode;
  metrics: Record<string, number>;
}

export interface Settings {
  reaction: { displayMs: number; gapRange: [number, number]; durationSec: number };
  audio: { gapRange: [number, number]; rate: number; repeat: number; includeLength: boolean };
  mapping: Record<string, string>;
  sound: boolean;
  theme: Theme;
}

export type Theme = 'light' | 'dark' | 'system';

export interface Abilities {
  mobility: number;
  stability: number;
  strength: number;
  agility: number;
  reaction: number;
  coordination: number;
  relaxation: number;
  technique: number;
}

export interface Meta {
  schemaVersion: number;
  firstUseAt: number;
}

/** 技能树节点（见 docs/产品路线图.md §7） */
export interface SkillNode {
  id: string;
  name: string;
  parentId?: string;
  level?: number;
  ability: Ability;
}

/** 视频遮挡预判配置（见 docs/产品路线图.md §3.4） */
export interface OcclusionConfig {
  cutMs: number[];
  judge: 'direction' | 'spin' | 'length';
}

/** 张力等级 0–10 */
export type TensionLevel = number;

// ===== Epic A：领域内核（能力评估 / 安全 / limiter）=====

export type DataSource =
  | 'manual'
  | 'assessment'
  | 'csv_import'
  | 'device_import'
  | 'health_connect'
  | 'healthkit';

/** 能力域（二维能力地图：一般身体能力 × 乒乓球表现能力） */
export type CapacityDomain =
  | 'general_health'
  | 'physical_base'
  | 'sport_prep'
  | 'perception'
  | 'technique';

export type CapacityId =
  | 'aerobic'
  | 'strength'
  | 'mobility'
  | 'balance'
  | 'joint_control'
  | 'start_stop'
  | 'dynamic_stability'
  | 'ssc'
  | 'agility'
  | 'tension'
  | 'visual_search'
  | 'anticipation'
  | 'choice_reaction'
  | 'rhythm'
  | 'proprioception'
  | 'stroke_technique'
  | 'consistency'
  | 'movement_technique'
  | 'fatigue_technique';

/** 原始测量（不可被派生分数覆盖） */
export interface Observation {
  id: string;
  metricId: string;
  value: number;
  unit?: string;
  observedAt: number;
  source: DataSource;
  protocolVersion?: string;
}

/** 协议结果（如单腿坐站左 8 / 右 12） */
export interface AssessmentResult {
  id: string;
  assessmentId: string;
  date: string; // YYYY-MM-DD
  left?: number;
  right?: number;
  value?: number;
  unit?: string;
  protocolVersion: string;
}

export type CapacityStatus = 'below' | 'normal' | 'above' | 'unknown';

export interface CapacityState {
  capacityId: CapacityId;
  domain: CapacityDomain;
  status: CapacityStatus;
  confidence: 'low' | 'medium' | 'high';
  basisCount: number;
}

export interface CheckinInput {
  sleepHours?: number;
  fatigue?: number; // 1–10
  painParts?: string[];
  warningSymptoms?: string[]; // 胸痛/晕厥/异常气促等
  restingHr?: number;
}

/** 每日 Check-in 记录（含日期） */
export interface CheckinRecord extends CheckinInput {
  date: string; // YYYY-MM-DD
}

export interface SafetyDecision {
  state: 'green' | 'yellow' | 'red';
  reasons: string[];
  allowedIntensity: 'none' | 'low' | 'medium' | 'high';
  blockedExerciseTags: string[];
  ruleSetVersion: string;
}

export interface LimiterFinding {
  capacityId: CapacityId;
  priority: number;
  deficit: number;
  goalRelevance: number;
  transferEvidence: number;
  dataConfidence: number;
  trainability: number;
  rationale: string;
  recommendation: string;
  retestProtocol: string;
  invalidatedBy: string;
}

// ===== V3：台上训练编排器（Table Training）=====

/** 七层进阶模型 L1–L7 */
export type ProgressionLayerId = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7';

/** 是否知道下一球 */
export type BallKnowledge = '知道' | '部分知道' | '不知道';

export interface ProgressionLayer {
  id: ProgressionLayerId;
  name: string;
  ballKnowledge: BallKnowledge;
  purpose: string;
  coreTraining: string;
}

/** 随机度 */
export type Randomness = 'fixed' | 'semi' | 'random';

/** 球源 */
export type BallSource = 'partner' | 'robot' | 'multiball';

/** 球搭子水平 */
export type PartnerLevel = 'beginner' | 'higher';

/** 训练套路（八要素 + 自我教练统一模板） */
export interface Drill {
  id: string;
  layer: ProgressionLayerId;
  target: string; // 目标技术
  ballSources: BallSource[]; // 球源
  rule: string; // 规则（训练方法）
  randomness: Randomness; // 随机度
  focusPoint: string; // 训练者关注点（唯一主注意点）
  partnerTask: string; // 搭档任务
  upgradeCondition: string; // 升级条件（进阶阈值）
  nextDrillId?: string; // 下一等级
  correctFeel: string; // 正确体感
  commonErrorFeel: string; // 常见错误体感
  selfCheck: string; // 自检指标（五问自检）
  retentionTest: string; // 保持测试
  transferTest: string; // 迁移测试
}

/** 目标技术（训练生成公式的输入） */
export type TargetTechnique =
  | 'forehand_drive'
  | 'backhand_drive'
  | 'forehand_loop'
  | 'backhand_loop'
  | 'forehand_backspin'
  | 'backhand_backspin'
  | 'two_point_forehand'
  | 'fh_bh_switch'
  | 'serve_attack'
  | 'receive_attack';

export type TableSegmentKind =
  | 'warmup'
  | 'basic'
  | 'core'
  | 'movement'
  | 'semi'
  | 'serve_receive'
  | 'open'
  | 'match';

export interface TableSegment {
  kind: TableSegmentKind;
  name: string;
  minutes: number;
}

/** 训练配比（五类） */
export interface TableRatio {
  fixed: number; // 固定动作
  footwork: number; // 固定脚步
  semi: number; // 半随机
  serveReceive: number; // 发接发前三板
  random: number; // 完全随机/比赛
  rationale: string[];
}

/** 台上训练课记录 */
export interface TableSession {
  id: string;
  date: string;
  target: string;
  ballSource: BallSource;
  durationMin: number;
  segments: TableSegment[];
  completed: boolean;
  completedAt: number;
}

// ===== V3：自我教练闭环（Self Coaching Loop）=====

/** 五问自检结果（准·净·松·顺·回） */
export interface SelfCheckResult {
  accurate: boolean; // 准
  clean: boolean; // 净
  relaxed: boolean; // 松
  rhythm: boolean; // 顺
  recovered: boolean; // 回
}

export type GateId = 'stability' | 'quality' | 'retention' | 'transfer';

export interface Gate {
  id: GateId;
  name: string;
  description: string;
  threshold: string;
}

/** 进阶算法 Level A–G */
export type ProgressionLevel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

/** 最常见失误分类 */
export type ErrorKind = 'net' | 'out' | 'edge' | 'late' | 'jammed' | 'flat_foot' | 'slow_recovery';

/** 自检记录（六指标 + 最常见失误分类） */
export interface SelfCheckRecord {
  id: string;
  date: string;
  drillId: string;
  successMade: number; // 上台数
  successTotal: number; // 总数
  longestStreak: number; // 最长连续
  placementMade: number; // 落点命中数
  placementTotal: number; // 落点总数
  rpe: number; // 主观用力 1–10
  check: SelfCheckResult; // 动作质量（五问）
  focusPoint: string; // 当前主注意点
  topError: ErrorKind; // 最常见失误
}
