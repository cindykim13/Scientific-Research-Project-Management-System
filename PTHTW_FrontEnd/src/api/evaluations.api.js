import axiosInstance from './axiosInstance';

export const evaluationsApi = {
  submit: (data) =>
    axiosInstance.post('/api/v1/evaluations', data),
};
