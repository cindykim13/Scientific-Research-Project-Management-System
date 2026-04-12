import axiosInstance from './axiosInstance';
import { fetchAllSpringPageContents } from '../utils/pagination';

export const councilsApi = {
  create: (data) =>
    axiosInstance.post('/api/v1/councils/', data),

  getAll: (params = {}) =>
    axiosInstance.get('/api/v1/councils/', { params }),

  fetchAllCouncils: (extra = {}) =>
    fetchAllSpringPageContents((p) =>
      axiosInstance.get('/api/v1/councils/', { params: { sort: 'councilId,desc', ...p, ...extra } }),
    ),

  getById: (id) =>
    axiosInstance.get(`/api/v1/councils/${id}`),

  assignMembers: (councilId, members) =>
    axiosInstance.post(`/api/v1/councils/${councilId}/members`, { members }),

  removeMember: (councilId, userId) =>
    axiosInstance.delete(`/api/v1/councils/${councilId}/members/${userId}`),

  assignTopics: (councilId, topicIds) =>
    axiosInstance.post(`/api/v1/councils/${councilId}/topics`, { topicIds }),

  removeTopic: (councilId, topicId) =>
    axiosInstance.delete(`/api/v1/councils/${councilId}/topics/${topicId}`),

  getMyTopics: (params = {}) =>
    axiosInstance.get('/api/v1/councils/me/topics', { params }),

  /** Aggregates all pages of council-assigned topics for the current expert (bounded requests per iteration). */
  fetchAllMyCouncilTopics: (extra = {}) =>
    fetchAllSpringPageContents((p) =>
      axiosInstance.get('/api/v1/councils/me/topics', {
        params: { sort: 'topicId,desc', ...p, ...extra },
      }),
    ),

  getEvaluationStatus: (councilId, topicId) =>
    axiosInstance.get(`/api/v1/councils/${councilId}/evaluations/status`, {
      params: { topicId },
    }),
};
