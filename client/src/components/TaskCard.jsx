import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { 
  Calendar, 
  CheckSquare, 
  Square, 
  Trash2, 
  Edit3, 
  Clock, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle,
  GripVertical
} from 'lucide-react';

export default function TaskCard({ task }) {
  const { changeTaskStatus, toggleSubtaskItem, removeTask, openEditModal } = useTasks();
  const [showSubtasks, setShowSubtasks] = useState(false);

  // Subtask progress
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Due Date calculation
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'completed';

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null;

  const priorityColors = {
    urgent: { bg: 'rgba(244, 63, 94, 0.15)', text: '#fb7185', border: 'rgba(244, 63, 94, 0.3)' },
    high: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' },
    medium: { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' },
    low: { bg: 'rgba(52, 211, 153, 0.15)', text: '#34d399', border: 'rgba(52, 211, 153, 0.3)' }
  };

  const currentPriority = priorityColors[task.priority] || priorityColors.medium;

  return (
    <div className={`task-card glass-card ${task.status === 'completed' ? 'task-card-completed' : ''}`}>
      {/* Top Header: Category, Priority, and Actions */}
      <div className="task-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span className="drag-grip-indicator" title="Drag to move task">
            <GripVertical size={14} />
          </span>

          {/* Priority Badge */}
          <span
            className="badge"
            style={{
              background: currentPriority.bg,
              color: currentPriority.text,
              borderColor: currentPriority.border,
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            {task.priority}
          </span>

          {/* Category */}
          {task.category && (
            <span className="task-category-chip">
              <Tag size={11} /> {task.category}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="task-card-actions" onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => openEditModal(task)}
            className="icon-btn"
            title="Edit Task"
            type="button"
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
                removeTask(task._id);
              }
            }}
            className="icon-btn icon-btn-danger"
            title="Delete Task"
            type="button"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Task Title & Description */}
      <div className="task-card-body">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-desc">{task.description}</p>}
      </div>

      {/* Subtasks Progress Bar & Toggle */}
      {totalSubtasks > 0 && (
        <div className="task-subtasks-section" onMouseDown={(e) => e.stopPropagation()}>
          <div
            className="subtasks-summary-bar"
            onClick={() => setShowSubtasks(!showSubtasks)}
            title="Click to view/toggle subtasks"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckSquare size={14} style={{ color: 'var(--accent-primary)' }} />
              <span>
                {completedSubtasks}/{totalSubtasks} Subtasks ({progressPercent}%)
              </span>
            </div>
            {showSubtasks ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${progressPercent}%`,
                background:
                  progressPercent === 100
                    ? 'var(--status-completed)'
                    : 'var(--gradient-primary)'
              }}
            />
          </div>

          {/* Expanded Subtasks List */}
          {showSubtasks && (
            <div className="subtasks-dropdown-list fade-in">
              {task.subtasks.map((st) => (
                <div
                  key={st._id}
                  className={`subtask-item ${st.completed ? 'subtask-completed' : ''}`}
                  onClick={() => toggleSubtaskItem(task._id, st._id)}
                >
                  {st.completed ? (
                    <CheckSquare size={15} className="subtask-checkbox checked" />
                  ) : (
                    <Square size={15} className="subtask-checkbox" />
                  )}
                  <span className="subtask-title">{st.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer: Due Date & Status Dropdown */}
      <div className="task-card-footer">
        {/* Due Date Indicator */}
        <div className="task-due-date">
          {formattedDueDate ? (
            <span className={`due-date-pill ${isOverdue ? 'overdue' : ''}`}>
              {isOverdue ? <AlertTriangle size={13} /> : <Clock size={13} />}
              {formattedDueDate}
            </span>
          ) : (
            <span className="due-date-pill text-muted">No Due Date</span>
          )}
        </div>

        {/* Quick Status Switcher Dropdown */}
        <div className="status-select-box" onMouseDown={(e) => e.stopPropagation()}>
          <select
            value={task.status}
            onChange={(e) => changeTaskStatus(task._id, e.target.value)}
            className={`status-inline-select status-${task.status}`}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
}
