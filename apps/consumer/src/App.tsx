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
import { Railway, clickElement } from "react-railway";

// hooks
import { useRef, useState } from "react";

function App() {
  const triggerEl = useRef(null);
  const [isRailwayRunning, setIsRailwayRunning] = useState(false);

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

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
          ref={triggerEl}
          variant="contained"
          onClick={() => setIsRailwayRunning(true)}
        >
          Trigger Element
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
    </>
  );
}

export default App;
