// components
import { PopperPlacementType, Typography } from "@mui/material";
import {
  StyledRailwayPaper,
  StyledRailwayPopper,
  StyledRailwayWrapperBox,
} from "./Railway.styles";
import RailwayFooter from "./components/RailwayFooter";
import RailwayHeader from "./components/RailwayHeader";

// hooks
import { useEffect, useRef, useState } from "react";
import { useRailway, useRegisterRailway } from "./hooks/useRailway";

// types
import { RailWayProps } from "./Railway.types";

// utils
import { centerAnchor, centerOffset, measureOnce } from "./Railway.utils";

const Railway = ({ id, stations, config }: RailWayProps) => {
  const {
    runningId,
    isRunning: engineRunning,
    isCompleted,
    isViewed,
    startEngine,
    stopEngine,
    setCompleted,
    setViewed,
    railwayOrder,
  } = useRailway();

  useRegisterRailway(id);

  const [rect, setRect] = useState<DOMRect | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const prevStepRef = useRef<number | null>(null);
  const [placement, setPlacement] = useState<PopperPlacementType>("bottom");

  const locallyBlocked = isCompleted.includes(id) || isViewed.includes(id);
  const isRunning = engineRunning && runningId === id;
  const autoStart = config?.autoStart ?? false;

  const isOffscreenVertically = (r: DOMRect) => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return r.bottom <= 0 || r.top >= vh;
  };

  useEffect(() => {
    if (!autoStart || locallyBlocked || engineRunning) return;
    const firstEligible = railwayOrder.find(
      (x) => !isCompleted.includes(x) && !isViewed.includes(x)
    );
    if (firstEligible === id) startEngine(id);
  }, [
    autoStart,
    locallyBlocked,
    engineRunning,
    id,
    startEngine,
    railwayOrder,
    isCompleted,
    isViewed,
  ]);

  const station = stations[currentStep];
  const hasTarget = Boolean(station?.id);

  useEffect(() => {
    if (!isRunning || stations.length === 0) return;

    let cancelled = false;

    (async () => {
      const prev = prevStepRef.current;
      if (prev !== null && prev !== currentStep) {
        try {
          await stations[prev]?.afterDeparture?.();
        } catch {}
      }
      try {
        await station?.beforeArrival?.();
      } catch {}

      // If no target id → no measure/scroll; just clear rect and choose a placement
      if (!hasTarget) {
        if (!cancelled) {
          setRect(null);
          setPlacement("auto"); // Popper decides best side
        }
        prevStepRef.current = currentStep;
        return;
      }

      let r = await measureOnce(station.id!);
      if (r && isOffscreenVertically(r)) {
        const el = document.querySelector(
          `[data-railway-station="${station.id}"]`
        ) as HTMLElement | null;
        if (el?.scrollIntoView) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
          await new Promise((res) => setTimeout(res, 350));
          r = await measureOnce(station.id!);
        }
      }

      if (!cancelled && r) {
        setRect(r);
        setPlacement(isOffscreenVertically(r) ? "bottom" : "top");
      }

      prevStepRef.current = currentStep;
    })();

    const onResize = () => {
      if (!hasTarget) return;
      const el = document.querySelector(
        `[data-railway-station="${station!.id}"]`
      ) as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect(r);
      setPlacement(isOffscreenVertically(r) ? "bottom" : "top");
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [currentStep, isRunning, stations, hasTarget]);

  if (!isRunning || stations.length === 0) return null;

  const totalStations = stations.length;

  const handleClose = () => {
    stations[currentStep]?.afterDeparture?.();
    prevStepRef.current = null;

    stopEngine(id);

    if (currentStep === totalStations - 1) {
      setCompleted(id, true);
    }
    setViewed(id, true);

    setRect(null);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep === totalStations - 1) {
      setCompleted(id, true);
      handleClose();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, totalStations - 1));
    }
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <>
      {/* Backdrop with hole */}
      <StyledRailwayWrapperBox rect={rect} />
      <StyledRailwayPopper
        open={isRunning}
        anchorEl={
          hasTarget
            ? document.querySelector(`[data-railway-station="${station.id}"]`)
            : centerAnchor
        }
        placement={hasTarget ? placement : "auto"}
        popperOptions={{ strategy: "fixed" }}
        modifiers={[
          {
            name: "flip",
            enabled: hasTarget,
            options: { fallbackPlacements: ["top", "bottom"] },
          },
          {
            name: "preventOverflow",
            enabled: true,
            options: {
              padding: 4,
            },
          },
          {
            name: "offset",
            options: hasTarget ? { offset: [0, 12] } : { offset: centerOffset },
          },
        ]}
      >
        <StyledRailwayPaper sx={config?.paperSx}>
          {/* Header */}
          <RailwayHeader
            station={station}
            config={config}
            handleClose={handleClose}
          />

          {/* Body */}
          {typeof station.description === "string" ? (
            <Typography variant="body2">{station.description}</Typography>
          ) : (
            station.description
          )}

          {/* Footer */}
          <RailwayFooter
            currentStep={currentStep}
            totalStations={totalStations}
            config={config}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        </StyledRailwayPaper>
      </StyledRailwayPopper>
    </>
  );
};

export default Railway;
