import { useEffect } from "react";
import * as smplr from "@smplrspace/smplr-loader";

const useSmplrJs = ({ onLoad }) => {
  useEffect(() => {
    if (onLoad) {
      onLoad(smplr);
    }
  }, [onLoad]);
};

export default useSmplrJs;
