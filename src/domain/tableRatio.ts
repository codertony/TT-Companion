// 台上训练配比（纯函数）：固定动作/固定脚步/半随机/发接发前三板/完全随机与比赛
import type { TableRatio } from '../types';

/** 进阶顺序：稳定性 → 落点 → 节奏 → 速度 → 力量 */
export const SKILL_PROGRESSION = ['稳定性', '落点', '节奏', '速度', '力量'];

/** 稳定性等级 → 五类配比（数值为可校准的产品假设） */
export function tableRatio(stabilityLevel: number): TableRatio {
  const t = Math.max(0, Math.min(1, stabilityLevel));
  const lerp = (a: number, b: number) => a + (b - a) * t;
  const fixed = Math.round(lerp(30, 15));
  const footwork = Math.round(lerp(25, 20));
  const semi = Math.round(lerp(20, 25));
  const serveReceive = Math.round(lerp(15, 20));
  const random = 100 - fixed - footwork - semi - serveReceive;
  const rationale =
    t >= 0.5
      ? ['动作趋稳，逐步减少固定动作、增加随机与比赛占比']
      : ['动作尚未稳定，固定动作与脚步占主导'];
  return { fixed, footwork, semi, serveReceive, random, rationale };
}
