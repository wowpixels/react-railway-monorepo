// components
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// types
import { RailWayConfig, Station } from "../Railway.types";

export type RailwayHeaderProps = {
  station: Station;
  config?: RailWayConfig;
  handleClose: () => void;
};

const RailwayHeader = ({
  station,
  config,
  handleClose,
}: RailwayHeaderProps) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
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
  );
};

export default RailwayHeader;
