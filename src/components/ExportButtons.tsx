import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, FileText, Image } from "lucide-react";
import { buildCVDoc } from "../utils/docxBuilder";
import { CVData } from "../types/cv.types";

interface ExportButtonsProps {
  cvRef: React.RefObject<HTMLDivElement>;
  cvData: CVData;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ cvRef, cvData }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "png" | "docx" | null>(
    null,
  );

  const exportToPDF = async () => {
    if (!cvRef.current) return;

    setIsExporting(true);
    setExportType("pdf");

    try {
      const canvas = await html2canvas(cvRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("cv-moderne.pdf");
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      alert("Une erreur est survenue lors de l'export PDF");
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const exportToPNG = async () => {
    if (!cvRef.current) return;

    setIsExporting(true);
    setExportType("png");

    try {
      const canvas = await html2canvas(cvRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const link = document.createElement("a");
      link.download = "cv-moderne.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Erreur lors de l'export PNG:", error);
      alert("Une erreur est survenue lors de l'export PNG");
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const exportToDOCX = async () => {
    if (!cvData) return;

    setIsExporting(true);
    setExportType("docx");

    try {
      const blobDoc = await buildCVDoc(cvData);
      const url = URL.createObjectURL(blobDoc);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cv-moderne.docx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de l'export DOCX:", error);
      alert("Une erreur est survenue lors de l'export DOCX");
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={exportToPDF}
        disabled={isExporting}
        className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm font-medium"
      >
        {isExporting && exportType === "pdf" ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <FileText className="w-4 h-4 mr-2" />
        )}
        PDF
      </button>

      <button
        onClick={exportToPNG}
        disabled={isExporting}
        className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm font-medium"
      >
        {isExporting && exportType === "png" ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <Image className="w-4 h-4 mr-2" />
        )}
        PNG
      </button>

      <button
        onClick={exportToDOCX}
        disabled={isExporting}
        className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm font-medium"
      >
        {isExporting && exportType === "docx" ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        DOCX <span className="ml-1 text-[10px] lowercase opacity-90">beta</span>
      </button>
    </div>
  );
};

export default ExportButtons;
