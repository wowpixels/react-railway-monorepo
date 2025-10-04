// components
import { Button, Stack, Typography } from "@mui/material";
import { StyledFooterDelimiterBox } from "../Railway.styles";

// types
import { RailWayConfig } from "../Railway.types";

export type RailwayFooterProps = {
  currentStep: number;
  totalStations: number;
  config?: RailWayConfig;
  handleNext: () => void;
  handlePrev: () => void;
};

const RailwayFooter = ({
  currentStep,
  totalStations,
  config,
  handleNext,
  handlePrev,
}: RailwayFooterProps) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      paddingTop={1}
    >
      <Typography variant="body2">
        {currentStep + 1}
        <StyledFooterDelimiterBox component="span">
          {config?.labels?.stationDelimiter || "/"}
        </StyledFooterDelimiterBox>
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
  );
};

export default RailwayFooter;
