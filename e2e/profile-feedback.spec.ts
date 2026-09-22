import { test, expect } from '@playwright/test';

test('我的页：意见反馈为站外链接，新标签页打开腾讯文档问卷', async ({ page }) => {
  await page.goto('/#/profile');

  const link = page.getByRole('link', { name: /意见反馈/ });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', /docs\.qq\.com/);
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);

  // 描述说明用途
  await expect(page.getByText('用一分钟告诉我们哪里不好用')).toBeVisible();
});
