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