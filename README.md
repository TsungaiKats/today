# 🚀 SpaceX Rocket Comparison Dashboard

A React application that fetches real-time rocket data from the [SpaceX API](https://github.com/r-spacex/SpaceX-API) and lets users visually compare rockets side by side using interactive charts.

![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-orange?logo=chartdotjs)
![License](https://img.shields.io/badge/License-Private-lightgrey)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture & Data Flow](#architecture--data-flow)
- [Component Breakdown](#component-breakdown)
  - [App.js](#appjs--entry-component)
  - [About.js](#aboutjs--main-page--layout-controller)
  - [RocketSelector.js](#rocketselectorjs--api-fetching--dropdown)
  - [BarGraph.js](#bargraphjs--individual-rocket-bar-chart)
  - [ComparisonLineGraph.js](#comparisonlinegraphjs--side-by-side-line-chart)
- [API Reference](#api-reference)
- [How the Logic Works Step by Step](#how-the-logic-works-step-by-step)
- [Available Scripts](#available-scripts)

---

## Overview

This dashboard allows users to select any two SpaceX rockets from dropdown menus and instantly see:

1. **Individual stats** — image, description, specifications table, and a bar chart for each rocket.
2. **Head-to-head comparison** — a line chart plotting height, mass, diameter, and payload capacity for both rockets on the same axes.

All data is fetched live from the public SpaceX REST API (`https://api.spacexdata.com/v4/rockets`).

---

## Features

| Feature | Description |
|---|---|
| **Live API Data** | Rockets are fetched from the SpaceX v4 API on component mount |
| **Dual Selector** | Two independent dropdown selectors for side-by-side comparison |
| **Rocket Details** | Image, description, and a specs table (height, mass, diameter, stages, payload, first flight) |
| **Bar Chart** | Per-rocket bar chart visualising height vs. mass with automatic scaling |
| **Comparison Line Chart** | Multi-metric line chart comparing two rockets across four dimensions |
| **Responsive Design** | Charts resize automatically; layout uses flexbox |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI library — component-based architecture, hooks (`useState`, `useEffect`) |
| **Chart.js 4** | Canvas-based charting library |
| **react-chartjs-2** | React wrapper components (`<Bar>`, `<Line>`) for Chart.js |
| **Create React App** | Project scaffolding, dev server, build tooling |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 16
- **npm** ≥ 8

### Installation

```bash
# Clone the repository
git clone https://github.com/TsungaiKats/today.git
cd today

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
today/
├── public/
│   ├── index.html          # HTML shell — mounts the React app into <div id="root">
│   ├── favicon.ico
│   ├── manifest.json
│   └── ...
├── src/
│   ├── index.js             # React entry point — renders <App /> into the DOM
│   ├── index.css            # Global styles (font family, margin reset)
│   ├── App.js               # Root component — renders <About />
│   ├── App.css              # App-level styles (centered text, header styles)
│   ├── About.js             # Main page — layout, state management, rocket panels
│   ├── RocketSelector.js    # Dropdown component — fetches rockets, emits selection
│   ├── BarGraph.js          # Bar chart component — height vs. mass for one rocket
│   ├── ComparisonLineGraph.js # Line chart component — multi-stat comparison of two rockets
│   ├── App.test.js          # Default CRA test
│   ├── setupTests.js        # Jest / Testing Library setup
│   ├── reportWebVitals.js   # Performance metrics (optional)
│   └── logo.svg             # React logo (unused in current UI)
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                        App.js                           │
│                    (root component)                      │
│                          │                              │
│                      <About />                          │
└──────────────────────────┬──────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │            About.js                  │
        │   state: rocket1, rocket2            │
        │                                      │
        │  ┌─────────────┐  ┌─────────────┐   │
        │  │  Left Panel │  │ Right Panel  │   │
        │  │             │  │              │   │
        │  │ Rocket      │  │ Rocket       │   │
        │  │ Selector    │  │ Selector     │   │
        │  │ (→setRocket1)  │ (→setRocket2)│   │
        │  │             │  │              │   │
        │  │ Image       │  │ Image        │   │
        │  │ Description │  │ Description  │   │
        │  │ Specs Table │  │ Specs Table  │   │
        │  │ BarGraph    │  │ BarGraph     │   │
        │  └─────────────┘  └─────────────┘   │
        │                                      │
        │  ┌──────────────────────────────┐    │
        │  │   ComparisonLineGraph        │    │
        │  │   (rocket1, rocket2)         │    │
        │  └──────────────────────────────┘    │
        └──────────────────────────────────────┘
```

**Data flows in one direction (top-down):**

1. `About.js` owns the state (`rocket1`, `rocket2`).
2. Each `RocketSelector` receives a **callback** (`setRocket1` / `setRocket2`) as a prop.
3. When the user picks a rocket, the selector calls the callback, updating state in `About.js`.
4. React re-renders the panels, passing the selected rocket objects down to `BarGraph` and `ComparisonLineGraph`.

---

## Component Breakdown

### `App.js` — Entry Component

```jsx
function App() {
  return (
    <div className="App">
      <About />
    </div>
  );
}
```

- The simplest component in the app.
- Wraps everything in a `<div className="App">` for global CSS (centered text).
- Renders the `<About />` component which contains all the application logic.

---

### `About.js` — Main Page / Layout Controller

**Role:** Central orchestrator — manages state and composes all child components.

**State:**

| State Variable | Type | Purpose |
|---|---|---|
| `rocket1` | `object \| null` | The rocket selected in the left panel |
| `rocket2` | `object \| null` | The rocket selected in the right panel |

**Key Logic:**

- **`renderRocketPanel(rocket)`** — A helper function that takes a rocket object and returns JSX containing:
  1. The rocket's name as a heading
  2. The first Flickr image (if available)
  3. The description paragraph
  4. A specifications table (first flight, height, mass, diameter, stages, payload to LEO)
  5. A `<BarGraph>` component for that rocket

- **Layout** — Uses CSS flexbox (`display: "flex"`) to place two panels side by side, separated by a vertical border. The `ComparisonLineGraph` sits below both panels, separated by a horizontal border.

- **Prop Drilling** — Passes `setRocket1` and `setRocket2` directly to each `RocketSelector` as the `onSelectRocket` prop. This is a clean pattern for simple apps where a state management library (like Redux) would be overkill.

---

### `RocketSelector.js` — API Fetching & Dropdown

**Role:** Fetches all rockets from the SpaceX API and presents a `<select>` dropdown.

**State:**

| State Variable | Type | Purpose |
|---|---|---|
| `rockets` | `array` | All rockets returned by the API |
| `selectedRocket` | `object \| null` | The currently selected rocket (for showing its description) |

**Step-by-step logic:**

1. **On mount** (`useEffect` with `[]` dependency array), the component sends a `GET` request to `https://api.spacexdata.com/v4/rockets`.
2. The JSON response (an array of rocket objects) is stored in `rockets` state.
3. The `<select>` element maps over `rockets` to create `<option>` elements, each keyed by `r.id` and displaying `r.name`.
4. When the user selects an option, `handleChange` fires:
   - Finds the matching rocket object by `id`.
   - Updates local `selectedRocket` state (to show the description below the dropdown).
   - Calls `onSelectRocket(rocket)` — the callback from `About.js` — to lift the selection up to the parent.

**Important:** Each `RocketSelector` instance makes its own independent API call. This means both dropdowns have their own copy of the rockets array, allowing independent selection.

---

### `BarGraph.js` — Individual Rocket Bar Chart

**Role:** Renders a bar chart comparing a single rocket's height (meters) and mass (kg).

**Props:**

| Prop | Type | Description |
|---|---|---|
| `height` | `number` | Rocket height in meters |
| `mass` | `number` | Rocket mass in kilograms |

**Scaling Logic:**

Since mass values (e.g., 549,054 kg for Falcon 9) are orders of magnitude larger than height values (e.g., 70 m), plotting them raw would make the height bar invisible. The component solves this with proportional scaling:

```js
const scaleFactor = Math.max(height, mass) / 100;
const scaledHeight = height / scaleFactor;
const scaledMass = mass / scaleFactor;
```

This normalises both values so the larger one equals 100 and the smaller one is proportionally sized. The chart title indicates the values are "scaled" so users understand the bars represent relative proportions, not absolute values.

**Chart.js Setup:**
- Registers required modules: `CategoryScale`, `LinearScale`, `BarElement`, `Title`, `Tooltip`, `Legend`.
- Uses `responsive: true` so the chart resizes with its container.
- Y-axis starts at zero (`beginAtZero: true`).
- Bars are coloured blue (`#3498db`) for height and red (`#e74c3c`) for mass.

---

### `ComparisonLineGraph.js` — Side-by-Side Line Chart

**Role:** Plots four metrics for two rockets on a single line chart for direct comparison.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `rocket1` | `object \| null` | First rocket to compare |
| `rocket2` | `object \| null` | Second rocket to compare |

**Metrics Compared:**

| Label | Data Source |
|---|---|
| Height (m) | `rocket.height.meters` |
| Mass (kg) | `rocket.mass.kg` |
| Diameter (m) | `rocket.diameter.meters` |
| Payload to LEO (kg) | `rocket.payload_weights[0].kg` (defaults to `0` if missing) |

**Logic:**

1. If neither rocket is selected, renders a prompt message.
2. For each rocket, extracts the four metrics into an array. Uses optional chaining (`?.`) and nullish fallback (`|| 0`) to handle rockets that may not have payload data.
3. Creates two datasets (one per rocket) with distinct colours:
   - Rocket 1: blue (`#3498db`)
   - Rocket 2: red (`#e74c3c`)
4. Both lines use `tension: 0.3` for smooth curves.
5. Tooltip mode is set to `"index"` with `intersect: false`, meaning hovering anywhere on a vertical slice shows values for both rockets — ideal for comparison.

---

## API Reference

The app uses the **SpaceX v4 REST API**:

| Endpoint | Method | Description |
|---|---|---|
| `https://api.spacexdata.com/v4/rockets` | `GET` | Returns an array of all SpaceX rocket objects |

**Example rocket object (simplified):**

```json
{
  "id": "5e9d0d95eda69973a809d1ec",
  "name": "Falcon 9",
  "description": "Falcon 9 is a two-stage rocket...",
  "first_flight": "2010-06-04",
  "height": { "meters": 70, "feet": 229.6 },
  "mass": { "kg": 549054, "lb": 1207920 },
  "diameter": { "meters": 3.7, "feet": 12 },
  "stages": 2,
  "payload_weights": [
    { "id": "leo", "name": "Low Earth Orbit", "kg": 22800, "lb": 50265 }
  ],
  "flickr_images": [
    "https://farm1.staticflickr.com/929/28787338307_3453a11a77_b.jpg"
  ]
}
```

---

## How the Logic Works Step by Step

1. **App boots** → `index.js` renders `<App />` into the `#root` div.
2. **App renders** → `<About />` is mounted with `rocket1 = null` and `rocket2 = null`.
3. **About renders** → Two `<RocketSelector>` components mount. Each one fires a `useEffect` that fetches all rockets from the SpaceX API.
4. **API responds** → Each selector populates its dropdown with rocket names.
5. **User picks Rocket 1** → `handleChange` in the left `RocketSelector` finds the rocket object, calls `setRocket1(rocket)` in `About.js`.
6. **React re-renders** → `About.js` now has `rocket1` set. The left panel calls `renderRocketPanel(rocket1)`, which displays the image, description, specs table, and a `<BarGraph>` for that rocket.
7. **User picks Rocket 2** → Same flow for the right panel, updating `rocket2`.
8. **Comparison chart updates** → `<ComparisonLineGraph>` receives both `rocket1` and `rocket2` as props. It extracts four metrics from each and plots two lines on the same chart.
9. **User changes selection** → Any dropdown change triggers a state update, React re-renders only the affected components, and all charts update automatically.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Runs the app in development mode at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Builds the app for production into the `build/` folder |
| `npm test` | Launches the test runner in interactive watch mode |
| `npm run eject` | Ejects from Create React App (one-way operation) |

---

## License

This project is private and not published under an open-source license.
