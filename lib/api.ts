import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData: any) => api.put('/auth/profile', profileData),
};

// Issues API
export const issuesAPI = {
  getIssues: (params?: any) => api.get('/issues', { params }),
  getIssue: (id: string) => api.get(`/issues/${id}`),
  createIssue: (issueData: any) => api.post('/issues', issueData),
  assignIssue: (id: string, assignedToId: string) => 
    api.put(`/issues/${id}/assign`, { assignedToId }),
  updateIssueStatus: (id: string, statusData: any) => 
    api.put(`/issues/${id}/status`, statusData),
  getIssueStats: () => api.get('/issues/stats/overview'),
};

// Users API
export const usersAPI = {
  getUsers: (params?: any) => api.get('/users', { params }),
  getUser: (id: string) => api.get(`/users/${id}`),
  updateUserStatus: (id: string, isActive: boolean) => 
    api.put(`/users/${id}/status`, { isActive }),
  getUserStats: () => api.get('/users/stats/overview'),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (params?: any) => api.get('/notifications', { params }),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// Workers API
export const workersAPI = {
  getWorkers: (params?: any) => api.get('/workers', { params }),
  getWorker: (id: string) => api.get(`/workers/${id}`),
  createWorker: (workerData: any) => api.post('/workers', workerData),
  updateWorker: (id: string, workerData: any) => api.put(`/workers/${id}`, workerData),
  deleteWorker: (id: string) => api.delete(`/workers/${id}`),
  getDepartments: () => api.get('/workers/departments/list'),
};

// Potholes API
export const potholesAPI = {
  getRegions: (timeline?: string) => api.get(`/potholes/regions${timeline ? `?timeline=${timeline}` : ''}`),
  getRegionReports: (regionId: string, filters?: any) => api.get(`/potholes/regions/${regionId}/reports`, { params: filters }),
  getStatistics: (timeline?: string) => api.get(`/potholes/statistics${timeline ? `?timeline=${timeline}` : ''}`),
  getRiskAnalysis: (timeline?: string) => api.get(`/potholes/risk-analysis${timeline ? `?timeline=${timeline}` : ''}`),
  createReport: (data: any) => api.post('/potholes/reports', data),
  updateReport: (reportId: string, data: any) => api.patch(`/potholes/reports/${reportId}`, data)
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
