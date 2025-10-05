# React Railway 🚉

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)

Guide users through your React app step by step — built with [MUI](https://mui.com).
Think of it as a tour guide for your UI components.

Demo: **Coming soon**

## 📦 Installation

```bash
npm install react-railway
# or
yarn add react-railway
```

## ⚙️ Setup

Wrap your app with the provider once:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RailwayProvider } from "react-railway";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RailwayProvider>
      <App />
    </RailwayProvider>
  </StrictMode>
);
```

## ⚡ Quick Start (hook-only)

Import the component and manage the running state:

```jsx
import { Railway, useRailway } from "react-railway";
import { Typography, Button } from "@mui/material";

const STATIONS = [
  {
    id: "center-box",
    title: <Typography variant="h6">Center Box</Typography>,
    description: "This is a center highlight.",
  },
  {
    id: "top-right-box",
    title: "Top Right Box",
    description: "Lives in the header bar.",
  },
];

export default function App() {
  const { startEngine } = useRailway();

  return (
    <>
      <Railway id="my-custom-trip" stations={STATIONS} />
      <Button onClick={() => startEngine("my-custom-trip")}>
        Start Railway
      </Button>
    </>
  );
}
```

## 🗺️ Defining Stations

Each step is a station:

- id?: string – When present, the popper targets that element ([data-railway-station="..."]).
- If no id is provided, the popper appears centered in the viewport (no backdrop hole).
- title, description – string or JSX.
- beforeArrival(), afterDeparture() – optional lifecycle hooks (sync or async).

```jsx
const STATIONS = [
  // Centered pop — no id
  {
    title: "Welcome!",
    description: "This step is centered on the screen.",
  },
  // Anchored to an element
  {
    id: "trash-list",
    title: "Trash list in drawer",
    description: "Opens the drawer and highlights Trash.",
    beforeArrival: async () => {
      await clickElement(".drawer-trigger", { waitMsAfterClick: 200 });
    },
    afterDeparture: () => clickElement(".MuiBackdrop-root"),
  },
];
```

Attach data-railway-station to elements you want to highlight:

```html
<div data-railway-station="trash-list">Trash</div>
```

## 🚦 Autostart + Ordering

You can let a Railway auto-start (e.g. after an API permit), and control which Railway runs first when multiple are present.

```jsx
import { useEffect, useState } from "react";
import { Railway, useRailway } from "react-railway";

export default function App() {
  const { setRailwayOrder } = useRailway();
  const [canAutoStart, setCanAutoStart] = useState(false);

  useEffect(() => {
    // First eligible id will auto-start
    setRailwayOrder(["first-railway", "second-railway"]);
  }, [setRailwayOrder]);

  useEffect(() => {
    // mock API
    (async () => {
      await new Promise(r => setTimeout(r, 600));
      setCanAutoStart(true);
    })();
  }, []);

  return (
    <>
      <Railway id="first-railway" stations={...} config={{ autoStart: canAutoStart }} />
      <Railway id="second-railway" stations={...} />
    </>
  );
}
```

Rules:

- config.autoStart only starts a Railway if it’s the first eligible id in railwayOrder.
- A Railway that’s already viewed/completed won’t autostart again.
- Manual startEngine(id) always starts it, regardless of viewed/completed.

## 📦 Persistence

The provider remembers per-railway state in localStorage:

- Viewed: Railway was shown at least once.
- Completed: user finished the last station.

Keys look like: railway:${id}:viewed and railway:${id}:completed.

## 🧠 Hook API

```jsx
const {
  // state
  runningId, // string | null
  isRunning, // boolean (any railway running?)
  isCompleted, // string[] (railway ids)
  isViewed, // string[] (railway ids)
  railwayOrder, // string[]

  // actions
  registerRailway, // (id) — handled for you by <Railway/> + useRegisterRailway
  unregisterRailway, // (id)
  startEngine, // (id)
  stopEngine, // (id)
  setCompleted, // (id, value = true)
  setViewed, // (id, value = true)
  setRailwayOrder, // (ids: string[])
} = useRailway();
```

Auto-registering a Railway id (if you render custom shells):

```jsx
import { useRegisterRailway } from "react-railway";
useRegisterRailway("my-custom-trip");
```

## 🧰 Utility: clickElement

Programmatically click (and optionally scroll to) a DOM element.
Great for opening drawers, tabs, or menus before highlighting.

```js
import { clickElement } from "react-railway";

await clickElement(".drawer-trigger", {
  scrollIntoView: true, // scroll before click
  scrollBehavior: "smooth", // 'auto' | 'smooth'
  focusAfterClick: false,
  waitMsAfterClick: 200, // wait for animations
  afterClickWaitFor: '[data-railway-station="trash-list"]', // cheap polling
  afterClickWaitTimeoutMs: 1500,
});
```

## 🎛️ Config

```ts
type RailWayConfig = {
  autoStart?: boolean; // default false
  paperSx?: SxProps<Theme>; // MUI sx for the popper paper
  labels?: {
    previous?: string;
    next?: string;
    finish?: string;
    closeTooltip?: string;
    stationDelimiter?: string;
  };
};
```

Behavior details:

- If a target element is off-screen, Railway scrolls it minimally into view, then shows the popper.
- If the target is visible, the popper prefers top (flips to bottom when necessary).
- If a station has no id, the popper is centered on the viewport (no backdrop hole).

## 🧩 Types

```ts
type Station = {
  id?: string; // optional → centered popper
  title: React.ReactNode;
  description?: React.ReactNode;
  beforeArrival?: () => void | Promise<void>;
  afterDeparture?: () => void | Promise<void>;
};

type RailWayProps = {
  id: string;
  stations: Station[];
  config?: RailWayConfig;
};
```

## 📚 Props Overview

| Prop       | Type            | Description                                |
| ---------- | --------------- | ------------------------------------------ |
| `id`       | `string`        | Unique identifier for the Railway instance |
| `stations` | `Station[]`     | Steps of your railway                      |
| `config`   | `RailwayConfig` | autoStart, paperSx, labels                 |

## 📝 License

MIT © Twana Gul | Wowpixels
