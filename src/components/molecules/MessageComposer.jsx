import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import { messageService } from '@/services/api/messageService';
import { cn } from '@/utils/cn';

const MessageComposer = ({ onMessageSent, onClose }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [recipient, setRecipient] = useState('');
  const [priority, setPriority] = useState('routine');
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const advisors = [
    { id: 2, name: 'Sarah Johnson', role: 'Tax Advisor' },
    { id: 3, name: 'Michael Chen', role: 'Investment Advisor' },
    { id: 4, name: 'Jennifer Walsh', role: 'Estate Planning' },
    { id: 5, name: 'David Rodriguez', role: 'Insurance Specialist' }
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!subject.trim() || !content.trim() || !recipient) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSending(true);
      
      const selectedAdvisor = advisors.find(a => a.id === parseInt(recipient));
      
      const messageData = {
        subject: subject.trim(),
        content: content.trim(),
        recipientId: parseInt(recipient),
        recipientName: selectedAdvisor?.name || 'Advisory Team',
        recipientType: 'advisor',
        priority,
        attachments
      };

      await messageService.send(messageData);
      
      setSubject('');
      setContent('');
      setRecipient('');
      setPriority('routine');
      setAttachments([]);
      
      onMessageSent?.();
      onClose?.();
      
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

  return (
    <Card className="h-full">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-navy-900">New Message</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" className="h-4 w-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex flex-col h-full">
        <div className="p-4 space-y-4 flex-1">
          {/* Recipient */}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              To <span className="text-red-500">*</span>
            </label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select an advisor...</option>
              {advisors.map((advisor) => (
                <option key={advisor.id} value={advisor.id}>
                  {advisor.name} - {advisor.role}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <Input
            label={<>Subject <span className="text-red-500">*</span></>}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter message subject..."
            required
          />

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="routine">Routine</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Attachments
              </label>
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-2 text-sm bg-gray-50 rounded p-2">
                    <ApperIcon name="Paperclip" className="h-4 w-4 text-gray-500" />
                    <span className="flex-1">{attachment.name}</span>
                    <span className="text-gray-500">({attachment.size})</span>
                    <Button
                      type="button"
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
            </div>
          )}

          {/* Message Content */}
          <div
            className={cn(
              "transition-colors",
              dragOver && "border-blue-300 bg-blue-50 rounded-lg"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <label className="block text-sm font-medium text-navy-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white text-navy-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
            {dragOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 rounded-lg">
                <div className="text-center">
                  <ApperIcon name="Upload" className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-blue-700 font-medium">Drop files here to attach</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
          >
            <ApperIcon name="Paperclip" className="h-4 w-4 mr-2" />
            Attach Files
          </Button>

          <div className="flex gap-2">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={sending}>
              {sending ? (
                <>
                  <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <ApperIcon name="Send" className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls"
        />
      </form>
    </Card>
  );
};

export default MessageComposer;