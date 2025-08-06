import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { getActionItemsByClient, markActionItemCompleted } from "@/services/api/actionItemService";

const ActionItemsWidget = ({ clientId = 1 }) => {
  const [actionItems, setActionItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActionItems();
  }, [clientId]);

  const loadActionItems = async () => {
    try {
      setLoading(true);
      const items = await getActionItemsByClient(clientId);
      // Show only pending and overdue items, sorted by due date
      const urgentItems = items
        .filter(item => item.status === 'pending' || item.status === 'overdue')
        .sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        })
        .slice(0, 5); // Show max 5 items
      setActionItems(urgentItems);
    } catch (error) {
      console.error('Error loading action items:', error);
      toast.error('Failed to load action items');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteItem = async (itemId) => {
    try {
      await markActionItemCompleted(itemId);
      toast.success('Task completed successfully!');
      loadActionItems();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return 'AlertTriangle';
      case 'medium':
        return 'Clock';
      case 'low':
        return 'Info';
      default:
        return 'Circle';
    }
  };

  const getStatusColor = (item) => {
    if (item.status === 'overdue') return 'text-red-600';
    if (!item.dueDate) return 'text-gray-500';
    
    const today = new Date();
    const dueDate = new Date(item.dueDate);
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue <= 3) return 'text-red-600';
    if (daysUntilDue <= 7) return 'text-yellow-600';
    return 'text-gray-500';
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

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded mb-4 w-32"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ApperIcon name="CheckSquare" className="h-5 w-5 text-navy-600" />
          <h3 className="text-lg font-bold text-navy-900">Action Items</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = '/operations#action-items'}
        >
          View All
        </Button>
      </div>

      {actionItems.length === 0 ? (
        <div className="text-center py-8">
          <ApperIcon name="CheckCircle" className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <p className="text-sm text-gray-600">All tasks completed!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {actionItems.map((item, index) => (
            <motion.div
              key={item.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                  <ApperIcon 
                    name={getPriorityIcon(item.priority)} 
                    className={`h-3 w-3 ${item.priority === 'high' ? 'text-red-500' : item.priority === 'medium' ? 'text-yellow-500' : 'text-gray-500'}`} 
                  />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-navy-900 truncate">
                    {item.title}
                  </h4>
                  <Badge variant={getPriorityVariant(item.priority)} size="sm">
                    {item.priority}
                  </Badge>
                </div>
                
                {item.description && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${getStatusColor(item)}`}>
                    {formatDueDate(item.dueDate)}
                  </span>
                  
                  <button
                    onClick={() => handleCompleteItem(item.Id)}
                    className="text-xs text-green-600 hover:text-green-700 font-medium"
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ActionItemsWidget;