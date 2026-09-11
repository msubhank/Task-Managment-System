import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { X, Plus, Trash2, Calendar, CheckSquare, Tag, AlertCircle, Sparkles } from 'lucide-react';

export default function TaskModal() {
  const { isModalOpen, activeTask, closeModal, addTask, editTask } = useTasks();

  const isEdit = Boolean(activeTask && activeTask._id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Populate form if in edit mode
  useEffect(() => {
    if (activeTask) {
      setTitle(activeTask.title || '');
      setDescription(activeTask.description || '');
      setStatus(activeTask.status || 'todo');
      setPriority(activeTask.priority || 'medium');
      setCategory(activeTask.category || 'General');
      setDueDate(
        activeTask.dueDate
          ? new Date(activeTask.dueDate).toISOString().split('T')[0]
          : ''
      );
      setSubtasks(activeTask.subtasks ? [...activeTask.subtasks] : []);
    } else {
      // Reset form
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setCategory('General');
      setDueDate('');
      setSubtasks([]);
    }
    setFormError('');
  }, [activeTask, isModalOpen]);

  if (!isModalOpen) return null;

  // Add new subtask item to list
  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    setSubtasks([
      ...subtasks,
      {
        title: newSubtaskTitle.trim(),
        completed: false
      }
    ]);
    setNewSubtaskTitle('');
  };

  // Remove subtask item
  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter a task title');
      return;
    }

    setSubmitting(true);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      category: category.trim() || 'General',
      dueDate: dueDate ? new Date(dueDate) : null,
      subtasks
    };

    let res;
    if (isEdit) {
      res = await editTask(activeTask._id, payload);
    } else {
      res = await addTask(payload);
    }

    setSubmitting(false);

    if (res.success) {
      closeModal();
    } else {
      setFormError(res.message || 'Operation failed');
    }
  };

  return (
    <div className="modal-overlay fade-in" onClick={closeModal}>
      <div
        className="modal-container glass-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="modal-icon-badge">
              <Sparkles size={18} />
            </div>
            <h2 style={{ fontSize: '1.25rem' }}>
              {isEdit ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          <button onClick={closeModal} className="icon-btn" title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="auth-error-banner" style={{ margin: '1rem 1.5rem 0' }}>
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="e.g. Implement user profile page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Add details, acceptance criteria, or links..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Row: Status & Priority */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-input form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🔵 Medium</option>
                <option value="high">🟡 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>
          </div>

          {/* Row: Category & Due Date */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                placeholder="e.g. Frontend, Backend, Bug"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input form-date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Subtasks Checklist Builder */}
          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label">Checklist / Subtasks</label>
            
            {/* Input to add subtask */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '1rem', flex: 1 }}
                placeholder="Add subtask and press Add (or Enter)..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            {/* List of current subtasks */}
            {subtasks.length > 0 && (
              <div className="modal-subtasks-list">
                {subtasks.map((st, index) => (
                  <div key={index} className="modal-subtask-row">
                    <CheckSquare size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: '0.85rem' }}>{st.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(index)}
                      className="icon-btn icon-btn-danger"
                      title="Remove subtask"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : isEdit
                ? 'Update Task'
                : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
