import documentsData from "@/services/mockData/documents.json";

let documents = [...documentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getDocuments = async () => {
  await delay(300);
  return [...documents];
};

export const getDocumentById = async (id) => {
  await delay(200);
  const document = documents.find(doc => doc.Id === parseInt(id));
  if (!document) {
    throw new Error("Document not found");
  }
  return { ...document };
};

export const createDocument = async (documentData) => {
  await delay(500);
  const newDocument = {
    Id: Math.max(...documents.map(d => d.Id)) + 1,
    ...documentData,
    uploadDate: new Date().toISOString()
  };
  documents.push(newDocument);
  return { ...newDocument };
};

export const updateDocument = async (id, updates) => {
  await delay(400);
  const index = documents.findIndex(doc => doc.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Document not found");
  }
  documents[index] = { ...documents[index], ...updates };
  return { ...documents[index] };
};

export const deleteDocument = async (id) => {
  await delay(300);
  const index = documents.findIndex(doc => doc.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Document not found");
  }
  const deletedDocument = documents.splice(index, 1)[0];
  return { ...deletedDocument };
};

// Enhanced filtering functions for Trifecta categorization
export const getDocumentsByTrifectaComponent = async (component) => {
  await delay(300);
  const allDocuments = [...documents];
  return allDocuments.filter(doc => doc.trifectaComponent === component);
};

export const getDocumentsByCategory = async (category) => {
  await delay(200);
  const allDocuments = [...documents];
  return allDocuments.filter(doc => doc.category === category);
};

export const getDocumentsByType = async (type) => {
  await delay(200);
  const allDocuments = [...documents];
  return allDocuments.filter(doc => doc.type === type);
};

export const getDocumentsByDateRange = async (startDate, endDate) => {
  await delay(300);
  const allDocuments = [...documents];
  return allDocuments.filter(doc => {
    const docDate = new Date(doc.uploadDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return docDate >= start && docDate <= end;
  });
};