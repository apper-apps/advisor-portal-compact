import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ThreadList from '@/components/organisms/ThreadList';
import MessageThread from '@/components/organisms/MessageThread';
import MessageComposer from '@/components/molecules/MessageComposer';
import { messageService } from '@/services/api/messageService';

const Messages = () => {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filters, setFilters] = useState({
    priority: '',
    isRead: ''
  });

  useEffect(() => {
    loadThreads();
    loadUnreadCount();
  }, []);

  const loadThreads = async () => {
    try {
      setLoading(true);
      setError(null);
      const threadData = await messageService.getThreads();
      setThreads(threadData);
    } catch (error) {
      setError('Failed to load messages. Please try again.');
      console.error('Error loading threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await messageService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadThreads();
      return;
    }

    try {
      setLoading(true);
      const messages = await messageService.search(searchQuery, filters);
      
      // Group search results back into threads
      const threadMap = new Map();
      messages.forEach(message => {
        if (!threadMap.has(message.threadId)) {
          threadMap.set(message.threadId, {
            threadId: message.threadId,
            subject: message.subject,
            lastMessage: message.content,
            lastSender: message.senderName,
            timestamp: message.timestamp,
            priority: message.priority,
            hasUnread: !message.isRead,
            messageCount: 1,
            participants: [message.senderName, message.recipientName]
          });
        } else {
          const thread = threadMap.get(message.threadId);
          thread.messageCount++;
          if (new Date(message.timestamp) > new Date(thread.timestamp)) {
            thread.lastMessage = message.content;
            thread.lastSender = message.senderName;
            thread.timestamp = message.timestamp;
          }
          if (!message.isRead) {
            thread.hasUnread = true;
          }
        }
      });

      const searchResults = Array.from(threadMap.values()).sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      setThreads(searchResults);
    } catch (error) {
      toast.error('Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({ priority: '', isRead: '' });
    loadThreads();
  };

  const handleThreadSelect = (thread) => {
    setSelectedThread(thread);
    setShowComposer(false);
  };

  const handleNewMessage = () => {
    setShowComposer(true);
    setSelectedThread(null);
  };

  const handleMessageSent = () => {
    loadThreads();
    loadUnreadCount();
    setShowComposer(false);
  };

  const handleThreadClose = () => {
    setSelectedThread(null);
  };

  if (error) {
    return <Error message={error} onRetry={loadThreads} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-3">
            <ApperIcon name="MessageSquare" className="h-8 w-8" />
            Messages
            {unreadCount > 0 && (
              <Badge variant="error" size="sm">
                {unreadCount} unread
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 mt-1">
            Communicate securely with your advisory team
          </p>
        </div>
        
        <Button onClick={handleNewMessage} className="w-full sm:w-auto">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="routine">Routine</option>
            </select>
            
            <select
              value={filters.isRead}
              onChange={(e) => setFilters(prev => ({ ...prev, isRead: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Messages</option>
              <option value="false">Unread</option>
              <option value="true">Read</option>
            </select>
            
            <Button onClick={handleSearch} size="sm">
              <ApperIcon name="Search" className="h-4 w-4" />
            </Button>
            
            {(searchQuery || filters.priority || filters.isRead) && (
              <Button onClick={handleClearFilters} variant="outline" size="sm">
                Clear
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Messages Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Thread List */}
        <div className="lg:col-span-1">
          <ThreadList
            threads={threads}
            selectedThread={selectedThread}
            onSelectThread={handleThreadSelect}
            loading={loading}
          />
        </div>

        {/* Message Thread or Composer */}
        <div className="lg:col-span-2">
          {showComposer ? (
            <MessageComposer
              onMessageSent={handleMessageSent}
              onClose={() => setShowComposer(false)}
            />
          ) : selectedThread ? (
            <MessageThread
              thread={selectedThread}
              onClose={handleThreadClose}
              onMessageSent={() => {
                loadThreads();
                loadUnreadCount();
              }}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <Empty
                icon="MessageSquare"
                title="Select a conversation"
                description="Choose a message thread from the list to view the conversation, or start a new message."
                actionText="New Message"
                onAction={handleNewMessage}
              />
            </Card>
          )}
        </div>
      </div>

      {/* Mobile-specific quick actions */}
      <div className="lg:hidden fixed bottom-4 right-4">
        <Button
          onClick={handleNewMessage}
          className="rounded-full w-14 h-14 shadow-lg"
        >
          <ApperIcon name="Plus" className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Messages;