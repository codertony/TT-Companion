import { describe, it, expect } from 'vitest';
import { scenePrimaryRoute, sceneSecondaryRoute } from './sceneRoute';

describe('sceneRoute', () => {
  it('球馆主落点进入台上训练编排', () => {
    expect(scenePrimaryRoute('club')).toBe('/table');
  });

  it('离台场景主落点进入选时长', () => {
    for (const s of ['metro_sit', 'metro_stand', 'office', 'home'] as const) {
      expect(scenePrimaryRoute(s)).toBe('/train/duration');
    }
  });

  it('球馆副落点为记录验证，其余场景无副动作', () => {
    expect(sceneSecondaryRoute('club')).toBe('/profile/feedback');
    expect(sceneSecondaryRoute('home')).toBeNull();
    expect(sceneSecondaryRoute('office')).toBeNull();
    expect(sceneSecondaryRoute('metro_sit')).toBeNull();
    expect(sceneSecondaryRoute('metro_stand')).toBeNull();
  });
});
