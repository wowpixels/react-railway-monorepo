// components and types
import {
  alpha,
  Box,
  BoxProps,
  Paper,
  PaperProps,
  Popper,
  PopperProps,
  styled,
} from "@mui/material";

export const StyledRailwayWrapperBox = styled(Box)<
  BoxProps & {
    rect?: DOMRect | null;
  }
>(({ theme, rect }) => ({
  position: "fixed",
  zIndex: theme.zIndex.modal,
  pointerEvents: "none",
  borderRadius: theme.shape.borderRadius,
  boxShadow: `0 0 0 9999px ${alpha(theme.palette.common.black, 0.5)}`,
  ...(rect
    ? {
        top: rect.top - 8,
        left: rect.left - 8,
        width: rect.width + 16,
        height: rect.height + 16,
      }
    : {}),
}));

export const StyledRailwayPopper = styled(Popper)<PopperProps>(({ theme }) => ({
  zIndex: theme.zIndex.modal + 1,
}));

export const StyledRailwayPaper = styled(Paper)<PaperProps>(({ theme }) => ({
  padding: theme.spacing(2),
  minWidth: "300px",
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const StyledFooterDelimiterBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "inline-block",
  padding: theme.spacing(0, 0.5),
}));
