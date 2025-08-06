import mockAppointments from '@/services/mockData/appointments.json';

let appointments = [...mockAppointments];
let nextId = Math.max(...appointments.map(a => a.Id)) + 1;

export const getAll = () => {
  return appointments.map(appointment => ({ ...appointment }));
};

export const getById = (id) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) {
    throw new Error('Invalid appointment ID');
  }
  
  const appointment = appointments.find(a => a.Id === numericId);
  return appointment ? { ...appointment } : null;
};

export const getByClientId = (clientId) => {
  const numericClientId = parseInt(clientId);
  if (isNaN(numericClientId)) {
    throw new Error('Invalid client ID');
  }
  
  return appointments
    .filter(a => a.clientId === numericClientId)
    .map(appointment => ({ ...appointment }));
};

export const getAvailableSlots = (appointmentType = null, advisorId = null) => {
  return appointments
    .filter(a => a.status === 'Available')
    .filter(a => !appointmentType || a.appointmentType === appointmentType)
    .filter(a => !advisorId || a.advisorId === advisorId)
    .map(appointment => ({ ...appointment }));
};

export const create = (appointmentData) => {
  const newAppointment = {
    ...appointmentData,
    Id: nextId++,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };
  
  appointments.push(newAppointment);
  return { ...newAppointment };
};

export const update = (id, updateData) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) {
    throw new Error('Invalid appointment ID');
  }
  
  const index = appointments.findIndex(a => a.Id === numericId);
  if (index === -1) {
    throw new Error('Appointment not found');
  }
  
  appointments[index] = { ...appointments[index], ...updateData };
  return { ...appointments[index] };
};

export const cancel = (id) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) {
    throw new Error('Invalid appointment ID');
  }
  
  const index = appointments.findIndex(a => a.Id === numericId);
  if (index === -1) {
    throw new Error('Appointment not found');
  }
  
  appointments[index].status = 'Cancelled';
  return { ...appointments[index] };
};

export const deleteAppointment = (id) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) {
    throw new Error('Invalid appointment ID');
  }
  
  const index = appointments.findIndex(a => a.Id === numericId);
  if (index === -1) {
    throw new Error('Appointment not found');
  }
  
  const deleted = appointments.splice(index, 1)[0];
  return { ...deleted };
};

export const getAppointmentTypes = () => {
  return [
    {
      id: 'tax-planning',
      name: 'Tax Planning',
      description: 'Annual tax strategy and planning sessions',
      duration: 60,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'legal-review',
      name: 'Legal Review',
      description: 'Contract review and legal compliance',
      duration: 75,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'investment-consultation',
      name: 'Investment Consultation',
      description: 'Portfolio review and investment strategy',
      duration: 90,
      color: 'bg-purple-100 text-purple-800'
    }
  ];
};

export const getAdvisors = () => {
  return [
    {
      id: 1,
      name: 'Sarah Johnson, CPA',
      title: 'Senior Tax Advisor',
      specialties: ['Tax Planning', 'Business Tax Strategy'],
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 2,
      name: 'Michael Chen, JD',
      title: 'Legal Advisor',
      specialties: ['Legal Review', 'Contract Analysis'],
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 3,
      name: 'David Rodriguez, CFP',
      title: 'Investment Advisor',
      specialties: ['Investment Consultation', 'Portfolio Management'],
      avatar: '/api/placeholder/40/40'
    }
  ];
};