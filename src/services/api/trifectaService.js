import trifectaData from "@/services/mockData/trifectaPillars.json";

let trifectaPillars = [...trifectaData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getTrifectaPillars = async () => {
  await delay(300);
  return [...trifectaPillars];
};

export const getTrifectaPillarById = async (id) => {
  await delay(200);
  const pillar = trifectaPillars.find(p => p.Id === parseInt(id));
  if (!pillar) {
    throw new Error("Trifecta pillar not found");
  }
  return { ...pillar };
};

export const createTrifectaPillar = async (pillarData) => {
  await delay(500);
  const newPillar = {
    Id: Math.max(...trifectaPillars.map(p => p.Id)) + 1,
    ...pillarData
  };
  trifectaPillars.push(newPillar);
  return { ...newPillar };
};

export const updateTrifectaPillar = async (id, updates) => {
  await delay(400);
  const index = trifectaPillars.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Trifecta pillar not found");
  }
  trifectaPillars[index] = { ...trifectaPillars[index], ...updates };
  return { ...trifectaPillars[index] };
};

export const deleteTrifectaPillar = async (id) => {
  await delay(300);
  const index = trifectaPillars.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Trifecta pillar not found");
  }
  const deletedPillar = trifectaPillars.splice(index, 1)[0];
  return { ...deletedPillar };
};