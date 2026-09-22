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
  // 段有具体说明
  await expect(page.getByText(/活动关节/)).toBeVisible();

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

test('台上训练：跳过自检仍记录训练课', async ({ page }) => {
  await page.goto('/#/table');
  await page.getByRole('button', { name: /生成训练课/ }).click();
  await expect(page.getByRole('heading', { name: /台上训练 · / })).toBeVisible();

  for (let i = 0; i < 8; i++) {
    await page.getByRole('button', { name: '完成此段' }).click();
  }
  await expect(page.getByText(/五问自检/)).toBeVisible();
  await page.getByRole('button', { name: /跳过自检/ }).click();
  await expect(page.getByText(/训练课已记录/)).toBeVisible();
  await expect(page.getByText('未做自检', { exact: true })).toBeVisible();
});

test('台上训练：自检阶段点「结束」仍记录训练课', async ({ page }) => {
  await page.goto('/#/table');
  await page.getByRole('button', { name: /生成训练课/ }).click();

  for (let i = 0; i < 8; i++) {
    await page.getByRole('button', { name: '完成此段' }).click();
  }
  await expect(page.getByText(/五问自检/)).toBeVisible();
  await page.getByRole('button', { name: '结束', exact: true }).click();
  await page.getByRole('button', { name: '确认结束', exact: true }).click();
  await expect(page.getByText(/训练课已记录/)).toBeVisible();
  await expect(page.getByText('未做自检', { exact: true })).toBeVisible();
});

test('台上训练：说明弹框可打开', async ({ page }) => {
  await page.goto('/#/table');
  await page.getByRole('button', { name: '说明', exact: true }).click();
  await expect(page.getByText('术语说明', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '关闭' }).click();
  await expect(page.getByText('术语说明', { exact: true })).not.toBeVisible();
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

test('球馆场景：从「在哪里训练？」进入台上训练编排 → 生成训练课 → 执行', async ({ page }) => {
  await page.goto('/#/train');
  await expect(page.getByRole('heading', { name: '在哪里训练？' })).toBeVisible();

  // 球馆卡片上有两个明确动作：上台训练 / 记录验证
  await expect(page.getByRole('button', { name: /上台训练/ })).toBeVisible();
  await expect(page.getByRole('button', { name: '记录验证', exact: true })).toBeVisible();

  // 主路径：上台训练 → 台上训练编排
  await page.getByRole('button', { name: /上台训练/ }).click();
  await expect(page.getByRole('heading', { name: '台上训练编排' })).toBeVisible();

  // 生成训练课 → 训练执行页
  await page.getByRole('button', { name: /生成训练课/ }).click();
  await expect(page.getByRole('heading', { name: /台上训练 · / })).toBeVisible();
});

test('球馆场景：保留「记录验证」通路', async ({ page }) => {
  await page.goto('/#/train');
  await page.getByRole('button', { name: '记录验证', exact: true }).click();
  await expect(page).toHaveURL(/#\/profile\/feedback/);
});
