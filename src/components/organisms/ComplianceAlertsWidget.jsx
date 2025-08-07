import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { 
  getActiveAlertsByClient, 
  snoozeComplianceAlert,
  activateComplianceAlert 
} from '@/services/api/complianceAlertService';

const ComplianceAlertsWidget = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const alertsData = await getActiveAlertsByClient(1); // Using John Smith's ID
      setAlerts(alertsData.slice(0, 5)); // Show only top 5 alerts
    } catch (err) {
      setError('Failed to load compliance alerts');
    } finally {
      setLoading(false);
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

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Compliance Alerts</h3>
          <ApperIcon name="Bell" className="h-5 w-5 text-gray-400" />
        </div>
        <Loading className="py-8" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Compliance Alerts</h3>
          <ApperIcon name="Bell" className="h-5 w-5 text-gray-400" />
        </div>
        <Error message={error} onRetry={loadAlerts} />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Compliance Alerts</h3>
          {alerts.length > 0 && (
            <Badge variant="destructive" size="sm">
              {alerts.length}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/compliance-alerts')}
            className="text-navy-600 border-navy-600 hover:bg-navy-50"
          >
            View All
          </Button>
          <ApperIcon name="Bell" className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {alerts.length === 0 ? (
        <Empty 
          icon="CheckCircle" 
          title="No active alerts" 
          description="All compliance deadlines are up to date."
          className="py-8"
        />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const daysUntilDue = getDaysUntilDue(alert.dueDate);
            const isUrgent = daysUntilDue !== null && daysUntilDue <= 3;
            
            return (
              <motion.div
                key={alert.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`p-4 border rounded-lg ${
                  isUrgent ? 'border-red-200 bg-red-50' : 
                  alert.priority === 'high' ? 'border-orange-200 bg-orange-50' : 
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isUrgent ? 'bg-red-100' :
                      alert.priority === 'high' ? 'bg-orange-100' : 'bg-blue-100'
                    }`}>
                      <ApperIcon 
                        name={getTypeIcon(alert.type)} 
                        className={`h-4 w-4 ${
                          isUrgent ? 'text-red-600' :
                          alert.priority === 'high' ? 'text-orange-600' : 'text-blue-600'
                        }`} 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">
                          {alert.title}
                        </h4>
                        <Badge variant={getPriorityVariant(alert.priority)} size="sm">
                          {alert.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {alert.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Calendar" size={12} />
                          <span className={
                            daysUntilDue !== null && daysUntilDue <= 0 ? 'text-red-600 font-medium' :
                            daysUntilDue !== null && daysUntilDue <= 3 ? 'text-orange-600 font-medium' : ''
                          }>
                            {formatDueDate(alert.dueDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Tag" size={12} />
                          <span>{alert.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {alert.status === 'snoozed' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleActivate(alert.Id)}
                        disabled={processingId === alert.Id}
                        className="text-green-600 border-green-600 hover:bg-green-50 text-xs px-2 py-1"
                      >
                        <ApperIcon name="Play" size={12} />
                      </Button>
                    ) : (
                      <div className="relative">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={processingId === alert.Id}
                          className="text-gray-600 border-gray-300 hover:bg-gray-50 text-xs px-2 py-1 group"
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
                          <ApperIcon name="Clock" size={12} className="mr-1" />
                          Snooze
                        </Button>
                        <div 
                          className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-32"
                          style={{ display: 'none' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                            onClick={() => handleSnooze(alert.Id, 1)}
                          >
                            1 Hour
                          </button>
                          <button
                            className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                            onClick={() => handleSnooze(alert.Id, 24)}
                          >
                            1 Day
                          </button>
                          <button
                            className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                            onClick={() => handleSnooze(alert.Id, 168)}
                          >
                            1 Week
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {alerts.length >= 5 && (
            <div className="text-center pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/compliance-alerts')}
                className="text-navy-600 border-navy-600 hover:bg-navy-50"
              >
                View All {alerts.length}+ Alerts
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ComplianceAlertsWidget;