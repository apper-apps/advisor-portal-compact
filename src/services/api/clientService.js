import clientsData from "@/services/mockData/clients.json";

let clients = [...clientsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getClients = async () => {
  await delay(300);
  return [...clients];
};

export const getClientById = async (id) => {
  await delay(200);
  const client = clients.find(c => c.Id === parseInt(id));
  if (!client) {
    throw new Error("Client not found");
  }
  
  // Add foundation status for client
  const foundationStatus = {
    overallProgress: id === 1 ? "75" : "25",
    trustCreated: id === 1 ? true : false,
    assetsFunded: id === 1 ? true : false,
    successorDesignated: id === 1 ? false : false,
    legacyFramework: id === 1 ? false : false
  };
  
  return { ...client, foundationStatus };
};

export const createClient = async (clientData) => {
  await delay(500);
  const newClient = {
    Id: Math.max(...clients.map(c => c.Id)) + 1,
    ...clientData,
    joinDate: new Date().toISOString()
  };
  clients.push(newClient);
  return { ...newClient };
};

export const updateClient = async (id, updates) => {
  await delay(400);
  const index = clients.findIndex(c => c.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Client not found");
  }
  clients[index] = { ...clients[index], ...updates };
  return { ...clients[index] };
};

export const deleteClient = async (id) => {
  await delay(300);
  const index = clients.findIndex(c => c.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Client not found");
  }
  const deletedClient = clients.splice(index, 1)[0];
  return { ...deletedClient };
};