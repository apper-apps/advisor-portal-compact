import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import DocumentsTable from "@/components/organisms/DocumentsTable";
import { getDocuments, getDocumentsByTrifectaComponent } from "@/services/api/documentService";

const Documents = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    dateFrom: "",
    dateTo: ""
  });

  const tabs = [
    { id: "All", label: "All Documents", icon: "FileText" },
    { id: "Foundation", label: "Foundation", icon: "Building" },
    { id: "Operations", label: "Operations", icon: "Settings" },
    { id: "Holdings", label: "Holdings", icon: "TrendingUp" }
  ];

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = activeTab === "All" 
        ? await getDocuments()
        : await getDocumentsByTrifectaComponent(activeTab);
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to load documents");
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [activeTab]);

  const getDocumentCount = (tabId) => {
    if (tabId === "All") return documents.length;
    return documents.filter(doc => doc.trifectaComponent === tabId).length;
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      type: "",
      dateFrom: "",
      dateTo: ""
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Document Library</h1>
          <p className="text-gray-600 mt-1">Access and manage your important documents by category</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Filter" size={16} />
            Filters
            {showFilters && <Badge variant="secondary" className="ml-1">On</Badge>}
          </Button>
        </div>
      </div>

      {/* Trifecta Tabs */}
      <Card className="p-1">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-navy-100 text-navy-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
              <Badge variant={activeTab === tab.id ? "default" : "secondary"} className="ml-1">
                {getDocumentCount(tab.id)}
              </Badge>
            </button>
          ))}
        </div>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                >
                  <option value="">All Categories</option>
                  <option value="Tax Planning">Tax Planning</option>
                  <option value="Business Records">Business Records</option>
                  <option value="Asset Protection">Asset Protection</option>
                  <option value="Legal Documents">Legal Documents</option>
                  <option value="Estate Planning">Estate Planning</option>
                  <option value="Investment Analysis">Investment Analysis</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                >
                  <option value="">All Types</option>
                  <option value="pdf">PDF</option>
                  <option value="xlsx">Excel</option>
                  <option value="docx">Word</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date From
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date To
                </label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Documents Table */}
      <DocumentsTable 
        trifectaComponent={activeTab === "All" ? null : activeTab}
        filters={filters}
        onPreview={setPreviewDocument}
      />

      {/* Document Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {previewDocument.name}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Calendar" size={14} />
                      {new Date(previewDocument.uploadDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <ApperIcon name="HardDrive" size={14} />
                      {(previewDocument.fileSize / 1024 / 1024).toFixed(1)} MB
                    </span>
                    <Badge variant="outline">{previewDocument.category}</Badge>
                    <Badge variant="secondary">{previewDocument.trifectaComponent}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewDocument(null)}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
            </div>
            
            <div className="p-6 text-center">
              <div className="bg-gray-50 rounded-lg p-12">
                <ApperIcon name="FileText" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Document preview not available</p>
                <p className="text-sm text-gray-500 mb-6">
                  Click download to view the full document
                </p>
                <Button onClick={() => toast.success(`Downloaded ${previewDocument.name}`)}>
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Download Document
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Documents;