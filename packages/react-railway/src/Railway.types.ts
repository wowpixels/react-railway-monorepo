// types
import { SxProps, Theme } from "@mui/material";
import { ReactNode, RefObject } from "react";

export type Station = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  beforeArrival?: () => void;
  afterDeparture?: () => void;
};

export type PaperSx = SxProps<Theme>;

export type RailWayConfig = {
  trigger?: {
    element?: RefObject<null>;
    isRailwayRunning: boolean;
    onClose?: () => void;
  };
  isViewed?: Boolean; // Note: use for external api call to check whether user already has seen the railway
  paperSx?: PaperSx;
  labels?: {
    previous?: string;
    next?: string;
    finish?: string;
    closeTooltip?: string;
    stationDelimiter?: string;
  };
};

export type RailWayProps = {
  id: string;
  stations: Station[];
  config?: RailWayConfig;
};
