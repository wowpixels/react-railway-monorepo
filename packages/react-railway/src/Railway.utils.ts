export const isFullyInView = (rect: DOMRect, pad = 0) => {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight =
    window.innerHeight || document.documentElement.clientHeight;
  return (
    rect.top >= pad &&
    rect.left >= pad &&
    rect.bottom <= viewHeight - pad &&
    rect.right <= viewWidth - pad
  );
};

const nextFrame = () =>
  new Promise<void>((r) => requestAnimationFrame(() => r()));

export const measureOnce = async (
  stationId: string
): Promise<DOMRect | null> => {
  const el = document.querySelector(
    `[data-railway-station="${stationId}"]`
  ) as HTMLElement | null;
  if (!el) return null;
  await nextFrame();
  return el.getBoundingClientRect();
};
