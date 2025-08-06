import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import DocumentRow from "@/components/molecules/DocumentRow";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { getDocuments } from "@/services/api/documentService";

const DocumentsTable = ({ category = null }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDocuments();
      const filteredData = category 
        ? data.filter(doc => doc.category === category)
        : data;
      setDocuments(filteredData);
    } catch (err) {
      setError("Failed to load documents. Please try again.");
      console.error("Error loading documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDownload = async (document) => {
    // Simulate download process with delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real application, you would handle the actual file download here
    console.log("Downloading:", document.name);
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDocuments} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Document Library</h2>
          <p className="text-gray-600 mt-1">Access and download your important documents</p>
        </div>
        <div className="w-full sm:w-80">
          <SearchBar
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
          />
        </div>
      </div>

      {/* Documents Count */}
      {documents.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="FileText" className="h-4 w-4" />
          <span>
            {filteredDocuments.length} of {documents.length} documents
            {searchTerm && ` matching "${searchTerm}"`}
          </span>
        </div>
      )}

      {/* Documents Table */}
      <Card className="overflow-hidden">
        {filteredDocuments.length === 0 ? (
          searchTerm ? (
            <div className="p-12">
              <Empty
                title="No documents found"
                description={`No documents match your search for "${searchTerm}"`}
                actionText="Clear search"
                onAction={() => setSearchTerm("")}
              />
            </div>
          ) : (
            <div className="p-12">
              <Empty
                title="No documents available"
                description="Your documents will appear here once they are uploaded by your advisor"
                icon="FileX"
              />
            </div>
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredDocuments.map((document) => (
                  <DocumentRow
                    key={document.Id}
                    document={document}
                    onDownload={handleDownload}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DocumentsTable;