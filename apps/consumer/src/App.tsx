import { Box, Typography, Button } from "@mui/material";
import "./App.css";
import { Railway } from "react-railway";
import { useRef, useState } from "react";

function App() {
  const triggerEl = useRef(null);
  const [isRailwayRunning, setIsRailwayRunning] = useState(false);

  const STATIONS = [
    {
      id: "center-box",
      title: (
        <Typography variant="h6" color="primary">
          Center Box
        </Typography>
      ),
      description: (
        <Typography variant="body2">
          This is the <b>center box</b> where you can showcase content.
        </Typography>
      ),
    },
    {
      id: "top-left-box",
      title: "Top Left Box",
      description: (
        <Typography variant="body2" color="secondary">
          This box is in the top-left corner of the screen.
        </Typography>
      ),
    },
    {
      id: "top-right-box",
      title: "Top Right Box",
      description: "This box is in the top-right corner of the screen.",
    },
    {
      id: "bottom-left-box",
      title: "Bottom Left Box",
      description: "This box is in the bottom-left corner of the screen.",
    },
    {
      id: "bottom-right-box",
      title: "Bottom Right Box",
      description: "This box is in the bottom-right corner of the screen.",
    },
  ];

  return (
    <>
      <Railway
        id="my-custom-trip"
        stations={STATIONS}
        config={{
          trigger: {
            element: triggerEl,
            isRailwayRunning,
            onClose: () => setIsRailwayRunning(false),
          },
          labels: {
            previous: "Vorige",
            stationDelimiter: "van",
          },
        }}
      />

      <Button
        ref={triggerEl}
        variant="contained"
        onClick={() => setIsRailwayRunning(true)}
      >
        Trigger Element
      </Button>
      <Box
        data-railway-station="top-left-box"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "yellow",
        }}
      >
        Top Left Box!
      </Box>
      <Box data-railway-station="center-box">Hello world!</Box>
      <Box
        data-railway-station="top-right-box"
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "yellow",
        }}
      >
        Top Right Box!
      </Box>

      <Box
        data-railway-station="bottom-left-box"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          backgroundColor: "yellow",
        }}
      >
        Bottom Left Box!
      </Box>

      <Box
        data-railway-station="bottom-right-box"
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          backgroundColor: "yellow",
        }}
      >
        Bottom Right Box!
      </Box>
    </>
  );
}

export default App;
