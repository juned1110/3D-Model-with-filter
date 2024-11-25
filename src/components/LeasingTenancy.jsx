import React, { useState, useCallback, useEffect } from "react";
import numeral from "numeral";
import Viewer from "./Viewer";
import { units } from "./_data";
import { waterLine } from "./waterLine_Data"; // Assuming you import the dataset here

const colorScale = (unit, selectedUnit, hasClicked) => {
  if (hasClicked && selectedUnit) {
    return unit.id === selectedUnit.id ? "#026BFA" : "transparent";
  }
  if (unit.status === "available") return "#3aa655"; // Green
  if (unit.status === "sold") return "#E60023"; // Red
  return "#c3ae0e"; // Default color
};

const LeasingTenancy = () => {
  const [space, setSpace] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [hasClicked, setHasClicked] = useState(false);
  const [filter, setFilter] = useState("all");
  const [isWaterlineVisible, setIsWaterlineVisible] = useState(false); // State for waterline visibility

  const onReady = useCallback((space) => setSpace(space), []);

  const applyLayer = () => {
    if (!space) return;

    // Remove all layers
    space.removeDataLayer("units");
    space.removeDataLayer("waterline");

    // Apply Units Layer if waterline is not visible
    if (!isWaterlineVisible) {
      const filteredUnits =
        filter === "all"
          ? units[0].assets
          : units[0].assets.filter((unit) => unit.status === filter);

      space.addDataLayer({
        id: "units",
        type: "polygon",
        data: filteredUnits,
        tooltip: (d) => `${d.name} - $${numeral(d.rental).format("0,0")}/mo`,
        color: (d) => colorScale(d, selectedUnit, hasClicked),
        alpha: 0.7,
        height: 2.9,
        onClick: (event) => {
          setSelectedUnit(event);
          setHasClicked(true);
          if (space && event.geometry) {
            space.setCameraPlacement({
              position: {
                x: event.geometry.x + 5,
                y: 10,
                z: event.geometry.z + 5,
              },
              target: {
                x: event.geometry.x,
                y: 0,
                z: event.geometry.z,
              },
            });
          }
        },
      });
    }

    // Apply WaterLine Layer if it's visible
    if (isWaterlineVisible) {
      const waterLineAssets = waterLine.find(
        (layer) => layer.name === "WaterLine"
      ).assets;
      space.addDataLayer({
        id: "waterline",
        type: "polyline",
        data: waterLineAssets,
        color: "#026BFA", // Blue for waterline
        alpha: 0.8,
        width: 0.1, // Adjust width for better visibility
      });
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedUnit(null);
    setHasClicked(false);
  };

  const handleRoomFocus = (roomId) => {
    const room = units[0].assets.find((unit) => unit.id === roomId);
    if (room && room.coordinates && space) {
      space.setCameraPlacement({
        position: {
          x: room.coordinates[0][0].x + 25,
          y: 50,
          z: room.coordinates[0][0].z + 25,
        },
        target: {
          x: room.coordinates[0][0].x,
          y: 0,
          z: room.coordinates[0][0].z,
        },
      });
      setSelectedUnit(room);
    }
  };

  const toggleWaterline = () => {
    setIsWaterlineVisible(!isWaterlineVisible); // Toggle the waterline visibility
  };

  useEffect(() => {
    if (!space) return;

    // Apply the layers whenever state changes
    applyLayer();

    // Clean up when the component unmounts or space changes
    return () => {
      if (space) {
        space.removeDataLayer("units");
        space.removeDataLayer("waterline");
      }
    };
  }, [space, filter, selectedUnit, hasClicked, isWaterlineVisible]);

  return (
    <div className="viewer-container relative">
      <div className="flex flex-col md:flex-row px-4">
        <div className="flex-1 w-full relative">
          <Viewer mode="3d" onReady={onReady} />
        </div>

        <div className="unit-details flex-1 w-full bg-white shadow-md rounded-md p-4">
          <h2 className="text-xl font-bold mb-4">Unit Details</h2>

          {/* Filter Buttons */}
          <div className="filter-buttons flex justify-center mb-4">
            {["all", "available", "sold"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 mr-2 rounded-md font-semibold ${
                  filter === status
                    ? "bg-blue-500 text-white" // Apply blue background and white text when active
                    : "bg-gray-200 text-black" // Default state for inactive buttons
                }`}
                onClick={() => handleFilterChange(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Waterline Toggle Button */}
          <div className="waterline-toggle mb-4">
            <button
              className={`px-4 py-2 rounded-md font-semibold ${
                isWaterlineVisible
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={toggleWaterline}
            >
              {isWaterlineVisible ? "Hide Waterline" : "Show Waterline"}
            </button>
          </div>

          {/* Room Buttons */}
          <div className="room-buttons flex flex-wrap gap-2 mb-4">
            {units[0].assets.map((unit) => (
              <button
                key={unit.id}
                className={`px-4 py-2 rounded-md font-semibold ${
                  selectedUnit?.id === unit.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handleRoomFocus(unit.id)}
              >
                {unit.name}
              </button>
            ))}
          </div>

          {/* Display Selected Unit Details */}
          {selectedUnit ? (
            <div>
              <p>
                <strong>Name:</strong> {selectedUnit.name}
              </p>
              <p>
                <strong>Rental:</strong> ${" "}
                {numeral(selectedUnit.rental).format("0,0")}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    selectedUnit.status === "available"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {selectedUnit.status}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-500">
              Select a unit or filter to view details.
            </p>
          )}

          {/* Display Filtered Data */}
          <div className="filtered-units mt-4">
            <h3 className="text-lg font-semibold mb-2">Filtered Units</h3>
            <ul>
              {units[0].assets
                .filter((unit) =>
                  filter === "all" ? true : unit.status === filter
                )
                .map((unit) => (
                  <li
                    key={unit.id}
                    className="p-2 mb-2 border rounded shadow-sm flex justify-between"
                  >
                    <span>
                      <strong>{unit.name}</strong> - $
                      {numeral(unit.rental).format("0,0")}
                    </span>
                    <span
                      className={`${
                        unit.status === "available"
                          ? "text-green-500"
                          : "text-red-500"
                      } font-bold`}
                    >
                      {unit.status}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeasingTenancy;
