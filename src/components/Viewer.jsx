import React, { memo, useEffect } from "react";
import PropTypes from "prop-types";
import { loadSmplrJs } from "@smplrspace/smplr-loader";

const Viewer = memo(({ mode, onReady }) => {
  useEffect(() => {
    loadSmplrJs()
      .then((smplr) => {
        const space = new smplr.Space({
          spaceId: "4e19f662-df3f-47ef-b79f-298d8fde4a3f",
          clientToken: "pub_a002e19d6fc14c83b8a288223baa8c9d",
          containerId: "smplr-container",
        });

        space.startViewer({
          preview: true,
          mode: "3d",
          allowModeChange: false,
          onReady: () => onReady(space),
          onError: (error) => console.error("Could not start viewer", error),
        });
      })
      .catch((error) => console.error("Failed to load smplr.js", error));
  }, [mode, onReady]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start", // Align content to the left
        alignItems: "center", // Center vertically
        padding: "20px",
        width: "100%",
        height: "100vh", // Full screen height
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        id="smplr-container"
        style={{
          width: "100%", // Full width for responsiveness
          maxWidth: "600px", // Maximum width for the model container
          height: "80vh", // 80% of viewport height
          minWidth: "300px", // Minimum width
          minHeight: "400px", // Minimum height
          // backgroundColor: "green",
          padding: "10px",
        }}
      />
    </div>
  );
});

Viewer.propTypes = {
  mode: PropTypes.string.isRequired,
  onReady: PropTypes.func.isRequired,
};

export default Viewer;
