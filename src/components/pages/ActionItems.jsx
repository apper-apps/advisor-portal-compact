import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import {
  getActionItemsByClient,
  createActionItem,
  updateActionItem,
  deleteActionItem,
  markActionItemCompleted
} from "@/services/api/actionItemService";

const ActionItems = () => {
  const [actionItems, setActionItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'medium',
    dueDate: '',
    assignedBy: 'Admin'
  });

  const categories = ['General', 'Legal', 'Financial', 'Banking', 'Investment', 'Operations', 'Assessment'];
  const priorities = ['low', 'medium', 'high'];
  const statuses = ['all', 'pending', 'in-progress', 'completed', 'overdue'];

  useEffect(() => {
    loadActionItems();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [actionItems, filter, sortBy, sortOrder, searchTerm]);

  const loadActionItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await getActionItemsByClient(1); // Using John Smith's ID
      setActionItems(items);
    } catch (err) {
      setError('Failed to load action items');
      toast.error('Failed to load action items');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortItems = () => {
    let filtered = [...actionItems];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filter !== 'all') {
      if (filter === 'overdue') {
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(item => 
          item.status !== 'completed' && 
          item.dueDate && 
          item.dueDate < today
        );
      } else {
        filtered = filtered.filter(item => item.status === filter);
      }
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
        case 'status':
          aValue = a.status;
          bValue = b.status;
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

    setFilteredItems(filtered);
  };

  const handleCreateItem = async () => {
    try {
      if (!newItem.title.trim()) {
        toast.error('Please enter a title');
        return;
      }

      await createActionItem({
        ...newItem,
        clientId: 1
      });

      toast.success('Action item created successfully!');
      setShowCreateModal(false);
      setNewItem({
        title: '',
        description: '',
        category: 'General',
        priority: 'medium',
        dueDate: '',
        assignedBy: 'Admin'
      });
      loadActionItems();
    } catch (error) {
      toast.error('Failed to create action item');
    }
  };

  const handleUpdateItem = async (id, updates) => {
    try {
      await updateActionItem(id, updates);
      toast.success('Action item updated successfully!');
      setEditingItem(null);
      loadActionItems();
    } catch (error) {
      toast.error('Failed to update action item');
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this action item?')) {
      try {
        await deleteActionItem(id);
        toast.success('Action item deleted successfully!');
        loadActionItems();
      } catch (error) {
        toast.error('Failed to delete action item');
      }
    }
  };

  const handleCompleteItem = async (id) => {
    try {
      await markActionItemCompleted(id);
      toast.success('Action item completed!');
      loadActionItems();
    } catch (error) {
      toast.error('Failed to complete action item');
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

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'overdue': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'in-progress': return 'Clock';
      case 'overdue': return 'AlertTriangle';
      default: return 'Circle';
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

  const getItemStatus = (item) => {
    if (item.status === 'completed') return 'completed';
    if (item.status === 'in-progress') return 'in-progress';
    
    const today = new Date().toISOString().split('T')[0];
    if (item.dueDate && item.dueDate < today) return 'overdue';
    
    return 'pending';
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadActionItems} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Action Items</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track and manage required tasks and documentation
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-navy-600 hover:bg-navy-700">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Action Item
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <Input
              placeholder="Search action items..."
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
              <option value="status">Status</option>
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

      {/* Action Items List */}
      {filteredItems.length === 0 ? (
        <Empty 
          icon="CheckSquare" 
          title="No action items found" 
          description="No action items match your current filters."
        />
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item, index) => {
            const itemStatus = getItemStatus(item);
            return (
              <motion.div
                key={item.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          itemStatus === 'completed' ? 'bg-green-100' :
                          itemStatus === 'overdue' ? 'bg-red-100' :
                          itemStatus === 'in-progress' ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}>
                          <ApperIcon 
                            name={getStatusIcon(itemStatus)} 
                            className={`h-5 w-5 ${
                              itemStatus === 'completed' ? 'text-green-600' :
                              itemStatus === 'overdue' ? 'text-red-600' :
                              itemStatus === 'in-progress' ? 'text-yellow-600' : 'text-gray-600'
                            }`} 
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-navy-900">{item.title}</h3>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge variant={getPriorityVariant(item.priority)} size="sm">
                              {item.priority}
                            </Badge>
                            <Badge variant={getStatusVariant(itemStatus)} size="sm">
                              {itemStatus}
                            </Badge>
                          </div>
                        </div>
                        
                        {item.description && (
                          <p className="text-gray-600 mb-3">{item.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Category:</span> {item.category}
                          </div>
                          <div>
                            <span className="font-medium">Due:</span>{' '}
                            <span className={
                              itemStatus === 'overdue' ? 'text-red-600 font-medium' :
                              item.dueDate && new Date(item.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
                                ? 'text-yellow-600 font-medium' : ''
                            }>
                              {formatDueDate(item.dueDate)}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Assigned by:</span> {item.assignedBy}
                          </div>
                          <div>
                            <span className="font-medium">Created:</span> {new Date(item.createdDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {itemStatus !== 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompleteItem(item.Id)}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <ApperIcon name="CheckCircle" size={16} className="mr-1" />
                          Complete
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingItem(item)}
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteItem(item.Id)}
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
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Create New Action Item</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Enter task description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newItem.priority}
                    onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
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
                  value={newItem.dueDate}
                  onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateItem} className="bg-navy-600 hover:bg-navy-700">
                Create Action Item
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Edit Action Item</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <Input
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={editingItem.priority}
                    onChange={(e) => setEditingItem({ ...editingItem, priority: e.target.value })}
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
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <Input
                  type="date"
                  value={editingItem.dueDate}
                  onChange={(e) => setEditingItem({ ...editingItem, dueDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleUpdateItem(editingItem.Id, editingItem)}
                className="bg-navy-600 hover:bg-navy-700"
              >
                Update Action Item
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ActionItems;