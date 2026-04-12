import axiosInstance from './axiosInstance';
import { fetchAllSpringPageContents } from '../utils/pagination';

export const usersApi = {
  getAll: (params = {}) =>
    axiosInstance.get('/api/v1/users/', { params }),

  fetchAllUsers: (extra = {}) =>
    fetchAllSpringPageContents((p) =>
      axiosInstance.get('/api/v1/users/', { params: { sort: 'fullName,asc', ...p, ...extra } }),
    ),

  createManager: (data) =>
    axiosInstance.post('/api/v1/users/managers', data),

  createResearcher: (data) =>
    axiosInstance.post('/api/v1/users/researchers', data),

  createDeptHead: (data) =>
    axiosInstance.post('/api/v1/users/dept-heads', data),

  updateStatus: (id, active) =>
    axiosInstance.patch(`/api/v1/users/${id}/status`, { active }),
};
