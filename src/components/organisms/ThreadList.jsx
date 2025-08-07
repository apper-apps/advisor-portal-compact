import React from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Empty from '@/components/ui/Empty';
import { cn } from '@/utils/cn';

const ThreadList = ({ threads, selectedThread, onSelectThread, loading }) => {
  if (loading) {
    return (
      <Card className="h-full">
        <div className="p-4 border-b border-gray-100">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
        <div className="divide-y divide-gray-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16 ml-4"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!threads.length) {
    return (
      <Card className="h-full flex items-center justify-center">
        <Empty 
          icon="MessageSquare"
          title="No messages"
          description="You don't have any messages yet. Your conversations with your advisory team will appear here."
        />
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-semibold text-navy-900">Messages</h2>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-96 lg:max-h-none overflow-y-auto">
        {threads.map((thread) => (
          <div
            key={thread.threadId}
            onClick={() => onSelectThread(thread)}
            className={cn(
              "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
              selectedThread?.threadId === thread.threadId && "bg-blue-50 border-r-2 border-blue-500"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h3 className={cn(
                  "font-medium truncate text-sm",
                  thread.hasUnread ? "text-navy-900" : "text-gray-700"
                )}>
                  {thread.subject}
                </h3>
                <Badge 
                  variant={thread.priority === 'urgent' ? 'error' : 'default'}
                  size="sm"
                >
                  {thread.priority}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                {thread.hasUnread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
                <span className="text-xs text-gray-500">
                  {format(new Date(thread.timestamp), 'MMM d')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className={cn(
                "text-sm truncate flex-1 mr-2",
                thread.hasUnread ? "text-navy-700 font-medium" : "text-gray-600"
              )}>
                <span className="font-medium">{thread.lastSender}:</span>{' '}
                {thread.lastMessage}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 flex-shrink-0">
                <ApperIcon name="MessageSquare" className="h-3 w-3" />
                <span>{thread.messageCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-2">
              <ApperIcon name="Users" className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500 truncate">
                {thread.participants.join(', ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ThreadList;