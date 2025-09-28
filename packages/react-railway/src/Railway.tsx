import {
  IconButton,
  Paper,
  Button,
  Box,
  Stack,
  Tooltip,
  Typography,
  Popper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { RailWayProps } from "./Railway.types";

// Todo:
// [ x ] Create the station dialog
// [ x ] Connect the dialog to a data-railway-station id
// [ x ] Clicking prev/next in the dialog allows you to navigate to a station
// [ ] Allow before and after callback at a station
// [ x ] Highlight target element
// [ x ] add to localStorage if railway isCompleted or isViewed

const Railway = ({ id, stations, config }: RailWayProps) => {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const isRailwayCompleted =
    localStorage.getItem(`${id || "railway"}-isCompleted`) || false;
  const isRailwayViewed =
    localStorage.getItem(`${id || "railway"}-isViewed`) || false;
  const [isCompleted, setIsCompleted] = useState(isRailwayCompleted);
  const [isViewed, setIsViewed] = useState(isRailwayViewed || false);

  const hasTrigger = Boolean(config?.trigger);
  const isRunning = hasTrigger
    ? config?.trigger?.isRailwayRunning ?? false
    : isCompleted || isViewed
    ? false
    : true;

  // Note: we use this for highlighting the element
  const updateRect = (stationId: string) => {
    const el = document.querySelector(
      `[data-railway-station="${stationId}"]`
    ) as HTMLElement | null;
    if (el) {
      const r = el.getBoundingClientRect();
      setRect(r);
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setRect(null);
    }
  };

  useEffect(() => {
    if (stations[currentStep]) {
      updateRect(stations[currentStep].id);
      const resize = () => updateRect(stations[currentStep].id);
      window.addEventListener("resize", resize);
      window.addEventListener("scroll", resize, true);
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", resize, true);
      };
    }
  }, [currentStep, stations]);

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
      <Box
        sx={{
          position: "fixed",
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
          zIndex: (theme) => theme.zIndex.modal,
          pointerEvents: "none",
          borderRadius: 2,
          boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
          transition: "all 0.2s ease",
        }}
      />

      <Popper
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
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
      >
        <Paper
          sx={{
            p: 2,
            minWidth: 300,
            borderRadius: (theme) => theme.shape.borderRadius,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            ...config?.paperSx,
          }}
        >
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {typeof station.title === "string" ? (
              <Typography variant="h6">{station.title}</Typography>
            ) : (
              station.title
            )}
            <Tooltip title={config?.labels?.closeTooltip || "Close"} arrow>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Body */}
          {typeof station.description === "string" ? (
            <Typography variant="body2">{station.description}</Typography>
          ) : (
            station.description
          )}

          {/* Footer */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            paddingTop={1}
          >
            <Typography variant="body2">
              {currentStep + 1}
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  paddingX: 0.5,
                }}
              >
                {config?.labels?.stationDelimiter || "/"}
              </Box>
              {totalStations}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="text"
                onClick={handlePrev}
                disabled={currentStep === 0}
              >
                {config?.labels?.previous || "Previous"}
              </Button>
              <Button variant="contained" onClick={handleNext}>
                {currentStep === totalStations - 1
                  ? config?.labels?.finish || "Finish"
                  : config?.labels?.next || "Next"}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Popper>
    </>
  );
};

export default Railway;
