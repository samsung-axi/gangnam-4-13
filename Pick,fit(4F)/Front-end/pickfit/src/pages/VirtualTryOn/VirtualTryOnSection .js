import React, { useState } from "react";
import { Camera, Upload } from "lucide-react";

const VirtualTryOnSection = ({ virtualTryOn, setVirtualTryOn }) => {
  return (
    <section className="virtual-tryon-section">
      {virtualTryOn ? (
        <div className="virtual-tryon-content">Virtual Try-On Content</div>
      ) : (
        <div className="virtual-tryon-placeholder">
          <Camera size={64} />
          <h2>Start Your Virtual Fitting</h2>
          <div className="button-group">
            <div
              className="take-photo-btn"
              onClick={() => setVirtualTryOn(true)}
            >
              <Camera /> Take Photo
            </div>
            <div className="upload-image-btn">
              <Upload /> Upload Image
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VirtualTryOnSection;
