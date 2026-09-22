import { test, expect } from '@playwright/test';

test('主题色：顶部状态栏跟随主题背景（亮 #f8fafc / 暗 #020617）', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#f8fafc');

  // 切到暗黑主题
  await page.goto('/#/profile/settings');
  await page.getByRole('button', { name: '暗黑' }).click();
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#020617');
  await expect(page.locator('html')).toHaveClass(/dark/);

  // 切回普通
  await page.getByRole('button', { name: '普通' }).click();
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#f8fafc');
});

test('离台训练：点「结束」也落盘，不丢已完成的部分训练', async ({ page }) => {
  await page.goto('/#/train');
  await page.getByRole('button', { name: '家' }).click();
  await page.getByRole('button', { name: /^1 分钟/ }).click();
  await expect(page.getByRole('button', { name: '结束', exact: true })).toBeVisible();

  // 结束 → 确认结束
  await page.getByRole('button', { name: '结束', exact: true }).click();
  await page.getByRole('button', { name: '确认结束', exact: true }).click();

  // 应回到首页，且已记录一次训练
  await expect(page).toHaveURL(/#\/$/);
  const count = await page.evaluate(() => {
    const raw = localStorage.getItem('ttc:sessions');
    const s = raw ? JSON.parse(raw) : null;
    return s?.state?.sessions?.length ?? 0;
  });
  expect(count).toBeGreaterThanOrEqual(1);
});

test('周末验证：Cue 标签显示中文而非原始 ID', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'ttc:cue',
      JSON.stringify({
        state: {
          primary: {
            id: 'c1', text: '身体先走', skill: 'forehand_drive',
            tags: ['arm_stiff', 'hand_first'], type: 'technique',
            priority: 1, status: 'active', doneWeeks: 0,
          },
          backlog: [], history: [],
        },
        version: 1,
      }),
    );
  });
  await page.goto('/#/profile/feedback');
  await expect(page.getByText('手臂僵硬 · 手先启动')).toBeVisible();
  await expect(page.getByText('arm_stiff')).toHaveCount(0);
});

test('评估中心：每项评估显示「怎么做」协议说明', async ({ page }) => {
  await page.goto('/#/assess');
  await expect(page.getByText('单腿站平衡')).toBeVisible();
  await expect(page.getByText(/脱鞋，单腿站立/)).toBeVisible();
  await expect(page.getByText(/坐在约 45cm 高的椅子边缘/)).toBeVisible();
});
