import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function KanbanColumn({ column, tasks, onDropTask, onDragStartTask, onDragEndTask, draggedTaskId }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { openCreateModal } = useTasks();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Only reset if leaving the column itself
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onDropTask(taskId, column.id);
    }
  };

  return (
    <div
      className={`kanban-column glass-card ${isDragOver ? 'kanban-column-dragover' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="kanban-column-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            className="kanban-status-indicator"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="kanban-column-title">{column.title}</h3>
        </div>
        <span className="badge kanban-count-badge">{tasks.length}</span>
      </div>

      {/* Column Drop Zone / Card List */}
      <div className="kanban-cards-list">
        {tasks.length === 0 ? (
          <div className="kanban-empty-dropzone">
            <span>Drop tasks here</span>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              draggable="true"
              onDragStart={(e) => onDragStartTask(e, task)}
              onDragEnd={onDragEndTask}
              className={`kanban-draggable-wrapper ${draggedTaskId === task._id ? 'is-dragging' : ''}`}
            >
              <TaskCard task={task} />
            </div>
          ))
        )}
      </div>

      {/* Quick Add Button in Column */}
      <button
        onClick={() => openCreateModal({ status: column.id })}
        className="kanban-add-btn"
        title={`Add new task to ${column.title}`}
      >
        <Plus size={15} /> Add Task
      </button>
    </div>
  );
}
