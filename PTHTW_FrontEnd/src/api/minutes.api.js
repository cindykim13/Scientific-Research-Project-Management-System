import axiosInstance from './axiosInstance';

export const minutesApi = {
  submit: (data) =>
    axiosInstance.post('/api/v1/minutes', data),

  getByTopicId: (topicId) =>
    axiosInstance.get(`/api/v1/minutes/topic/${topicId}`),
};
