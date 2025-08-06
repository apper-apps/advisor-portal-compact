import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import {
  getAll,
  getByClientId,
  getAvailableSlots,
  create,
  update,
  cancel,
  getAppointmentTypes,
  getAdvisors
} from '@/services/api/appointmentService';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [selectedType, setSelectedType] = useState('');
  const [selectedAdvisor, setSelectedAdvisor] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [view, setView] = useState('calendar'); // 'calendar' | 'list'

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchAvailableSlots();
  }, [selectedType, selectedAdvisor]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, typesData, advisorsData] = await Promise.all([
        Promise.resolve(getByClientId(1)), // Assuming client ID 1
        Promise.resolve(getAppointmentTypes()),
        Promise.resolve(getAdvisors())
      ]);
      
      setAppointments(appointmentsData);
      setAppointmentTypes(typesData);
      setAdvisors(advisorsData);
      setError(null);
    } catch (err) {
      setError('Failed to load appointments');
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const slots = await Promise.resolve(getAvailableSlots(
        selectedType || null,
        selectedAdvisor ? parseInt(selectedAdvisor) : null
      ));
      setAvailableSlots(slots);
    } catch (err) {
      toast.error('Failed to load available slots');
    }
  };

  const handleBookAppointment = async (slot) => {
    try {
      const bookingData = {
        clientId: 1, // Assuming client ID 1
        advisorId: slot.advisorId,
        advisorName: slot.advisorName,
        advisorTitle: slot.advisorTitle,
        appointmentType: slot.appointmentType,
        date: slot.date,
        time: slot.time,
        duration: slot.duration,
        location: slot.location,
        meetingType: slot.meetingType,
        notes: bookingNotes
      };

      const newAppointment = await Promise.resolve(create(bookingData));
      
      // Remove the slot from available slots and add to appointments
      setAvailableSlots(prev => prev.filter(s => s.Id !== slot.Id));
      setAppointments(prev => [...prev, newAppointment]);
      
      setShowBookingForm(false);
      setSelectedSlot(null);
      setBookingNotes('');
      
      toast.success(`Appointment booked successfully for ${format(parseISO(slot.date), 'MMMM d, yyyy')} at ${slot.time}`);
    } catch (err) {
      toast.error('Failed to book appointment');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await Promise.resolve(cancel(appointmentId));
      setAppointments(prev => prev.map(apt => 
        apt.Id === appointmentId 
          ? { ...apt, status: 'Cancelled' }
          : apt
      ));
      toast.success('Appointment cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel appointment');
    }
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(currentWeek, i));
    }
    return days;
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => 
      isSameDay(parseISO(apt.date), date) && apt.status !== 'Cancelled'
    );
  };

  const getAvailableSlotsForDate = (date) => {
    return availableSlots.filter(slot => 
      isSameDay(parseISO(slot.date), date)
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    const typeConfig = appointmentTypes.find(t => t.name === type);
    return typeConfig ? typeConfig.color : 'bg-blue-100 text-blue-800';
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-600">
            Schedule consultations with your tax and legal advisors
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setView(view === 'calendar' ? 'list' : 'calendar')}
            variant="outline"
          >
            <ApperIcon name={view === 'calendar' ? 'List' : 'Calendar'} size={16} className="mr-2" />
            {view === 'calendar' ? 'List View' : 'Calendar View'}
          </Button>
          <Button
            onClick={() => setShowBookingForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {appointmentTypes.map(type => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Advisor
            </label>
            <select
              value={selectedAdvisor}
              onChange={(e) => setSelectedAdvisor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Advisors</option>
              {advisors.map(advisor => (
                <option key={advisor.id} value={advisor.id}>
                  {advisor.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {view === 'calendar' ? (
        <>
          {/* Calendar Navigation */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Week of {format(currentWeek, 'MMMM d, yyyy')}
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                  variant="outline"
                  size="sm"
                >
                  <ApperIcon name="ChevronLeft" size={16} />
                </Button>
                <Button
                  onClick={() => setCurrentWeek(startOfWeek(new Date()))}
                  variant="outline"
                  size="sm"
                >
                  Today
                </Button>
                <Button
                  onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                  variant="outline"
                  size="sm"
                >
                  <ApperIcon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-4">
              {getWeekDays().map(day => {
                const dayAppointments = getAppointmentsForDate(day);
                const dayAvailableSlots = getAvailableSlotsForDate(day);
                
                return (
                  <div key={day.toISOString()} className="border rounded-lg p-3 min-h-32">
                    <div className="font-medium text-sm text-gray-900 mb-2">
                      {format(day, 'EEE d')}
                    </div>
                    
                    {/* Existing Appointments */}
                    {dayAppointments.map(apt => (
                      <div
                        key={apt.Id}
                        className="mb-2 p-2 bg-blue-50 rounded text-xs cursor-pointer hover:bg-blue-100"
                        onClick={() => {
                          toast.info(`${apt.advisorName} - ${apt.appointmentType} at ${apt.time}`);
                        }}
                      >
                        <div className="font-medium">{apt.time}</div>
                        <div className="text-gray-600">{apt.appointmentType}</div>
                        <Badge size="sm" className={getStatusColor(apt.status)}>
                          {apt.status}
                        </Badge>
                      </div>
                    ))}
                    
                    {/* Available Slots */}
                    {dayAvailableSlots.slice(0, 2).map(slot => (
                      <div
                        key={slot.Id}
                        className="mb-1 p-2 bg-green-50 rounded text-xs cursor-pointer hover:bg-green-100 border border-green-200"
                        onClick={() => {
                          setSelectedSlot(slot);
                          setShowBookingForm(true);
                        }}
                      >
                        <div className="font-medium text-green-800">{slot.time}</div>
                        <div className="text-green-600 text-xs">{slot.advisorName.split(',')[0]}</div>
                      </div>
                    ))}
                    
                    {dayAvailableSlots.length > 2 && (
                      <div className="text-xs text-gray-500 text-center mt-1">
                        +{dayAvailableSlots.length - 2} more
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      ) : (
        <>
          {/* List View */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upcoming Appointments */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Appointments
              </h2>
              
              {appointments.filter(apt => apt.status !== 'Cancelled').length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Calendar" size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No upcoming appointments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments
                    .filter(apt => apt.status !== 'Cancelled')
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(apt => (
                      <div
                        key={apt.Id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getTypeColor(apt.appointmentType)}>
                                {apt.appointmentType}
                              </Badge>
                              <Badge size="sm" className={getStatusColor(apt.status)}>
                                {apt.status}
                              </Badge>
                            </div>
                            
                            <h3 className="font-medium text-gray-900">{apt.advisorName}</h3>
                            <p className="text-sm text-gray-600 mb-2">{apt.advisorTitle}</p>
                            
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <ApperIcon name="Calendar" size={16} className="mr-2" />
                              {format(parseISO(apt.date), 'MMMM d, yyyy')} at {apt.time}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <ApperIcon name="Clock" size={16} className="mr-2" />
                              {apt.duration} minutes
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600">
                              <ApperIcon name={apt.meetingType === 'Video Call' ? 'Video' : 'MapPin'} size={16} className="mr-2" />
                              {apt.location}
                            </div>
                            
                            {apt.notes && (
                              <p className="text-sm text-gray-600 mt-2 italic">
                                "{apt.notes}"
                              </p>
                            )}
                          </div>
                          
                          {apt.status === 'Confirmed' && (
                            <Button
                              onClick={() => handleCancelAppointment(apt.Id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>

            {/* Available Slots */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Available Slots
              </h2>
              
              {availableSlots.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Clock" size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No available slots match your filters</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableSlots
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(slot => (
                      <div
                        key={slot.Id}
                        className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedSlot(slot);
                          setShowBookingForm(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge size="sm" className={getTypeColor(slot.appointmentType)}>
                                {slot.appointmentType}
                              </Badge>
                            </div>
                            
                            <h4 className="font-medium text-gray-900 text-sm">
                              {slot.advisorName}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">
                              {slot.advisorTitle}
                            </p>
                            
                            <div className="text-sm text-gray-600">
                              <div className="flex items-center mb-1">
                                <ApperIcon name="Calendar" size={14} className="mr-2" />
                                {format(parseISO(slot.date), 'MMM d, yyyy')} at {slot.time}
                              </div>
                              <div className="flex items-center">
                                <ApperIcon name="Clock" size={14} className="mr-2" />
                                {slot.duration} minutes
                              </div>
                            </div>
                          </div>
                          
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Book
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Book Appointment
              </h3>
              <Button
                onClick={() => {
                  setShowBookingForm(false);
                  setSelectedSlot(null);
                  setBookingNotes('');
                }}
                variant="ghost"
                size="sm"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getTypeColor(selectedSlot.appointmentType)}>
                    {selectedSlot.appointmentType}
                  </Badge>
                </div>
                
                <h4 className="font-medium text-gray-900">{selectedSlot.advisorName}</h4>
                <p className="text-sm text-gray-600 mb-3">{selectedSlot.advisorTitle}</p>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <ApperIcon name="Calendar" size={16} className="mr-2" />
                    {format(parseISO(selectedSlot.date), 'MMMM d, yyyy')} at {selectedSlot.time}
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Clock" size={16} className="mr-2" />
                    {selectedSlot.duration} minutes
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name={selectedSlot.meetingType === 'Video Call' ? 'Video' : 'MapPin'} size={16} className="mr-2" />
                    {selectedSlot.location}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any specific topics or questions you'd like to discuss..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setShowBookingForm(false);
                    setSelectedSlot(null);
                    setBookingNotes('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleBookAppointment(selectedSlot)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}