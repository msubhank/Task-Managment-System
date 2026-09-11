import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as taskService from '../services/taskService';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View Mode: 'kanban' | 'list' | 'analytics'
  const [viewMode, setViewMode] = useState('kanban');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  // Debounced search query
  const debouncedSearch = useDebounce(searchQuery, 350);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null); // null = create mode, task object = edit mode

  // Fetch Tasks with filters
  const loadTasks = useCallback(async () => {
    // Only fetch tasks if a user is actively authenticated
    if (!isAuthenticated || !user?._id) {
      setTasks([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params = {
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
        order: sortBy === 'dueDate' ? 'asc' : 'desc'
      };
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      const res = await taskService.fetchTasks(params);
      if (res.success) {
        setTasks(res.tasks);
        setTotalCount(res.total);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?._id, statusFilter, priorityFilter, sortBy, debouncedSearch]);

  // Reset tasks state and reload whenever the authenticated user ID changes or on logout
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      loadTasks();
    } else {
      setTasks([]);
      setTotalCount(0);
      setLoading(false);
    }
  }, [user?._id, isAuthenticated, loadTasks]);

  // Status label formatter helper
  const formatStatusLabel = (st) => {
    switch (st) {
      case 'todo': return 'To Do';
      case 'in_progress': return 'In Progress';
      case 'in_review': return 'In Review';
      case 'completed': return 'Completed 🎉';
      default: return st;
    }
  };

  // Create Task
  const addTask = async (taskData) => {
    try {
      const res = await taskService.createTask(taskData);
      if (res.success) {
        setTasks((prev) => [res.task, ...prev]);
        setTotalCount((prev) => prev + 1);
        toast.success(`Task "${res.task.title}" created successfully!`);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not create task';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Edit Task
  const editTask = async (id, taskData) => {
    try {
      const res = await taskService.updateTask(id, taskData);
      if (res.success) {
        setTasks((prev) => prev.map((t) => (t._id === id ? res.task : t)));
        toast.success('Task updated successfully!');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not update task';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Delete Task
  const removeTask = async (id) => {
    // Optimistic removal
    const previousTasks = [...tasks];
    const targetTask = tasks.find((t) => t._id === id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    setTotalCount((prev) => Math.max(0, prev - 1));

    try {
      await taskService.deleteTask(id);
      toast.info(`Task "${targetTask?.title || 'item'}" deleted`);
      return { success: true };
    } catch (err) {
      // Rollback
      setTasks(previousTasks);
      setTotalCount(previousTasks.length);
      const msg = err.response?.data?.message || 'Failed to delete task';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Change Task Status (Optimistic)
  const changeTaskStatus = async (id, newStatus) => {
    const existing = tasks.find((t) => t._id === id);
    if (existing && existing.status === newStatus) return;

    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
    );

    try {
      await taskService.updateTaskStatus(id, newStatus);
      toast.info(`Moved to ${formatStatusLabel(newStatus)}`);
    } catch (err) {
      // Rollback on failure
      setTasks(previousTasks);
      toast.error('Failed to update task status');
    }
  };

  // Toggle Subtask (Optimistic)
  const toggleSubtaskItem = async (taskId, subtaskId) => {
    const previousTasks = [...tasks];
    let isNowCompleted = false;

    setTasks((prev) =>
      prev.map((t) => {
        if (t._id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((st) => {
            if (st._id === subtaskId) {
              isNowCompleted = !st.completed;
              return { ...st, completed: isNowCompleted };
            }
            return st;
          })
        };
      })
    );

    try {
      await taskService.toggleSubtask(taskId, subtaskId);
      toast.success(isNowCompleted ? 'Subtask marked complete' : 'Subtask reopened', 2500);
    } catch (err) {
      // Rollback
      setTasks(previousTasks);
      toast.error('Failed to update subtask');
    }
  };

  // Modal helpers
  const openCreateModal = (initialData = null) => {
    setActiveTask(initialData);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setActiveTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setActiveTask(null);
    setIsModalOpen(false);
  };

  // Calculate status counts for filter badges
  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    in_review: tasks.filter((t) => t.status === 'in_review').length,
    completed: tasks.filter((t) => t.status === 'completed').length
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        totalCount,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        sortBy,
        setSortBy,
        counts,
        viewMode,
        setViewMode,
        isModalOpen,
        activeTask,
        openCreateModal,
        openEditModal,
        closeModal,
        addTask,
        editTask,
        removeTask,
        changeTaskStatus,
        toggleSubtaskItem,
        refreshTasks: loadTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
