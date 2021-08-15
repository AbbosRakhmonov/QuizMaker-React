import { useEffect, useState } from "react";
import "./style.css";
import svgLogo from "./puff.svg";
function Loader({ opacity }) {
  const [style, setStlye] = useState({
    opacity: opacity,
  });
  useEffect(() => {
    if (opacity === 0) {
      setStlye({
        opacity: opacity,
      });
      setTimeout(() => {
        setStlye({
          ...style,
          display: "none",
        });
      }, 200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opacity]);
  return (
    <div className="loader" style={style}>
      <img src={svgLogo} className="loader-svg" alt="loader" />
    </div>
  );
}

export default Loader;
