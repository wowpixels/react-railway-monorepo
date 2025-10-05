// components
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import "./App.css";

// railway
import { Railway, clickElement, useRailway } from "react-railway";

// hooks
import { useEffect, useState } from "react";

export type TourEligibility = { show: boolean };

const mockApiCall = async (railwayId: string): Promise<TourEligibility> => {
  await new Promise((r) => setTimeout(r, 600));
  return { show: railwayId === "my-custom-trip-2" ? false : true };
};

function App() {
  const {
    startEngine,
    // stopEngine, // use to stop the railway manually
    runningId,
    isRunning,
    isCompleted,
    setCompleted, // use to set completed manually
    isViewed,
    setViewed, // use to set viewed manually
    railwayOrder,
    setRailwayOrder, // use to set custom order of railways
  } = useRailway();
  const [canAutoStartRailway2, setCanAutoStartRailway2] = useState(false);

  console.warn("🚀 ~ App ~ runningId:", runningId);
  console.warn("🚀 ~ App ~ railwayOrder:", railwayOrder);
  console.warn("🚀 ~ App ~ isViewed:", isViewed);
  console.warn("🚀 ~ App ~ isCompleted:", isCompleted);
  console.warn("🚀 ~ App ~ isRunning:", isRunning);

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const STATIONS = [
    {
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
      beforeArrival: () => console.log("Arriving at center-box"),
      afterDeparture: () =>
        clickElement(".my-test-button", {
          scrollIntoView: true,
        }),
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
      id: "trash-list",
      title: "Trash list in drawer",
      description: "Highlight an item in the drawer.",
      beforeArrival: async () => {
        await clickElement(".drawer-trigger", { waitMsAfterClick: 200 });
      },
      afterDeparture: () => clickElement(".MuiBackdrop-root"),
    },
    {
      id: "top-right-box",
      title: "Top Right Box",
      description: "This box is in the top-right corner of the screen.",
      beforeArrival: () => console.log("Arriving at top-right-box"),
      afterDeparture: () => console.log("Leaving top-right-box"),
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

  const STATIONS_2 = [
    {
      id: "bottom-left-box",
      title: "Bottom Left Box",
      description: "This box is in the bottom-left corner of the screen.",
    },
    {
      id: "center-box-2",
      title: "Center Box 2",
      description: "This box is in the center of the screen.",
    },
    {
      id: "bottom-right-box-2",
      title: "Bottom Right Box 2",
      description: "This box is in the bottom-right corner of the screen.",
    },
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["All mail", "Trash", "Spam"].map((text) => (
          <ListItem
            key={text}
            disablePadding
            data-railway-station={text === "Trash" ? "trash-list" : undefined}
          >
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  useEffect(() => {
    setRailwayOrder(["my-custom-trip-2", "my-custom-trip-1"]);
  }, [setRailwayOrder]);

  // call your “API” on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { show } = await mockApiCall("my-custom-trip-2");
        if (!cancelled) setCanAutoStartRailway2(show);
        if (!show) {
          setViewed("my-custom-trip-2");
          setCompleted("my-custom-trip-2");
        }
      } catch {
        // swallow or setCanAutoStartRailway2(false)
      }
    })();
    return () => {
      cancelled = true; // guard against setState after unmount
    };
  }, [setViewed, setCompleted]);

  return (
    <>
      <Box
        width="100vw"
        height="100vh"
        bgcolor="lightgoldenrodyellow"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={2}
      >
        <Railway
          id="my-custom-trip-1"
          stations={STATIONS}
          config={{
            labels: {
              previous: "Vorige",
              stationDelimiter: "van",
            },
          }}
        />

        <Railway
          id="my-custom-trip-2"
          stations={STATIONS_2}
          config={{
            autoStart: canAutoStartRailway2,
          }}
        />

        <Stack>
          <Button
            className="my-test-button"
            onClick={() => console.log("button is clicked 🚀")}
          >
            Dummy Button
          </Button>

          <Button className="drawer-trigger" onClick={toggleDrawer(true)}>
            Open drawer
          </Button>
          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>

          <Button
            variant="contained"
            onClick={() => startEngine("my-custom-trip-1")}
          >
            Start the engine!
          </Button>
        </Stack>
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
      </Box>
      <Box
        width="100vw"
        height="100vh"
        bgcolor={"lightblue"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={2}
        position="relative"
      >
        <Box data-railway-station="center-box-2">Oh Yeah!</Box>
        <Box
          data-railway-station="bottom-right-box-2"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "yellow",
          }}
        >
          Bottom Right Box!
        </Box>
      </Box>
    </>
  );
}

export default App;
