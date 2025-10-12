"use client";

import { useState, useEffect } from 'react';
import { notificationsAPI } from '@/lib/api';

export interface Notification {
  id: string;
  userId: string;
  issueId?: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  issue?: {
    id: string;
    title: string;
    status: string;
    category: string;
  };
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  unread?: boolean;
}

export const useNotifications = (filters?: NotificationFilters) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const fetchNotifications = async (newFilters?: NotificationFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = { ...filters, ...newFilters };
      const response = await notificationsAPI.getNotifications(params);
      
      if (response.data.success) {
        setNotifications(response.data.data.notifications);
        setUnreadCount(response.data.data.unreadCount);
        setPagination(response.data.data.pagination);
      } else {
        setError(response.data.message || 'Failed to fetch notifications');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await notificationsAPI.markAsRead(id);
      
      if (response.data.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        throw new Error(response.data.message || 'Failed to mark notification as read');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await notificationsAPI.markAllAsRead();
      
      if (response.data.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
      } else {
        throw new Error(response.data.message || 'Failed to mark all notifications as read');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await notificationsAPI.deleteNotification(id);
      
      if (response.data.success) {
        // Update local state
        const deletedNotification = notifications.find(n => n.id === id);
        setNotifications(prev => prev.filter(notification => notification.id !== id));
        
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      } else {
        throw new Error(response.data.message || 'Failed to delete notification');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete notification');
    }
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const updateNotification = (id: string, updates: Partial<Notification>) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, ...updates }
          : notification
      )
    );
  };

  useEffect(() => {
    fetchNotifications();
  }, [JSON.stringify(filters)]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    updateNotification,
  };
};

export const useUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnreadCount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await notificationsAPI.getUnreadCount();
      
      if (response.data.success) {
        setUnreadCount(response.data.data.unreadCount);
      } else {
        setError(response.data.message || 'Failed to fetch unread count');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch unread count');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return {
    unreadCount,
    loading,
    error,
    refetch: fetchUnreadCount,
  };
};
