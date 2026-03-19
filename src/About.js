import React, { useState } from "react";
import RocketSelector from "./RocketSelector";
import BarGraph from "./BarGraph";
import ComparisonLineGraph from "./ComparisonLineGraph";

/*
  About Page
  ----------
  Purpose:
    - Show two RocketSelector components side by side
    - Display each rocket’s details: image, description, table, bar graph
    - Display a comparison line graph for both rockets
*/

function About() {
  // State for selected rockets
  const [rocket1, setRocket1] = useState(null);
  const [rocket2, setRocket2] = useState(null);

  // Function to render one rocket panel
  const renderRocketPanel = (rocket) => {
    if (!rocket) return <p>Select a rocket to see stats</p>;

    return (
      <>
        <h3>{rocket.name}</h3>

        {/* Rocket Image */}
        {rocket.flickr_images.length > 0 && (
          <img
            src={rocket.flickr_images[0]}
            alt={rocket.name}
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "15px",
            }}
          />
        )}

        {/* Rocket Description */}
        <p>{rocket.description}</p>

        {/* Rocket Specs Table */}
        <table style={{ width: "100%", marginBottom: "15px", borderCollapse: "collapse" }}>
          <tbody>
            <tr><td><strong>First Flight:</strong></td><td>{rocket.first_flight}</td></tr>
            <tr><td><strong>Height:</strong></td><td>{rocket.height.meters} m</td></tr>
            <tr><td><strong>Mass:</strong></td><td>{rocket.mass.kg} kg</td></tr>
            <tr><td><strong>Diameter:</strong></td><td>{rocket.diameter.meters} m</td></tr>
            <tr><td><strong>Stages:</strong></td><td>{rocket.stages}</td></tr>
            <tr><td><strong>Payload to LEO:</strong></td><td>{rocket.payload_weights?.[0]?.kg || "N/A"} kg</td></tr>
          </tbody>
        </table>

        {/* Individual Bar Graph */}
        <BarGraph height={rocket.height.meters} mass={rocket.mass.kg} />
      </>
    );
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Two panels side by side */}
      <div style={{ display: "flex" }}>
        {/* Left panel */}
        <div style={{ flex: 1, padding: "20px", borderRight: "1px solid #ddd" }}>
          <RocketSelector onSelectRocket={setRocket1} />
          {renderRocketPanel(rocket1)}
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, padding: "20px" }}>
          <RocketSelector onSelectRocket={setRocket2} />
          {renderRocketPanel(rocket2)}
        </div>
      </div>

      {/* Comparison Line Graph below panels */}
      <div style={{ padding: "20px", marginTop: "20px", borderTop: "1px solid #ddd" }}>
        <ComparisonLineGraph rocket1={rocket1} rocket2={rocket2} />
      </div>
    </div>
  );
}

export default About;