import actionItemsData from '@/services/mockData/actionItems.json';

// Utility function for realistic API delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let actionItems = [...actionItemsData];

// Get all action items
export async function getActionItems() {
  await delay(300);
  return [...actionItems];
}

// Get action items by client ID
export async function getActionItemsByClient(clientId) {
  await delay(300);
  return actionItems.filter(item => item.clientId === parseInt(clientId));
}

// Get action item by ID
export async function getActionItemById(id) {
  await delay(200);
  const item = actionItems.find(item => item.Id === parseInt(id));
  if (!item) {
    throw new Error(`Action item with ID ${id} not found`);
  }
  return { ...item };
}

// Create new action item
export async function createActionItem(itemData) {
  await delay(400);
  
  if (!itemData.title || !itemData.clientId) {
    throw new Error('Title and client ID are required');
  }
  
  const newItem = {
    Id: Math.max(...actionItems.map(item => item.Id), 0) + 1,
    clientId: parseInt(itemData.clientId),
    title: itemData.title,
    description: itemData.description || '',
    category: itemData.category || 'General',
    priority: itemData.priority || 'medium',
    status: 'pending',
    dueDate: itemData.dueDate || null,
    createdDate: new Date().toISOString().split('T')[0],
    completedDate: null,
    assignedBy: itemData.assignedBy || 'System'
  };
  
  actionItems.push(newItem);
  return { ...newItem };
}

// Update action item
export async function updateActionItem(id, updates) {
  await delay(300);
  
  const index = actionItems.findIndex(item => item.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Action item with ID ${id} not found`);
  }
  
  const updatedItem = {
    ...actionItems[index],
    ...updates,
    Id: actionItems[index].Id, // Preserve ID
    clientId: actionItems[index].clientId, // Preserve client ID
    createdDate: actionItems[index].createdDate // Preserve creation date
  };
  
  // Handle status change to completed
  if (updates.status === 'completed' && actionItems[index].status !== 'completed') {
    updatedItem.completedDate = new Date().toISOString().split('T')[0];
  } else if (updates.status !== 'completed') {
    updatedItem.completedDate = null;
  }
  
  actionItems[index] = updatedItem;
  return { ...updatedItem };
}

// Delete action item
export async function deleteActionItem(id) {
  await delay(300);
  
  const index = actionItems.findIndex(item => item.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Action item with ID ${id} not found`);
  }
  
  actionItems.splice(index, 1);
  return true;
}

// Get action items by status
export async function getActionItemsByStatus(status) {
  await delay(300);
  return actionItems.filter(item => item.status === status);
}

// Get overdue action items
export async function getOverdueActionItems() {
  await delay(300);
  const today = new Date().toISOString().split('T')[0];
  return actionItems.filter(item => 
    item.status !== 'completed' && 
    item.dueDate && 
    item.dueDate < today
  );
}

// Get action items due soon (within next 7 days)
export async function getActionItemsDueSoon() {
  await delay(300);
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const todayStr = today.toISOString().split('T')[0];
  const nextWeekStr = nextWeek.toISOString().split('T')[0];
  
  return actionItems.filter(item => 
    item.status !== 'completed' && 
    item.dueDate && 
    item.dueDate >= todayStr && 
    item.dueDate <= nextWeekStr
  );
}

// Mark action item as completed
export async function markActionItemCompleted(id) {
  return await updateActionItem(id, { 
    status: 'completed',
    completedDate: new Date().toISOString().split('T')[0]
  });
}