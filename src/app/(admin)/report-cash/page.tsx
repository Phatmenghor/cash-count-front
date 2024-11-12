"use client";
import React, { useState } from "react";
import axios from "axios";

const ReportDownload: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const downloadReport = async () => {
    setLoading(true);
    try {
      // Send GET request to the backend to generate the Excel report
      const response = await axios.get(
        "http://localhost:8080/report/generate-excel",
        {
          responseType: "arraybuffer", // Important for receiving binary data
        }
      );

      // Convert the binary data into a Blob
      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel MIME type
      });

      // Create a temporary download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file); // Create an Object URL for the Blob
      link.download = "CashCountReport.xlsx"; // Set the filename for the download
      link.click(); // Trigger the file download

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={downloadReport} disabled={loading}>
        {loading ? "Downloading..." : "Download Excel Report"}
      </button>
    </div>
  );
};

export default ReportDownload;
