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
}

/** 专项训练结果类型（统一结果模型，Phase 0） */
export type ResultKind = 'reaction' | 'occlusion' | 'tension';

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
