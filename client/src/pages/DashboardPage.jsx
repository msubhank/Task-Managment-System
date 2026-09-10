import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import FilterBar from '../components/FilterBar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ShieldCheck, 
  LogOut, 
  Sparkles,
  Layers,
  Inbox
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { tasks, loading, error, counts, openCreateModal } = useTasks();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container fade-in" style={{ paddingBottom: '5rem' }}>
      {/* User Header & Quick Metrics Bar */}
      <div className="dashboard-header-card glass-card">
        <div className="dashboard-user-info">
          <div className="avatar-circle">
            {getInitials(user?.name)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
              </h1>
              <span className="badge badge-connected" style={{ fontSize: '0.7rem' }}>
                <ShieldCheck size={12} /> {user?.role || 'User'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
              {user?.email} &bull; Manage your project tasks and workflow
            </p>
          </div>
        </div>

        {/* Quick Stats Chips */}
        <div className="dashboard-stat-chips">
          <div className="stat-chip">
            <span className="stat-chip-num" style={{ color: '#818cf8' }}>{counts.all}</span>
            <span className="stat-chip-label">Total</span>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-num" style={{ color: '#94a3b8' }}>{counts.todo}</span>
            <span className="stat-chip-label">To Do</span>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-num" style={{ color: '#38bdf8' }}>{counts.in_progress}</span>
            <span className="stat-chip-label">In Progress</span>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-num" style={{ color: '#34d399' }}>{counts.completed}</span>
            <span className="stat-chip-label">Done</span>
          </div>
        </div>
      </div>

      {/* Filter Bar with Search, Status Tabs, and Priority dropdown */}
      <FilterBar />

      {/* Main Task Cards Grid */}
      <div className="tasks-container">
        {loading ? (
          /* Loading Skeletons */
          <div className="tasks-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="task-skeleton glass-card" />
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="glass-card empty-state-box">
            <AlertCircle size={40} style={{ color: 'var(--status-urgent)' }} />
            <h3>Unable to load tasks</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          </div>
        ) : tasks.length === 0 ? (
          /* Empty State */
          <div className="glass-card empty-state-box">
            <div className="empty-state-icon">
              <Inbox size={42} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No tasks found</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              No tasks matched your search or filters. Create a new task to get started organizing your project!
            </p>
            <button onClick={openCreateModal} className="btn btn-primary">
              <Plus size={18} /> Create Your First Task
            </button>
          </div>
        ) : (
          /* Tasks Grid */
          <div className="tasks-grid fade-in">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Modal for Creating & Editing Tasks */}
      <TaskModal />
    </div>
  );
}
