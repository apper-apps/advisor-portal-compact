import mockMessages from '@/services/mockData/messages.json';

let messages = [...mockMessages];
let nextId = Math.max(...messages.map(m => m.Id)) + 1;

export const messageService = {
  // Get all messages for the current user
  getAll: () => {
    return Promise.resolve([...messages]);
  },

  // Get messages by thread ID
  getByThread: (threadId) => {
    if (typeof threadId !== 'number') {
      return Promise.reject(new Error('Thread ID must be a number'));
    }
    const threadMessages = messages.filter(m => m.threadId === threadId);
    return Promise.resolve([...threadMessages]);
  },

  // Get message threads (unique conversations)
  getThreads: () => {
    const threadMap = new Map();
    
    // Group messages by threadId and get the latest message for each thread
    messages.forEach(message => {
      const existingThread = threadMap.get(message.threadId);
      if (!existingThread || new Date(message.timestamp) > new Date(existingThread.timestamp)) {
        threadMap.set(message.threadId, {
          threadId: message.threadId,
          subject: message.subject,
          lastMessage: message.content,
          lastSender: message.senderName,
          timestamp: message.timestamp,
          priority: message.priority,
          hasUnread: messages.some(m => m.threadId === message.threadId && !m.isRead),
          messageCount: messages.filter(m => m.threadId === message.threadId).length,
          participants: [...new Set(messages
            .filter(m => m.threadId === message.threadId)
            .flatMap(m => [m.senderName, m.recipientName]))]
        });
      }
    });

    const threads = Array.from(threadMap.values()).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    return Promise.resolve(threads);
  },

  // Get message by ID
  getById: (id) => {
    if (typeof id !== 'number') {
      return Promise.reject(new Error('ID must be a number'));
    }
    const message = messages.find(m => m.Id === id);
    return message ? Promise.resolve({...message}) : Promise.reject(new Error('Message not found'));
  },

  // Send new message
  send: (messageData) => {
    const newMessage = {
      Id: nextId++,
      threadId: messageData.threadId || nextId - 1,
      subject: messageData.subject,
      content: messageData.content,
      senderId: 1, // Current user (John Smith)
      senderName: "John Smith",
      senderType: "client",
      recipientId: messageData.recipientId,
      recipientName: messageData.recipientName,
      recipientType: messageData.recipientType || "advisor",
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: messageData.priority || 'routine',
      hasAttachments: messageData.attachments ? messageData.attachments.length > 0 : false,
      attachments: messageData.attachments || []
    };

    messages.push(newMessage);
    return Promise.resolve({...newMessage});
  },

  // Mark message as read
  markAsRead: (id) => {
    if (typeof id !== 'number') {
      return Promise.reject(new Error('ID must be a number'));
    }
    
    const messageIndex = messages.findIndex(m => m.Id === id);
    if (messageIndex === -1) {
      return Promise.reject(new Error('Message not found'));
    }

    messages[messageIndex] = { ...messages[messageIndex], isRead: true };
    return Promise.resolve({...messages[messageIndex]});
  },

  // Mark all messages in thread as read
  markThreadAsRead: (threadId) => {
    if (typeof threadId !== 'number') {
      return Promise.reject(new Error('Thread ID must be a number'));
    }

    messages = messages.map(message => 
      message.threadId === threadId 
        ? { ...message, isRead: true }
        : message
    );

    const threadMessages = messages.filter(m => m.threadId === threadId);
    return Promise.resolve([...threadMessages]);
  },

  // Delete message
  delete: (id) => {
    if (typeof id !== 'number') {
      return Promise.reject(new Error('ID must be a number'));
    }

    const messageIndex = messages.findIndex(m => m.Id === id);
    if (messageIndex === -1) {
      return Promise.reject(new Error('Message not found'));
    }

    const deletedMessage = { ...messages[messageIndex] };
    messages.splice(messageIndex, 1);
    return Promise.resolve(deletedMessage);
  },

  // Search messages
  search: (query, filters = {}) => {
    let filteredMessages = [...messages];

    // Text search
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredMessages = filteredMessages.filter(m => 
        m.subject.toLowerCase().includes(searchTerm) ||
        m.content.toLowerCase().includes(searchTerm) ||
        m.senderName.toLowerCase().includes(searchTerm) ||
        m.recipientName.toLowerCase().includes(searchTerm)
      );
    }

    // Priority filter
    if (filters.priority) {
      filteredMessages = filteredMessages.filter(m => m.priority === filters.priority);
    }

    // Read status filter
    if (filters.isRead !== undefined) {
      filteredMessages = filteredMessages.filter(m => m.isRead === filters.isRead);
    }

    // Date range filter
    if (filters.startDate) {
      filteredMessages = filteredMessages.filter(m => 
        new Date(m.timestamp) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filteredMessages = filteredMessages.filter(m => 
        new Date(m.timestamp) <= new Date(filters.endDate)
      );
    }

    return Promise.resolve(filteredMessages);
  },

  // Get unread message count
  getUnreadCount: () => {
    const unreadCount = messages.filter(m => !m.isRead && m.recipientType === 'client').length;
    return Promise.resolve(unreadCount);
  },

  // Upload attachment (mock implementation)
  uploadAttachment: (file) => {
    const attachment = {
      id: Date.now(),
      name: file.name,
      size: file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`,
      type: file.type,
      url: `/uploads/${file.name}`
    };
    
    return Promise.resolve(attachment);
  }
};