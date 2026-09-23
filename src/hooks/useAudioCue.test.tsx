import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAudioCue } from './useAudioCue';

type Cue = ReturnType<typeof useAudioCue>;

// 每次渲染把 hook 的最新返回值写到模块级变量，便于测试读取 running/count 等状态
let latestCue: Cue;

function Harness({ gap }: { gap: [number, number] }) {
  latestCue = useAudioCue(gap);
  return null;
}

let speakMock: ReturnType<typeof vi.fn>;
let cancelMock: ReturnType<typeof vi.fn>;
let root: Root | null = null;
let container: HTMLDivElement | null = null;

function renderHarness(gap: [number, number] = [100, 100]): Cue {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root!.render(<Harness gap={gap} />);
  });
  return latestCue!;
}

function unmount() {
  const currentRoot = root;
  if (currentRoot) {
    act(() => currentRoot.unmount());
    root = null;
  }
  if (container) {
    container.remove();
    container = null;
  }
}

beforeEach(() => {
  vi.useFakeTimers();
  speakMock = vi.fn();
  cancelMock = vi.fn();
  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: { speak: speakMock, cancel: cancelMock },
  });
  class MockUtterance {
    lang = '';
    constructor(public text: string) {}
  }
  vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);
});

afterEach(() => {
  unmount();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => 'visible',
  });
});

describe('useAudioCue 停止播报的清理行为', () => {
  it('组件卸载时清掉定时器并取消播报，之后不再发声', () => {
    renderHarness();
    act(() => {
      latestCue!.start();
    });
    expect(speakMock).toHaveBeenCalledTimes(1);
    expect(latestCue!.running).toBe(true);

    const speakBefore = speakMock.mock.calls.length;
    const cancelBefore = cancelMock.mock.calls.length;

    unmount();

    // 卸载必须触发一次 cancel
    expect(cancelMock.mock.calls.length).toBe(cancelBefore + 1);
    // 卸载后即便时间继续推进，也不再触发新的 speak
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(speakMock.mock.calls.length).toBe(speakBefore);
  });

  it('切到后台（visibilitychange → hidden）时停止播报', () => {
    renderHarness();
    act(() => {
      latestCue!.start();
    });
    expect(speakMock).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });
    const speakBefore = speakMock.mock.calls.length;
    const cancelBefore = cancelMock.mock.calls.length;

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(cancelMock.mock.calls.length).toBe(cancelBefore + 1);
    expect(latestCue!.running).toBe(false);
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(speakMock.mock.calls.length).toBe(speakBefore);
  });

  it('关闭标签页（pagehide）时停止播报', () => {
    renderHarness();
    act(() => {
      latestCue!.start();
    });
    expect(speakMock).toHaveBeenCalledTimes(1);

    const cancelBefore = cancelMock.mock.calls.length;

    act(() => {
      window.dispatchEvent(new Event('pagehide'));
    });

    expect(cancelMock.mock.calls.length).toBe(cancelBefore + 1);
    expect(latestCue!.running).toBe(false);
  });
});
