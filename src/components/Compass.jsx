import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Compass = ({ space }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!space || typeof space.getCamera !== "function") return;

    const updateCompass = () => {
      const camera = space.getCamera();
      if (camera?.direction) {
        const angle =
          Math.atan2(camera.direction.z, camera.direction.x) * (180 / Math.PI);
        setRotation(-angle);
      }
    };

    const interval = setInterval(updateCompass, 100); 

    return () => clearInterval(interval);
  }, [space]);

  return (
    <div className="absolute top-4 right-4 w-24 h-24 rounded-full border-4 border-gray-800 bg-white flex items-center justify-center">
      <div
        className="w-1 h-12 bg-red-600 rounded origin-bottom"
        style={{ transform: `rotate(${rotation}deg)` }}
      ></div>
      <div className="absolute w-full h-full text-xs font-bold text-gray-700">
        <span className="absolute top-1 left-1/2 transform -translate-x-1/2">
          N
        </span>
        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          S
        </span>
        <span className="absolute left-1 top-1/2 transform -translate-y-1/2">
          W
        </span>
        <span className="absolute right-1 top-1/2 transform -translate-y-1/2">
          E
        </span>
      </div>
    </div>
  );
};

Compass.propTypes = {
  space: PropTypes.object.isRequired,
};

export default Compass;
