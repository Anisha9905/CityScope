"use client";

import { useState, useEffect } from 'react';
import { issuesAPI } from '@/lib/api';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  location: string;
  latitude?: number;
  longitude?: number;
  photos: string[];
  completionPhotos: string[];
  completionNotes?: string;
  reportedById: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  reportedBy: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  updates: Array<{
    id: string;
    status: string;
    notes?: string;
    updatedBy: string;
    createdAt: string;
  }>;
}

export interface IssueFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
}

export interface IssueStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  categoryStats: Array<{ category: string; _count: { category: number } }>;
  priorityStats: Array<{ priority: string; _count: { priority: number } }>;
}

export const useIssues = (filters?: IssueFilters) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchIssues = async (newFilters?: IssueFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = { ...filters, ...newFilters };
      const response = await issuesAPI.getIssues(params);
      
      if (response.data.success) {
        setIssues(response.data.data.issues);
        setPagination(response.data.data.pagination);
      } else {
        setError(response.data.message || 'Failed to fetch issues');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  const createIssue = async (issueData: any) => {
    try {
      const response = await issuesAPI.createIssue(issueData);
      
      if (response.data.success) {
        await fetchIssues(); // Refresh the list
        return response.data.data.issue;
      } else {
        throw new Error(response.data.message || 'Failed to create issue');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create issue');
    }
  };

  const assignIssue = async (issueId: string, assignedToId: string) => {
    try {
      const response = await issuesAPI.assignIssue(issueId, assignedToId);
      
      if (response.data.success) {
        await fetchIssues(); // Refresh the list
        return response.data.data.issue;
      } else {
        throw new Error(response.data.message || 'Failed to assign issue');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to assign issue');
    }
  };

  const updateIssueStatus = async (issueId: string, statusData: any) => {
    try {
      const response = await issuesAPI.updateIssueStatus(issueId, statusData);
      
      if (response.data.success) {
        await fetchIssues(); // Refresh the list
        return response.data.data.issue;
      } else {
        throw new Error(response.data.message || 'Failed to update issue status');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update issue status');
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [JSON.stringify(filters)]);

  return {
    issues,
    loading,
    error,
    pagination,
    fetchIssues,
    createIssue,
    assignIssue,
    updateIssueStatus,
  };
};

export const useIssue = (id: string) => {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIssue = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await issuesAPI.getIssue(id);
      
      if (response.data.success) {
        setIssue(response.data.data.issue);
      } else {
        setError(response.data.message || 'Failed to fetch issue');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch issue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  return {
    issue,
    loading,
    error,
    refetch: fetchIssue,
  };
};

export const useIssueStats = () => {
  const [stats, setStats] = useState<IssueStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await issuesAPI.getIssueStats();
      
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch stats');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
