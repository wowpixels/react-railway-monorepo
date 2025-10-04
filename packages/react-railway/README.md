# React Railway 🚉

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)

Guide users through your React app step by step — built with [MUI](https://mui.com).
Think of it as a tour guide for your UI components.

Demo: **Coming soon**

---

## 📦 Installation

```bash
npm install react-railway
# or
yarn add react-railway
```

---

## ⚡ Quick Start

Import the component and manage the running state:

```jsx
import { useState } from "react";
import { Railway, clickElement } from "react-railway";
import { Typography } from "@mui/material";

const App = () => {
  const [isRailwayRunning, setIsRailwayRunning] = useState(false);

  return (
    <Railway
      id="my-custom-trip"
      stations={STATIONS}
      config={{
        trigger: {
          element: triggerEl, // your trigger element reference
          isRailwayRunning,
          onClose: () => setIsRailwayRunning(false),
        },
        labels: {
          previous: "Vorige",
          stationDelimiter: "van",
        },
      }}
    />
  );
};
```

---

### 🗺️ Defining Stations

Stations define each step in your guided tour:

Each station can have:
• title & description – text or JSX
• beforeArrival – runs before showing the station
• afterDeparture – runs after leaving the station

```jsx
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
      clickElement(".my-test-button", { scrollIntoView: true }),
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
```

---

### 🖱️ Clicking Elements Automatically

clickElement is a built-in utility for interacting with the DOM during your tour:

```js
clickElement(".selector", {
  scrollIntoView: true, // Scroll into view before clicking
  waitMsAfterClick: 200, // Optional wait time after clicking (ms)
});
```

---

### 📚 Props Overview

| Prop       | Type            | Description                                 |
| ---------- | --------------- | ------------------------------------------- |
| `id`       | `string`        | Unique identifier for this Railway instance |
| `stations` | `Station[]`     | Array of stations defining your tour steps  |
| `config`   | `RailwayConfig` | Configuration for triggers, labels, etc.    |

---

### 📝 License

MIT © Twana Gul | Wowpixels
