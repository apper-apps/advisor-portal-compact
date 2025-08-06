import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const DocumentRow = ({ document, onDownload }) => {
  const [downloading, setDownloading] = useState(false);

  const getFileTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return { name: "FileText", color: "text-red-500" };
      case 'xlsx':
      case 'xls':
        return { name: "FileSpreadsheet", color: "text-green-600" };
      case 'docx':
      case 'doc':
        return { name: "FileText", color: "text-blue-600" };
      default:
        return { name: "File", color: "text-gray-500" };
    }
  };

  const getFileTypeVariant = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return "error";
      case 'xlsx':
      case 'xls':
        return "success";
      case 'docx':
      case 'doc':
        return "info";
      default:
        return "default";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await onDownload(document);
      toast.success(`${document.name} downloaded successfully`);
    } catch (error) {
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const fileIcon = getFileTypeIcon(document.type);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <ApperIcon 
              name={fileIcon.name} 
              className={`h-6 w-6 ${fileIcon.color}`} 
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-navy-900 truncate">
              {document.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {document.category}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <Badge variant={getFileTypeVariant(document.type)} size="sm">
          {document.type.toUpperCase()}
        </Badge>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {format(new Date(document.uploadDate), "MMM dd, yyyy")}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {formatFileSize(document.fileSize)}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            loading={downloading}
            className="text-xs"
          >
            <ApperIcon name="Download" className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default DocumentRow;