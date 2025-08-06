import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import DocumentRow from "@/components/molecules/DocumentRow";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { getDocuments, getDocumentsByTrifectaComponent } from "@/services/api/documentService";

const DocumentsTable = ({ trifectaComponent = null, filters = {}, onPreview }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table"); // table or grid
  const [sortConfig, setSortConfig] = useState({
    key: "uploadDate",
    direction: "desc"
  });

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = trifectaComponent 
        ? await getDocumentsByTrifectaComponent(trifectaComponent)
        : await getDocuments();
      setDocuments(data);
    } catch (err) {
      setError("Failed to load documents. Please try again.");
      console.error("Error loading documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [trifectaComponent]);

  const handleDownload = async (document) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Downloaded ${document.name}`);
      // In a real application, you would handle the actual file download here
      console.log("Downloading:", document.name);
    } catch (error) {
      toast.error("Failed to download document");
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedDocuments = (docs) => {
    return [...docs].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.key === "uploadDate") {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
      }
      
      if (sortConfig.key === "fileSize") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (sortConfig.direction === "asc") {
        return aStr.localeCompare(bStr);
      }
      return bStr.localeCompare(aStr);
    });
  };

  const getFilteredDocuments = () => {
    let filtered = documents.filter(doc =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply additional filters
    if (filters.category) {
      filtered = filtered.filter(doc => doc.category === filters.category);
    }
    
    if (filters.type) {
      filtered = filtered.filter(doc => doc.type === filters.type);
    }
    
    if (filters.dateFrom) {
      filtered = filtered.filter(doc => 
        new Date(doc.uploadDate) >= new Date(filters.dateFrom)
      );
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(doc => 
        new Date(doc.uploadDate) <= new Date(filters.dateTo + "T23:59:59")
      );
    }

    return getSortedDocuments(filtered);
  };

  const filteredDocuments = getFilteredDocuments();

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return 'FileText';
      case 'xlsx': return 'FileSpreadsheet';
      case 'docx': return 'FileType';
      default: return 'File';
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDocuments} />;
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDocuments} />;

return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="FileText" size={16} />
            <span>
              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
          </div>
          
          <div className="flex items-center border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded ${viewMode === "table" ? "bg-navy-100 text-navy-700" : "text-gray-400 hover:text-gray-600"}`}
            >
              <ApperIcon name="List" size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-navy-100 text-navy-700" : "text-gray-400 hover:text-gray-600"}`}
            >
              <ApperIcon name="Grid3X3" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Documents Display */}
      {filteredDocuments.length === 0 ? (
        <Card className="p-12">
          <Empty
            title="No documents found"
            description={
              searchTerm || Object.values(filters).some(f => f)
                ? "No documents match your current filters"
                : "Your documents will appear here once they are uploaded"
            }
            icon="FileX"
            actionText={searchTerm || Object.values(filters).some(f => f) ? "Clear filters" : undefined}
            onAction={searchTerm || Object.values(filters).some(f => f) ? () => setSearchTerm("") : undefined}
          />
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map((document) => (
            <Card key={document.Id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-navy-50 rounded-lg">
                    <ApperIcon name={getFileIcon(document.type)} size={24} className="text-navy-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {document.trifectaComponent}
                  </Badge>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {document.name}
                  </h3>
                  <div className="space-y-1 text-xs text-gray-500">
                    <p>{document.category}</p>
                    <p>{new Date(document.uploadDate).toLocaleDateString()}</p>
                    <p>{formatFileSize(document.fileSize)}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => onPreview && onPreview(document)}
                  >
                    <ApperIcon name="Eye" size={14} />
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(document)}
                  >
                    <ApperIcon name="Download" size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-gray-900"
                    >
                      Document
                      <ApperIcon 
                        name={sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "ChevronUp" : "ChevronDown") : "ChevronsUpDown"} 
                        size={14} 
                      />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("uploadDate")}
                      className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-gray-900"
                    >
                      Date
                      <ApperIcon 
                        name={sortConfig.key === "uploadDate" ? (sortConfig.direction === "asc" ? "ChevronUp" : "ChevronDown") : "ChevronsUpDown"} 
                        size={14} 
                      />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("fileSize")}
                      className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-gray-900"
                    >
                      Size
                      <ApperIcon 
                        name={sortConfig.key === "fileSize" ? (sortConfig.direction === "asc" ? "ChevronUp" : "ChevronDown") : "ChevronsUpDown"} 
                        size={14} 
                      />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredDocuments.map((document) => (
                  <tr key={document.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-navy-50 rounded">
                          <ApperIcon name={getFileIcon(document.type)} size={16} className="text-navy-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{document.name}</p>
                          <p className="text-sm text-gray-500">{document.type.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-900">{document.category}</span>
                        <Badge variant="secondary" className="w-fit text-xs">
                          {document.trifectaComponent}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(document.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatFileSize(document.fileSize)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onPreview && onPreview(document)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ApperIcon name="Eye" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownload(document)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ApperIcon name="Download" size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DocumentsTable;