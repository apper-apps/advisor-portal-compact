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

  // Add operations data for client
  const operationsData = {
    businessProfit: id === 1 ? 75000 : id === 2 ? 125000 : 35000,
    currentEntityType: id === 1 ? "LLC" : id === 2 ? "S-Corp" : "Sole Proprietorship",
    recommendedEntityType: "LLC taxed as S-Corp",
    taxSavings: {
      selfEmploymentTaxSavings: id === 1 ? 5738 : id === 2 ? 9563 : 0,
      corporateTaxBenefits: id === 1 ? 3250 : id === 2 ? 5875 : 0,
      totalAnnualSavings: id === 1 ? 8988 : id === 2 ? 15438 : 0
    },
    entityStructure: {
      hasPayrollSetup: id === 1 ? true : id === 2 ? true : false,
      reasonableSalary: id === 1 ? 45000 : id === 2 ? 65000 : 0,
      distributionAmount: id === 1 ? 30000 : id === 2 ? 60000 : 0,
      quarterlyFilings: id === 1 ? "Current" : id === 2 ? "Current" : "N/A"
    },
    complianceStatus: {
      corporateResolutions: id === 1 ? true : false,
      meetingMinutes: id === 1 ? true : false,
      separateBankAccounts: id === 1 ? true : id === 2 ? true : false,
      bookkeepingSeparation: id === 1 ? true : id === 2 ? true : false
    }
  };
  
return { ...client, foundationStatus, operationsData };
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