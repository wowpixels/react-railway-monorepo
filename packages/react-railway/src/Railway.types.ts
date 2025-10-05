// types
import { SxProps, Theme } from "@mui/material";
import { ReactNode, RefObject } from "react";

export type Station = {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  beforeArrival?: () => void;
  afterDeparture?: () => void;
};

export type PaperSx = SxProps<Theme>;

export type RailWayConfig = {
  autoStart?: boolean;
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
