import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

/*
  BarGraph Component
  -----------------
  Props:
    - height: the rocket height in meters
    - mass: the rocket mass in kg
  Purpose:
    - Visualize height and mass using a bar chart
    - Scale the values to make them readable (mass is usually much larger than height)
*/

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarGraph({ height, mass }) {
  // Scale the data so mass does not dwarf height visually
  const scaleFactor = Math.max(height, mass) / 100;
  const scaledHeight = height / scaleFactor;
  const scaledMass = mass / scaleFactor;

  // Chart.js data object
  const data = {
    labels: ["Height (m)", "Mass (kg)"], // x-axis labels
    datasets: [
      {
        label: "Rocket Stats (scaled)", // Name shown in chart tooltip
        data: [scaledHeight, scaledMass], // Values for each bar
        backgroundColor: ["#3498db", "#e74c3c"], // Colors for each bar
      },
    ],
  };

  // Chart.js options object
  const options = {
    responsive: true, // Chart resizes automatically
    plugins: {
      legend: { display: false }, // Hide legend (optional)
      title: { display: true, text: "Rocket Height & Mass", font: { size: 16 } }, // Chart title
    },
    scales: {
      y: { beginAtZero: true }, // Start y-axis at 0
    },
  };

  return <Bar data={data} options={options} />;
}

export default BarGraph;