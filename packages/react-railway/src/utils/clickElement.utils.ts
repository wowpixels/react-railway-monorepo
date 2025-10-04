export type ClickTarget = string | Element | null | undefined;

const resolveEl = (target: ClickTarget): Element | null => {
  if (!target) return null;
  if (typeof target === "string") return document.querySelector(target);
  return target;
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Clicks a DOM element and optionally waits afterwards.
 * - Use `waitMsAfterClick` to give animations time to finish (e.g., Drawer open).
 * - Optionally wait for a selector to appear via `afterClickWaitFor`.
 */
export const clickElement = async (
  target: ClickTarget,
  opts: {
    scrollIntoView?: boolean;
    scrollBehavior?: ScrollBehavior;
    focusAfterClick?: boolean;
    waitMsAfterClick?: number; // e.g., 300 (ms), keep it small
    afterClickWaitFor?: string; // e.g., '[data-railway-station="trash-list"]'
    afterClickWaitTimeoutMs?: number; // default 1500
  } = {}
): Promise<boolean> => {
  if (typeof window === "undefined" || typeof document === "undefined")
    return false;

  const {
    scrollIntoView = false,
    scrollBehavior = "auto",
    focusAfterClick = false,
    waitMsAfterClick = 0,
    afterClickWaitFor,
    afterClickWaitTimeoutMs = 1500,
  } = opts;

  const el = resolveEl(target) as HTMLElement | null;
  if (!el) return false;

  if (scrollIntoView && "scrollIntoView" in el) {
    el.scrollIntoView({
      behavior: scrollBehavior,
      block: "center",
      inline: "nearest",
    });
  }

  // Simulate a real user click (React always sees this)
  const ev = (type: string) =>
    el.dispatchEvent(
      new MouseEvent(type, { bubbles: true, cancelable: true, view: window })
    );
  ev("pointerdown");
  ev("mousedown");
  ev("mouseup");
  ev("click");

  if (focusAfterClick && typeof el.focus === "function") el.focus();

  // Option A: fixed wait
  if (waitMsAfterClick > 0) await sleep(waitMsAfterClick);

  // Option B: wait until a selector appears (cheap polling)
  if (afterClickWaitFor) {
    const start = performance.now();
    while (performance.now() - start < afterClickWaitTimeoutMs) {
      if (document.querySelector(afterClickWaitFor)) break;
      await sleep(50);
    }
  }

  return true;
};
