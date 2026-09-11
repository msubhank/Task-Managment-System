import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard() {
  const { tasks, changeTaskStatus } = useTasks();
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const columns = [
    { id: 'todo', title: 'To Do', color: '#94a3b8' },
    { id: 'in_progress', title: 'In Progress', color: '#38bdf8' },
    { id: 'in_review', title: 'In Review', color: '#fbbf24' },
    { id: 'completed', title: 'Completed', color: '#34d399' }
  ];

  const handleDragStart = (e, task) => {
    setDraggedTaskId(task._id);
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDropTask = (taskId, targetStatus) => {
    setDraggedTaskId(null);
    changeTaskStatus(taskId, targetStatus);
  };

  return (
    <div className="kanban-board-container fade-in">
      <div className="kanban-board-grid">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={colTasks}
              draggedTaskId={draggedTaskId}
              onDragStartTask={handleDragStart}
              onDragEndTask={handleDragEnd}
              onDropTask={handleDropTask}
            />
          );
        })}
      </div>
    </div>
  );
}
