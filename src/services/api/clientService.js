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

  // Add comprehensive financial metrics for dashboard
  const financialMetrics = {
    taxSavingsYTD: {
      currentYear: id === 1 ? 47250 : id === 2 ? 32100 : 15600,
      targetYear: id === 1 ? 60000 : id === 2 ? 45000 : 25000,
      changePercent: id === 1 ? 18.2 : id === 2 ? 12.5 : 8.7,
      previousYear: id === 1 ? 40000 : id === 2 ? 28500 : 14350
    },
    assetProtection: {
      totalAssets: id === 1 ? 1500000 : id === 2 ? 850000 : 320000,
      totalProtected: id === 1 ? 1200000 : id === 2 ? 680000 : 160000,
      coveragePercent: id === 1 ? 80 : id === 2 ? 80 : 50,
      protectionMechanisms: {
        trusts: id === 1 ? true : false,
        llcStructures: id === 1 ? true : id === 2 ? true : false,
        insurance: id === 1 ? true : id === 2 ? true : true
      }
    },
    portfolioValue: {
      current: id === 1 ? 756000 : id === 2 ? 445000 : 125000,
      target: id === 1 ? 1000000 : id === 2 ? 750000 : 250000,
      growthPercent: id === 1 ? 12.8 : id === 2 ? 9.2 : 15.3,
      previousQuarter: id === 1 ? 670000 : id === 2 ? 407000 : 108000,
      allocation: {
        stocks: id === 1 ? 65 : id === 2 ? 60 : 70,
        bonds: id === 1 ? 25 : id === 2 ? 30 : 20,
        alternatives: id === 1 ? 10 : id === 2 ? 10 : 10
      }
    },
    wealthGoals: {
      overallProgress: id === 1 ? 78 : id === 2 ? 45 : 23,
      totalMilestones: 8,
      completedMilestones: id === 1 ? 6 : id === 2 ? 4 : 2,
      currentFocus: id === 1 ? "Tax Optimization" : id === 2 ? "Asset Protection" : "Foundation Building",
      nextMilestone: {
        name: id === 1 ? "Estate Planning Completion" : id === 2 ? "Trust Establishment" : "Business Entity Formation",
        targetDate: id === 1 ? "2024-06-30" : id === 2 ? "2024-05-15" : "2024-04-30",
        progressPercent: id === 1 ? 25 : id === 2 ? 60 : 15
      },
      milestones: [
        { name: "Initial Consultation", completed: true },
        { name: "Financial Assessment", completed: id >= 1 },
        { name: "Entity Formation", completed: id === 1 || (id === 2) },
        { name: "Tax Strategy Implementation", completed: id === 1 },
        { name: "Asset Protection Setup", completed: id === 1 },
        { name: "Investment Portfolio Launch", completed: id === 1 },
        { name: "Estate Planning", completed: false },
        { name: "Wealth Optimization", completed: false }
      ]
    }
};

  // Action Items summary
  const actionItems = {
    total: 6,
    pending: 3,
    overdue: 1,
    completed: 1,
    inProgress: 1
  };

  return { ...client, foundationStatus, operationsData, financialMetrics, actionItems };
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