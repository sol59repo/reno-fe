import React from "react";
import "./PdfControls.css";
const FIT_LABELS = {
  page: "",
  width: "",
};
const noop = () => {};
const nextFit = (fitTo) => (fitTo === "page" ? "width" : "page");
const PdfControls = ({ fitTo, onZoomToFit = noop, onZoomIn, onZoomOut }) => (
  <div className="pdf-controls">
    <div className="pdf-controls-container">
      <button
        className="zoom-to-fit"
        onClick={() => onZoomToFit(nextFit(fitTo))}
        title={FIT_LABELS[nextFit(fitTo)]}
      >
        <span aria-hidden>&#9713;</span>
        <span className="sr-only">{FIT_LABELS[nextFit(fitTo)]}</span>
      </button>
      <button className="zoom-in" onClick={onZoomIn} title="Zoom In">
        <span aria-hidden>+</span>
        <span className="sr-only"></span>
      </button>
      <button className="zoom-out" onClick={onZoomOut} title="Zoom Out">
        <span aria-hidden>-</span>
        <span className="sr-only"></span>
      </button>
    </div>
  </div>
);

export default PdfControls;
