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
}

export interface Feedback {
  date: string;
  cueId: string;
  result: FeedbackResult;
  note?: string;
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
