import { test, expect } from '@playwright/test';

test('主流程：首页 → 选场景 → 选时长 → 进入训练执行', async ({ page }) => {
  await page.goto('/');

  // 首页加载
  await expect(page.getByRole('heading', { name: '乒乓球训练伴侣' })).toBeVisible();

  // 离台练习 → 场景选择
  await page.getByRole('link', { name: /离台练习/ }).click();
  await expect(page.getByRole('heading', { name: '在哪里训练？' })).toBeVisible();

  // 选择「家」场景 → 时长选择
  await page.getByRole('button', { name: /家/ }).click();
  await expect(page.getByRole('heading', { name: '今天状态怎么样？' })).toBeVisible();

  // 选择「3 分钟」→ 进入执行器，显示第 1 步
  await page.getByRole('button', { name: /3 分钟/ }).click();
  await expect(page.getByText(/步骤 1\//)).toBeVisible();
});
