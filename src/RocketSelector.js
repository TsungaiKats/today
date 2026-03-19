import React, { useState, useEffect } from "react";

/*
  RocketSelector Component
  -----------------------
  Props:
    - onSelectRocket: a function passed from the parent component (About.js)
                      to update which rocket is selected in the parent.
  Purpose:
    - Fetch rocket data from the SpaceX API
    - Show a dropdown menu to select a rocket
    - Display the description of the selected rocket
*/

function RocketSelector({ onSelectRocket }) {
  // State to hold the list of rockets fetched from the API
  const [rockets, setRockets] = useState([]);

  // State to hold the currently selected rocket from the dropdown
  const [selectedRocket, setSelectedRocket] = useState(null);

  // useEffect runs code after the component renders
  // Empty dependency array [] means it runs only once when the component mounts
  useEffect(() => {
    // Fetch data from SpaceX API
    fetch("https://api.spacexdata.com/v4/rockets")
      .then(res => res.json()) // Convert the response to JSON
      .then(data => setRockets(data)); // Store rocket data in state
  }, []);

  // Function to handle when the user selects a rocket from the dropdown
  const handleChange = (e) => {
    // Find the selected rocket object based on the id
    const rocket = rockets.find(r => r.id === e.target.value);

    // Update the selectedRocket state to display its description
    setSelectedRocket(rocket);

    // Call the parent function to notify About.js about the selected rocket
    if (onSelectRocket) onSelectRocket(rocket);
  };

  return (
    <div>
      <h2>Select a Rocket</h2>

      {/* Dropdown menu */}
      <select
        onChange={handleChange} // When user selects, handleChange runs
        style={{
          width: "100%",        // Full width dropdown
          padding: "10px",      // Spacing inside the dropdown
          fontSize: "16px"      // Bigger text for readability
        }}
      >
        {/* Default option */}
        <option value="">Choose a rocket</option>

        {/* Map through rockets array and create an option for each rocket */}
        {rockets.map(r => (
          <option key={r.id} value={r.id}>
            {r.name} {/* Display rocket name */}
          </option>
        ))}
      </select>

      {/* Show the description of the selected rocket */}
      {selectedRocket && (
        <p style={{ marginTop: "10px" }}>{selectedRocket.description}</p>
      )}
    </div>
  );
}

export default RocketSelector;