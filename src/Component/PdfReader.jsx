import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

const PdfReader = ({ pdfFile }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, numPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div>
      <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        <Page key={`page_${currentPage}`} pageNumber={currentPage} />
      </Document>
      <div>
        <button onClick={prevPage} disabled={currentPage <= 1}>
          Previous Page
        </button>
        <span>
          Page {currentPage} of {numPages}
        </span>
        <button onClick={nextPage} disabled={currentPage >= numPages}>
          Next Page
        </button>
      </div>
    </div>
  );
};

export default PdfReader;
