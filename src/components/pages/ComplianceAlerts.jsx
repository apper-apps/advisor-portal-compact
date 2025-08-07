import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import {
  getComplianceAlertsByClient,
  createComplianceAlert,
  updateComplianceAlert,
  deleteComplianceAlert,
  snoozeComplianceAlert,
  activateComplianceAlert
} from '@/services/api/complianceAlertService';

const ComplianceAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const [newAlert, setNewAlert] = useState({
    title: '',
    description: '',
    type: 'General Compliance',
    priority: 'medium',
    dueDate: '',
    isRecurring: false,
    recurringPattern: '',
    customization: {
      reminderDays: [7, 1],
      emailEnabled: true,
      smsEnabled: false
    }
  });

  const alertTypes = ['General Compliance', 'Tax Filing', 'Entity Filing', 'Trust Update', 'Investment Account'];
  const priorities = ['low', 'medium', 'high'];
  const statuses = ['all', 'active', 'snoozed'];
  const recurringPatterns = ['', 'daily', 'weekly', 'monthly', 'quarterly', 'annually'];

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    filterAndSortAlerts();
  }, [alerts, filter, sortBy, sortOrder, searchTerm]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const alertsData = await getComplianceAlertsByClient(1); // Using John Smith's ID
      setAlerts(alertsData);
    } catch (err) {
      setError('Failed to load compliance alerts');
      toast.error('Failed to load compliance alerts');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAlerts = () => {
    let filtered = [...alerts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(alert => {
        if (filter === 'active') {
          return alert.status === 'active' || (alert.status === 'snoozed' && alert.snoozedUntil && new Date(alert.snoozedUntil) <= new Date());
        }
        return alert.status === filter;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'dueDate':
          aValue = a.dueDate || '9999-12-31';
          bValue = b.dueDate || '9999-12-31';
          break;
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          aValue = a.createdDate;
          bValue = b.createdDate;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredAlerts(filtered);
  };

  const handleCreateAlert = async () => {
    try {
      if (!newAlert.title.trim()) {
        toast.error('Please enter an alert title');
        return;
      }

      await createComplianceAlert({
        ...newAlert,
        clientId: 1
      });

      toast.success('Compliance alert created successfully!');
      setShowCreateModal(false);
      setNewAlert({
        title: '',
        description: '',
        type: 'General Compliance',
        priority: 'medium',
        dueDate: '',
        isRecurring: false,
        recurringPattern: '',
        customization: {
          reminderDays: [7, 1],
          emailEnabled: true,
          smsEnabled: false
        }
      });
      loadAlerts();
    } catch (error) {
      toast.error('Failed to create compliance alert');
    }
  };

  const handleUpdateAlert = async (id, updates) => {
    try {
      await updateComplianceAlert(id, updates);
      toast.success('Compliance alert updated successfully!');
      setEditingAlert(null);
      loadAlerts();
    } catch (error) {
      toast.error('Failed to update compliance alert');
    }
  };

  const handleDeleteAlert = async (id) => {
    if (window.confirm('Are you sure you want to delete this compliance alert?')) {
      try {
        await deleteComplianceAlert(id);
        toast.success('Compliance alert deleted successfully!');
        loadAlerts();
      } catch (error) {
        toast.error('Failed to delete compliance alert');
      }
    }
  };

  const handleSnooze = async (alertId, hours) => {
    try {
      setProcessingId(alertId);
      await snoozeComplianceAlert(alertId, hours);
      toast.success(`Alert snoozed for ${hours > 24 ? Math.floor(hours/24) + ' days' : hours + ' hours'}`);
      loadAlerts();
    } catch (err) {
      toast.error('Failed to snooze alert');
    } finally {
      setProcessingId(null);
    }
  };

  const handleActivate = async (alertId) => {
    try {
      setProcessingId(alertId);
      await activateComplianceAlert(alertId);
      toast.success('Alert activated successfully');
      loadAlerts();
    } catch (err) {
      toast.error('Failed to activate alert');
    } finally {
      setProcessingId(null);
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getStatusVariant = (status, snoozedUntil) => {
    if (status === 'snoozed' && snoozedUntil && new Date(snoozedUntil) > new Date()) {
      return 'default';
    }
    return 'success';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Tax Filing': return 'FileText';
      case 'Entity Filing': return 'Building';
      case 'Trust Update': return 'Shield';
      case 'Investment Account': return 'TrendingUp';
      default: return 'Bell';
    }
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return 'No due date';
    const today = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return `Overdue by ${Math.abs(daysUntilDue)} days`;
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    if (daysUntilDue <= 7) return `Due in ${daysUntilDue} days`;
    
    return due.toLocaleDateString();
  };

  const getAlertStatus = (alert) => {
    if (alert.status === 'snoozed' && alert.snoozedUntil && new Date(alert.snoozedUntil) > new Date()) {
      return 'snoozed';
    }
    return 'active';
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAlerts} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Alerts</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage important deadlines and compliance requirements
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-navy-600 hover:bg-navy-700">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Alert
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
              <option value="type">Type</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <Empty 
          icon="Bell" 
          title="No compliance alerts found" 
          description="No alerts match your current filters."
        />
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert, index) => {
            const alertStatus = getAlertStatus(alert);
            const daysUntilDue = getDaysUntilDue(alert.dueDate);
            const isUrgent = daysUntilDue !== null && daysUntilDue <= 3;
            
            return (
              <motion.div
                key={alert.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={`p-6 ${isUrgent ? 'border-red-200 bg-red-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isUrgent ? 'bg-red-100' :
                          alert.priority === 'high' ? 'bg-orange-100' :
                          alert.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          <ApperIcon 
                            name={getTypeIcon(alert.type)} 
                            className={`h-5 w-5 ${
                              isUrgent ? 'text-red-600' :
                              alert.priority === 'high' ? 'text-orange-600' :
                              alert.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                            }`} 
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-navy-900">{alert.title}</h3>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge variant={getPriorityVariant(alert.priority)} size="sm">
                              {alert.priority}
                            </Badge>
                            <Badge variant={getStatusVariant(alert.status, alert.snoozedUntil)} size="sm">
                              {alertStatus}
                            </Badge>
                            {alert.isRecurring && (
                              <Badge variant="default" size="sm">
                                <ApperIcon name="RotateCw" size={12} className="mr-1" />
                                Recurring
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {alert.description && (
                          <p className="text-gray-600 mb-3">{alert.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Type:</span> {alert.type}
                          </div>
                          <div>
                            <span className="font-medium">Due:</span>{' '}
                            <span className={
                              daysUntilDue !== null && daysUntilDue <= 0 ? 'text-red-600 font-medium' :
                              daysUntilDue !== null && daysUntilDue <= 3 ? 'text-orange-600 font-medium' : ''
                            }>
                              {formatDueDate(alert.dueDate)}
                            </span>
                          </div>
                          {alert.snoozedUntil && alertStatus === 'snoozed' && (
                            <div>
                              <span className="font-medium">Snoozed until:</span>{' '}
                              {new Date(alert.snoozedUntil).toLocaleString()}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Created:</span> {new Date(alert.createdDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {alert.customization && (
                          <div className="mt-3 text-sm text-gray-600">
                            <span className="font-medium">Reminders:</span> {alert.customization.reminderDays.join(', ')} days before
                            {alert.customization.emailEnabled && <span className="ml-2">📧 Email</span>}
                            {alert.customization.smsEnabled && <span className="ml-2">📱 SMS</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {alertStatus === 'snoozed' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleActivate(alert.Id)}
                          disabled={processingId === alert.Id}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <ApperIcon name="Play" size={16} className="mr-1" />
                          Activate
                        </Button>
                      ) : (
                        <div className="relative">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={processingId === alert.Id}
                            className="text-gray-600 border-gray-300 hover:bg-gray-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              const dropdown = e.currentTarget.nextSibling;
                              if (dropdown.style.display === 'block') {
                                dropdown.style.display = 'none';
                              } else {
                                dropdown.style.display = 'block';
                              }
                            }}
                          >
                            <ApperIcon name="Clock" size={16} className="mr-1" />
                            Snooze
                          </Button>
                          <div 
                            className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-32"
                            style={{ display: 'none' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                              onClick={() => handleSnooze(alert.Id, 1)}
                            >
                              1 Hour
                            </button>
                            <button
                              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                              onClick={() => handleSnooze(alert.Id, 4)}
                            >
                              4 Hours
                            </button>
                            <button
                              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                              onClick={() => handleSnooze(alert.Id, 24)}
                            >
                              1 Day
                            </button>
                            <button
                              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                              onClick={() => handleSnooze(alert.Id, 168)}
                            >
                              1 Week
                            </button>
                          </div>
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingAlert(alert)}
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteAlert(alert.Id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Create New Compliance Alert</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <Input
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                  placeholder="Enter alert title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newAlert.description}
                  onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                  placeholder="Enter alert description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newAlert.type}
                    onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                  >
                    {alertTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newAlert.priority}
                    onChange={(e) => setNewAlert({ ...newAlert, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <Input
                  type="date"
                  value={newAlert.dueDate}
                  onChange={(e) => setNewAlert({ ...newAlert, dueDate: e.target.value })}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newAlert.isRecurring}
                    onChange={(e) => setNewAlert({ ...newAlert, isRecurring: e.target.checked })}
                    className="mr-2"
                  />
                  Recurring Alert
                </label>
                
                {newAlert.isRecurring && (
                  <select
                    value={newAlert.recurringPattern}
                    onChange={(e) => setNewAlert({ ...newAlert, recurringPattern: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                  >
                    {recurringPatterns.map(pattern => (
                      <option key={pattern} value={pattern}>
                        {pattern ? pattern.charAt(0).toUpperCase() + pattern.slice(1) : 'Select Pattern'}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAlert} className="bg-navy-600 hover:bg-navy-700">
                Create Alert
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {editingAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Edit Compliance Alert</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <Input
                  value={editingAlert.title}
                  onChange={(e) => setEditingAlert({ ...editingAlert, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingAlert.description}
                  onChange={(e) => setEditingAlert({ ...editingAlert, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={editingAlert.priority}
                    onChange={(e) => setEditingAlert({ ...editingAlert, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingAlert.status}
                    onChange={(e) => setEditingAlert({ ...editingAlert, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                  >
                    <option value="active">Active</option>
                    <option value="snoozed">Snoozed</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <Input
                  type="date"
                  value={editingAlert.dueDate}
                  onChange={(e) => setEditingAlert({ ...editingAlert, dueDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setEditingAlert(null)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleUpdateAlert(editingAlert.Id, editingAlert)}
                className="bg-navy-600 hover:bg-navy-700"
              >
                Update Alert
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ComplianceAlerts;