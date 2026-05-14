import React from "react";
import { Download } from "lucide-react";

const DownloadButton = ({ document, fileName }) => {
  return (
    <a
      href={document}
      download={fileName}
      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-sm text-[14px] font-medium hover:bg-brand-700 transition-colors"
    >
      <Download className="w-4 h-4" aria-hidden="true" />
      Download
    </a>
  );
};

export default DownloadButton;
