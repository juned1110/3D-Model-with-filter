import React, { useState, useCallback, useEffect } from "react";
import numeral from "numeral";
import Viewer from "./Viewer";
import { units } from "./_data";

const colorScale = (unit, selectedUnit, hasClicked) => {
  // If a unit has been clicked, set all other units to transparent
  if (hasClicked && selectedUnit) {
    return unit.id === selectedUnit.id ? "#026BFA" : "transparent";
  }

  // Default color logic for initial rendering
  if (unit.status === "available") return "#3aa655"; // Green for available
  if (unit.status === "sold") return "#E60023"; // Red for sold
  return "#c3ae0e"; // Default color
};

const LeasingTenancy = () => {
  const [space, setSpace] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null); // Track selected unit
  const [hasClicked, setHasClicked] = useState(false); // Track if a unit has been clicked
  const [filter, setFilter] = useState("all"); // Filter for units: 'all', 'available', 'sold'

  const onReady = useCallback((space) => setSpace(space), []);

  const applyLayer = () => {
    if (!space) return;

    // Filter units based on the selected filter
    const filteredUnits =
      filter === "all"
        ? units[0].assets
        : units[0].assets.filter((unit) => unit.status === filter);

    space.addDataLayer({
      id: "units",
      type: "polygon",
      data: filteredUnits,
      tooltip: (d) => `${d.name} - $${numeral(d.rental).format("0,0")}/mo`,
      color: (d) => colorScale(d, selectedUnit, hasClicked), // Use colorScale for dynamic coloring
      alpha: 0.7,
      height: 2.9,
      onClick: (event) => {
        console.log("Clicked unit:", event);
        setSelectedUnit(event); // Set the clicked unit as the selected unit
        setHasClicked(true); // Mark that a unit has been clicked

        // Center the clicked unit
        if (space && event.geometry) {
          space.focusView(event.geometry); // Assuming `focusView` focuses the view on the geometry
        }
      },
    });
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter); // Update the filter
    setSelectedUnit(null); // Clear the selected unit
    setHasClicked(false); // Reset clicked state
  };

  useEffect(() => {
    if (!space) return;

    // Apply the layer with all units initially
    applyLayer();

    return () => {
      space.removeDataLayer("units");
    };
  }, [space, filter, selectedUnit, hasClicked]); // Update whenever space, filter, selected unit, or click state changes

  return (
    <div className="viewer-container">
      <div className="flex flex-col md:flex-row px-4 ">
        {/* Viewer Component */}
        <div className="flex-1 w-full ">
          <Viewer mode="2d" onReady={onReady} />
        </div>

        {/* Unit Details Section */}
        <div className="unit-details flex-1 w-full bg-white shadow-md rounded-md p-4 -mt-20 md:mt-16">
          <h2 className="text-xl font-bold mb-4 ml-28 md:ml-5">Unit Details</h2>

          {/* Filter Buttons */}
          <div className="filter-buttons flex justify-center mb-4">
            <button
              className={`px-4 py-2 mr-2 rounded-md font-semibold ${
                filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => handleFilterChange("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 mr-2 rounded-md font-semibold ${
                filter === "available"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleFilterChange("available")}
            >
              Available
            </button>
            <button
              className={`px-4 py-2 rounded-md font-semibold ${
                filter === "sold" ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => handleFilterChange("sold")}
            >
              Sold
            </button>
          </div>

          {selectedUnit ? (
            // Show details of the selected unit
            <div className="selected-unit ml-28 md:ml-5">
              <p className="mb-2 font-semibold">
                <strong>Name:</strong> {selectedUnit.name}
              </p>
              <p className="mb-2 font-semibold">
                <strong>Rental:</strong> $
                {numeral(selectedUnit.rental).format("0,0")}
              </p>
              <p className="mb-2 font-semibold">
                <strong>Rent Status:</strong> {selectedUnit.rentStatus}
              </p>
              <p className="mb-2 font-semibold">
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    selectedUnit.status === "available"
                      ? "text-[#74ca37] font-bold"
                      : "text-[#E60023] font-bold"
                  }`}
                >
                  {selectedUnit.status}
                </span>
              </p>
            </div>
          ) : (
            // Show filtered units (available, sold, or all)
            <ul className="list-disc ml-20 md:ml-6 ">
              {units[0].assets
                .filter((unit) =>
                  filter === "all" ? true : unit.status === filter
                )
                .map((unit) => (
                  <li key={unit.id} className="mb-2 font-semibold">
                    <strong>{unit.name}</strong>: ${" "}
                    {numeral(unit.rental).format("0,0")} -{" "}
                    <span
                      className={`${
                        unit.status === "available"
                          ? "text-[#74ca37] font-bold"
                          : "text-[#E60023] font-bold"
                      }`}
                    >
                      {unit.status}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeasingTenancy;
