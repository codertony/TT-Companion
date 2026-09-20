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
