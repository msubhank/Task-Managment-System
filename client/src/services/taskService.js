import api from './api';

/**
 * Task Service
 * Handles API calls to backend /api/tasks endpoints
 */
export const fetchTasks = async (params = {}) => {
  const response = await api.get('/tasks', { params });
  return response.data;
};

export const fetchTaskById = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await api.patch(`/tasks/${id}/status`, { status });
  return response.data;
};

export const toggleSubtask = async (id, subtaskId) => {
  const response = await api.patch(`/tasks/${id}/subtasks/${subtaskId}`);
  return response.data;
};
