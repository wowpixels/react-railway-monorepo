import type { VirtualElement } from "@popperjs/core";
import { OffsetsFunction } from "@popperjs/core/lib/modifiers/offset";

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

export const centerAnchor: VirtualElement = {
  contextElement: document.body,
  getBoundingClientRect: () => {
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const x = vw / 2;
    const y = vh / 2;
    return {
      width: 0,
      height: 0,
      top: y,
      bottom: y,
      left: x,
      right: x,
      x,
      y,
      toJSON: () => {},
    } as DOMRect;
  },
};

export const centerOffset: OffsetsFunction = ({ placement, popper }) => {
  const { width, height } = popper;

  // For vertical placements, horizontally centering is default.
  if (placement.startsWith("top") || placement.startsWith("bottom")) {
    return [-height / 2, -width / 2];
  }

  return [-width / 2, -height / 2];
};
