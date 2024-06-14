import React from "react";
import PdfReader from "./PdfReader";

const PdfViewerPage = () => {
  const pdfFile =
    "https://drive.google.com/file/d/1WC32ShzhU2QTxXn5brsWkdpFzKZikffn/view?usp=sharing"; // Update with your PDF file path

  return (
    <div>
      <h1>PDF Viewer</h1>
      <PdfReader pdfFile={pdfFile} />
    </div>
  );
};

export default PdfViewerPage;
