import mockComplianceAlerts from '@/services/mockData/complianceAlerts.json';

let complianceAlertsData = [...mockComplianceAlerts];
let nextId = Math.max(...complianceAlertsData.map(alert => alert.Id)) + 1;

// Get all compliance alerts
export const getAllComplianceAlerts = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...complianceAlertsData];
};

// Get compliance alerts by client ID
export const getComplianceAlertsByClient = async (clientId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!clientId || typeof clientId !== 'number') {
    throw new Error('Valid client ID is required');
  }
  
  return complianceAlertsData.filter(alert => alert.clientId === clientId);
};

// Get compliance alert by ID
export const getComplianceAlertById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (!id || typeof id !== 'number') {
    throw new Error('Valid alert ID is required');
  }
  
  const alert = complianceAlertsData.find(alert => alert.Id === id);
  if (!alert) {
    throw new Error('Compliance alert not found');
  }
  
  return { ...alert };
};

// Create new compliance alert
export const createComplianceAlert = async (alertData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!alertData.title?.trim()) {
    throw new Error('Alert title is required');
  }
  
  if (!alertData.clientId || typeof alertData.clientId !== 'number') {
    throw new Error('Valid client ID is required');
  }
  
  const newAlert = {
    Id: nextId++,
    clientId: alertData.clientId,
    title: alertData.title.trim(),
    description: alertData.description?.trim() || '',
    type: alertData.type || 'General Compliance',
    priority: alertData.priority || 'medium',
    dueDate: alertData.dueDate || null,
    status: 'active',
    isRecurring: alertData.isRecurring || false,
    recurringPattern: alertData.recurringPattern || null,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    snoozedUntil: null,
    customization: {
      reminderDays: alertData.customization?.reminderDays || [7, 1],
      emailEnabled: alertData.customization?.emailEnabled ?? true,
      smsEnabled: alertData.customization?.smsEnabled ?? false
    }
  };
  
  complianceAlertsData.push(newAlert);
  return { ...newAlert };
};

// Update compliance alert
export const updateComplianceAlert = async (id, updates) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!id || typeof id !== 'number') {
    throw new Error('Valid alert ID is required');
  }
  
  const alertIndex = complianceAlertsData.findIndex(alert => alert.Id === id);
  if (alertIndex === -1) {
    throw new Error('Compliance alert not found');
  }
  
  const updatedAlert = {
    ...complianceAlertsData[alertIndex],
    ...updates,
    Id: id, // Ensure ID cannot be changed
    updatedDate: new Date().toISOString()
  };
  
  complianceAlertsData[alertIndex] = updatedAlert;
  return { ...updatedAlert };
};

// Delete compliance alert
export const deleteComplianceAlert = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!id || typeof id !== 'number') {
    throw new Error('Valid alert ID is required');
  }
  
  const alertIndex = complianceAlertsData.findIndex(alert => alert.Id === id);
  if (alertIndex === -1) {
    throw new Error('Compliance alert not found');
  }
  
  complianceAlertsData.splice(alertIndex, 1);
  return true;
};

// Snooze compliance alert
export const snoozeComplianceAlert = async (id, duration) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  if (!id || typeof id !== 'number') {
    throw new Error('Valid alert ID is required');
  }
  
  if (!duration || typeof duration !== 'number') {
    throw new Error('Valid snooze duration in hours is required');
  }
  
  const alertIndex = complianceAlertsData.findIndex(alert => alert.Id === id);
  if (alertIndex === -1) {
    throw new Error('Compliance alert not found');
  }
  
  const snoozedUntil = new Date();
  snoozedUntil.setHours(snoozedUntil.getHours() + duration);
  
  complianceAlertsData[alertIndex] = {
    ...complianceAlertsData[alertIndex],
    status: 'snoozed',
    snoozedUntil: snoozedUntil.toISOString(),
    updatedDate: new Date().toISOString()
  };
  
  return { ...complianceAlertsData[alertIndex] };
};

// Activate snoozed alert
export const activateComplianceAlert = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  if (!id || typeof id !== 'number') {
    throw new Error('Valid alert ID is required');
  }
  
  const alertIndex = complianceAlertsData.findIndex(alert => alert.Id === id);
  if (alertIndex === -1) {
    throw new Error('Compliance alert not found');
  }
  
  complianceAlertsData[alertIndex] = {
    ...complianceAlertsData[alertIndex],
    status: 'active',
    snoozedUntil: null,
    updatedDate: new Date().toISOString()
  };
  
  return { ...complianceAlertsData[alertIndex] };
};

// Get active alerts (not snoozed, within reminder period)
export const getActiveAlertsByClient = async (clientId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!clientId || typeof clientId !== 'number') {
    throw new Error('Valid client ID is required');
  }
  
  const now = new Date();
  const alerts = complianceAlertsData.filter(alert => {
    if (alert.clientId !== clientId) return false;
    if (alert.status === 'snoozed' && alert.snoozedUntil && new Date(alert.snoozedUntil) > now) return false;
    
    // Check if within reminder period
    if (!alert.dueDate) return alert.status === 'active';
    
    const dueDate = new Date(alert.dueDate);
    const maxReminderDays = Math.max(...(alert.customization?.reminderDays || [7]));
    const reminderStartDate = new Date(dueDate);
    reminderStartDate.setDate(reminderStartDate.getDate() - maxReminderDays);
    
    return alert.status === 'active' && now >= reminderStartDate && now <= dueDate;
  });
  
  return alerts.sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
};