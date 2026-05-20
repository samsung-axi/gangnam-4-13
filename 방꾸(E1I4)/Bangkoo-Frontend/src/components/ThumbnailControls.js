import React, { useState, forwardRef, useImperativeHandle } from "react";

const ThumbnailControls = forwardRef((props, ref) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useImperativeHandle(ref, () => ({
    getScale: () => scale,
    getRotation: () => rotation,
    setScale,
    setRotation,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <label>
        크기 조절 (x{scale.toFixed(2)})
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.01"
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
        />
      </label>

      <label>
        회전 각도 ({rotation}°)
        <input
          type="range"
          min="-180"
          max="180"
          step="1"
          value={rotation}
          onChange={(e) => setRotation(parseInt(e.target.value))}
        />
      </label>
    </div>
  );
});

export default ThumbnailControls;
