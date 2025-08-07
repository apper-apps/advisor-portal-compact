import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import { messageService } from '@/services/api/messageService';
import { cn } from '@/utils/cn';

const MessageThread = ({ thread, onClose, onMessageSent }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [priority, setPriority] = useState('routine');
  const [attachments, setAttachments] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadMessages();
  }, [thread.threadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const threadMessages = await messageService.getByThread(thread.threadId);
      setMessages(threadMessages);
      
      // Mark unread messages as read
      const unreadMessages = threadMessages.filter(m => !m.isRead && m.recipientType === 'client');
      if (unreadMessages.length > 0) {
        await messageService.markThreadAsRead(thread.threadId);
      }
    } catch (error) {
      toast.error('Failed to load messages');
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      setSending(true);
      
      // Get the last advisor in the thread to reply to
      const advisorMessage = messages.find(m => m.senderType === 'advisor');
      const recipientId = advisorMessage?.senderId || 2;
      const recipientName = advisorMessage?.senderName || 'Advisory Team';

      const messageData = {
        threadId: thread.threadId,
        subject: thread.subject,
        content: newMessage,
        recipientId,
        recipientName,
        priority,
        attachments
      };

      await messageService.send(messageData);
      
      setNewMessage('');
      setAttachments([]);
      setPriority('routine');
      
      await loadMessages();
      onMessageSent?.();
      
      toast.success('Message sent successfully');
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (files) => {
    Array.from(files).forEach(async (file) => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      try {
        const attachment = await messageService.uploadAttachment(file);
        setAttachments(prev => [...prev, attachment]);
        toast.success(`File ${file.name} uploaded successfully`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const downloadAttachment = (attachment) => {
    // Mock download - in real app would handle actual file download
    toast.info(`Downloading ${attachment.name}`);
  };

  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="MessageSquare" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Thread Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-navy-900 truncate">{thread.subject}</h3>
            <Badge 
              variant={thread.priority === 'urgent' ? 'error' : 'default'}
              size="sm"
            >
              {thread.priority}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">
            {thread.participants.join(', ')} • {thread.messageCount} messages
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ApperIcon name="X" className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.Id} className={cn(
            "flex gap-3",
            message.senderType === 'client' ? "justify-end" : "justify-start"
          )}>
            {message.senderType === 'advisor' && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="User" className="h-4 w-4 text-blue-600" />
              </div>
            )}
            
            <div className={cn(
              "max-w-xs lg:max-w-md xl:max-w-lg",
              message.senderType === 'client' ? "order-1" : "order-2"
            )}>
              <div className={cn(
                "rounded-lg px-4 py-3 text-sm",
                message.senderType === 'client'
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900"
              )}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                {message.attachments.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-opacity-20 border-current space-y-1">
                    {message.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-2 text-xs cursor-pointer hover:underline"
                        onClick={() => downloadAttachment(attachment)}
                      >
                        <ApperIcon name="Paperclip" className="h-3 w-3" />
                        <span>{attachment.name}</span>
                        <span className="opacity-75">({attachment.size})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className={cn(
                "flex items-center gap-2 mt-1 text-xs text-gray-500",
                message.senderType === 'client' ? "justify-end" : "justify-start"
              )}>
                <span>{message.senderName}</span>
                <span>•</span>
                <span>{format(new Date(message.timestamp), 'MMM d, h:mm a')}</span>
                {message.isRead && message.senderType === 'client' && (
                  <ApperIcon name="CheckCheck" className="h-3 w-3 text-blue-500" />
                )}
              </div>
            </div>

            {message.senderType === 'client' && (
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="User" className="h-4 w-4 text-green-600" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Compose Form */}
      <div 
        className={cn(
          "p-4 border-t border-gray-100 transition-colors",
          dragOver && "border-blue-300 bg-blue-50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {attachments.length > 0 && (
          <div className="mb-3 space-y-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center gap-2 text-sm bg-gray-50 rounded p-2">
                <ApperIcon name="Paperclip" className="h-4 w-4 text-gray-500" />
                <span className="flex-1">{attachment.name}</span>
                <span className="text-gray-500">({attachment.size})</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(attachment.id)}
                  className="h-6 w-6 p-0"
                >
                  <ApperIcon name="X" className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="space-y-3">
          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="routine">Routine</option>
              <option value="urgent">Urgent</option>
            </select>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="px-3"
            >
              <ApperIcon name="Paperclip" className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={sending}
            />
            <Button type="submit" disabled={sending || (!newMessage.trim() && attachments.length === 0)}>
              {sending ? (
                <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
              ) : (
                <ApperIcon name="Send" className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls"
        />
      </div>
    </Card>
  );
};

export default MessageThread;