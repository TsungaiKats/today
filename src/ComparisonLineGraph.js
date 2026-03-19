import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

/*
  ComparisonLineGraph Component
  -----------------------------
  Props:
    - rocket1: first rocket object
    - rocket2: second rocket object
  Purpose:
    - Compare multiple stats (height, mass, diameter, payload) of two rockets
    - Display them on one line chart
*/

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ComparisonLineGraph({ rocket1, rocket2 }) {
  // If no rockets selected, show a message
  if (!rocket1 && !rocket2) return <p>Select at least one rocket to compare</p>;

  // Define the stats we want to compare
  const labels = ["Height (m)", "Mass (kg)", "Diameter (m)", "Payload to LEO (kg)"];

  // Prepare data for Rocket 1
  const rocket1Data = rocket1
    ? [
        rocket1.height.meters,
        rocket1.mass.kg,
        rocket1.diameter.meters,
        rocket1.payload_weights?.[0]?.kg || 0, // Use 0 if payload is missing
      ]
    : [0, 0, 0, 0];

  // Prepare data for Rocket 2
  const rocket2Data = rocket2
    ? [
        rocket2.height.meters,
        rocket2.mass.kg,
        rocket2.diameter.meters,
        rocket2.payload_weights?.[0]?.kg || 0,
      ]
    : [0, 0, 0, 0];

  // Chart.js data object
  const data = {
    labels,
    datasets: [
      {
        label: rocket1 ? rocket1.name : "Rocket 1",
        data: rocket1Data,
        borderColor: "#3498db",
        backgroundColor: "#3498db",
        tension: 0.3, // Curved lines
      },
      {
        label: rocket2 ? rocket2.name : "Rocket 2",
        data: rocket2Data,
        borderColor: "#e74c3c",
        backgroundColor: "#e74c3c",
        tension: 0.3,
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Rocket Stats Comparison", font: { size: 18 } },
      tooltip: { mode: "index", intersect: false },
      legend: { position: "top" },
    },
    scales: { y: { beginAtZero: true } },
  };

  return <Line data={data} options={options} />;
}

export default ComparisonLineGraph;