import { test, expect } from '@playwright/test';

test('台上训练：首页入口 → 编排 → 生成训练课 → 逐段完成 → 自检', async ({ page }) => {
  await page.goto('/');

  // 首页入口
  await page.getByRole('link', { name: /台上训练编排/ }).click();
  await expect(page.getByRole('heading', { name: '台上训练编排' })).toBeVisible();

  // 选目标技术「反手起下旋」
  await page.getByRole('button', { name: '反手起下旋' }).click();

  // 生成训练课
  await page.getByRole('button', { name: /生成训练课/ }).click();
  await expect(page.getByRole('heading', { name: /台上训练 · 反手起下旋/ })).toBeVisible();

  // 逐段完成（green 下 8 段）
  for (let i = 0; i < 8; i++) {
    await page.getByRole('button', { name: '完成此段' }).click();
  }

  // 自检表单：勾一项五问 + 填总数后提交
  await expect(page.getByText(/五问自检/)).toBeVisible();
  await page.getByRole('button', { name: '准', exact: true }).click();
  await page.getByPlaceholder('总数', { exact: true }).fill('20');
  await page.getByPlaceholder('上台数', { exact: true }).fill('17');
  await page.getByRole('button', { name: '完成并记录' }).click();
  await expect(page.getByText(/训练课已记录/)).toBeVisible();
});

test('台上训练：Red 状态下不生成训练课', async ({ page }) => {
  await page.goto('/');
  // 造一个 Red 状态：直接写入 Check-in 记录（本地日期）
  await page.evaluate(() => {
    const d = new Date();
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    localStorage.setItem(
      'ttc:checkin',
      JSON.stringify({ state: { records: [{ date, warningSymptoms: ['胸痛'] }] }, version: 1 }),
    );
  });
  await page.reload();
  await page.goto('/#/table');
  await expect(page.getByRole('button', { name: /今日先休息/ })).toBeVisible();
});
