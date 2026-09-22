import { test, expect } from '@playwright/test';

// 与 src/lib/env.test.ts 保持一致的 UA 样本
const UA = {
  iosSafari:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  wechatIOS:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.45(0x18002d2e) NetType/WIFI Language/zh_CN',
  wechatAndroid:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/UD1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 MicroMessenger/8.0.45',
  desktopChrome:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  desktopFirefox:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
};

const INSTALL_LINK = /桌面应用安装引导/;

test.describe('安装引导 · 已安装', () => {
  test('我的页不出现安装引导入口', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'standalone', { value: true, configurable: true });
    });
    await page.goto('/#/profile');
    await expect(page.getByRole('link', { name: INSTALL_LINK })).toHaveCount(0);
  });
});

test.describe('安装引导 · iOS Safari', () => {
  test.use({ userAgent: UA.iosSafari });

  test('我的页显示入口，引导页渲染三步图文', async ({ page }) => {
    await page.goto('/#/profile');
    await expect(page.getByRole('link', { name: INSTALL_LINK })).toBeVisible();

    await page.getByRole('link', { name: INSTALL_LINK }).click();
    await expect(page.getByText('在 Safari 中把训练伴侣加到主屏幕')).toBeVisible();
    await expect(page.getByText('点底部「分享」按钮')).toBeVisible();
    await expect(page.getByText('下滑选「添加到主屏幕」')).toBeVisible();
    await expect(page.getByText('点右上角「添加」')).toBeVisible();
  });
});

test.describe('安装引导 · 微信 iOS', () => {
  test.use({ userAgent: UA.wechatIOS });

  test('引导到 Safari 打开并给出复制链接兜底', async ({ page }) => {
    await page.goto('/#/profile/install');
    await expect(page.getByText('微信里装不了，先换到浏览器')).toBeVisible();
    await expect(page.getByText('在 Safari 中打开')).toBeVisible();
    await expect(page.getByRole('button', { name: /复制链接/ })).toBeVisible();
  });
});

test.describe('安装引导 · 微信 Android', () => {
  test.use({ userAgent: UA.wechatAndroid });

  test('引导到浏览器打开', async ({ page }) => {
    await page.goto('/#/profile/install');
    await expect(page.getByText('微信里装不了，先换到浏览器')).toBeVisible();
    await expect(page.getByText('在浏览器打开')).toBeVisible();
    await expect(page.getByRole('button', { name: /复制链接/ })).toBeVisible();
  });
});

test.describe('安装引导 · Chromium', () => {
  test.use({ userAgent: UA.desktopChrome });

  test('桌面端渲染「安装到电脑」主按钮', async ({ page }) => {
    await page.goto('/#/profile');
    await expect(page.getByRole('link', { name: INSTALL_LINK })).toBeVisible();

    await page.getByRole('link', { name: INSTALL_LINK }).click();
    await expect(page.getByRole('button', { name: '安装到电脑' })).toBeVisible();
  });
});

test.describe('安装引导 · 其他浏览器', () => {
  test.use({ userAgent: UA.desktopFirefox });

  test('提示换 Chrome / Safari', async ({ page }) => {
    await page.goto('/#/profile/install');
    await expect(page.getByText('请换 Chrome / Safari 打开')).toBeVisible();
  });
});

test.describe('安装引导 · 截图', () => {
  test('亮/暗 × 三种状态', async ({ browser }) => {
    const states = [
      { name: 'ios-safari', ua: UA.iosSafari },
      { name: 'wechat-ios', ua: UA.wechatIOS },
      { name: 'chromium', ua: UA.desktopChrome },
    ];
    for (const theme of ['light', 'dark']) {
      for (const s of states) {
        const context = await browser.newContext({
          userAgent: s.ua,
          viewport: { width: 390, height: 844 },
        });
        const page = await context.newPage();
        await page.addInitScript((t: string) => {
          localStorage.setItem('ttc:settings', JSON.stringify({ state: { theme: t }, version: 1 }));
        }, theme);
        await page.goto('http://localhost:5199/#/profile/install');
        await page.screenshot({
          path: `test-results/install-guide/${theme}-${s.name}.png`,
          fullPage: true,
        });
        await context.close();
      }
    }
  });
});
