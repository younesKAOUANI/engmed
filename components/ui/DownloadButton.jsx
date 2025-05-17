import React, { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";

const DownloadButton = ({ document, fileName }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handlePreviewToggle = () => setShowPreview((prev) => !prev);

  return (
    <div>
      {/* Button to trigger preview */}
      <button
        onClick={handlePreviewToggle}
        className="hover:scale-95 transition-all duration-300 text-white text-lg"
        style={{
          padding: "10px 20px",
          textDecoration: "none",
          backgroundColor: "#449AFF",
          borderRadius: "5px",
          fontWeight: "750",
        }}
      >
                  <PDFDownloadLink document={document} fileName={fileName}>
            {({ loading }) => (loading ? "جاري التحميل" : "إعلان تأسيس")}
          </PDFDownloadLink>
      </button>
    </div>
  );
};

export default DownloadButton;

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4 overflow-auto">
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="bg-red-500 text-white p-2 rounded"
          >
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};
