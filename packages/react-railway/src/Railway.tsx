// components
import { Typography } from "@mui/material";
import {
  StyledRailwayPaper,
  StyledRailwayPopper,
  StyledRailwayWrapperBox,
} from "./Railway.styles";
import RailwayFooter from "./components/RailwayFooter";
import RailwayHeader from "./components/RailwayHeader";

// hooks
import { useEffect, useRef, useState } from "react";

// types
import { RailWayProps } from "./Railway.types";

// utils
import { measureOnce } from "./Railway.utils";

const Railway = ({ id, stations, config }: RailWayProps) => {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const readBool = (key: string) => localStorage.getItem(key) === "true";
  const [isCompleted, setIsCompleted] = useState<boolean>(
    readBool(`${id || "railway"}-isCompleted`)
  );
  const [isViewed, setIsViewed] = useState<boolean>(
    readBool(`${id || "railway"}-isViewed`)
  );

  const hasTrigger = Boolean(config?.trigger);
  const isRunning = hasTrigger
    ? config?.trigger?.isRailwayRunning ?? false
    : isCompleted || isViewed
    ? false
    : true;

  // Track previous step to know what we're leaving
  const prevStepRef = useRef<number | null>(null);

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
        await stations[currentStep]?.beforeArrival?.();
      } catch {}

      const curr = stations[currentStep];
      if (!curr) return;

      const rect = await measureOnce(curr.id);
      if (!cancelled && rect) setRect(rect);

      prevStepRef.current = currentStep;
    })();

    const onResize = () => {
      const curr = stations[currentStep];
      if (!curr) return;
      const el = document.querySelector(
        `[data-railway-station="${curr.id}"]`
      ) as HTMLElement | null;
      if (!el) return;
      setRect(el.getBoundingClientRect());
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [currentStep, isRunning, stations]);

  useEffect(() => {
    if (isCompleted) {
      localStorage.setItem(`${id || "railway"}-isCompleted`, `${isCompleted}`);
      localStorage.setItem(`${id || "railway"}-isViewed`, `${isViewed}`);
    } else {
      localStorage.setItem(`${id || "railway"}-isViewed`, `${isViewed}`);
    }
  }, [isCompleted, isViewed]);

  if (!isRunning || stations.length === 0) return null;

  if (!rect) return null;

  const totalStations = stations.length;
  const station = stations[currentStep];

  const handleClose = () => {
    stations[currentStep]?.afterDeparture?.();
    prevStepRef.current = null;

    if (hasTrigger) {
      config?.trigger?.onClose?.();
    } else {
      setRect(null);
    }

    if (currentStep === totalStations - 1) {
      setIsCompleted(true);
    }

    setCurrentStep(0);
    setIsViewed(true);
  };

  const handleNext = () => {
    if (currentStep === totalStations - 1) {
      setIsCompleted(true);
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
        anchorEl={document.querySelector(
          `[data-railway-station="${station.id}"]`
        )}
        placement="bottom"
        modifiers={[
          {
            name: "flip",
            enabled: true,
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
            options: {
              offset: [0, 12], // 12px gap from target
            },
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
