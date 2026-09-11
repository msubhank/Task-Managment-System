import React from 'react';
import { useTasks } from '../context/TaskContext';
import { 
  Search, 
  Plus, 
  X, 
  Filter, 
  ArrowUpDown, 
  Columns3, 
  List, 
  BarChart3 
} from 'lucide-react';

export default function FilterBar() {
  const {
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
    openCreateModal
  } = useTasks();

  const statuses = [
    { id: 'all', label: 'All Tasks', count: counts.all },
    { id: 'todo', label: 'To Do', count: counts.todo },
    { id: 'in_progress', label: 'In Progress', count: counts.in_progress },
    { id: 'in_review', label: 'In Review', count: counts.in_review },
    { id: 'completed', label: 'Completed', count: counts.completed }
  ];

  return (
    <div className="filter-bar-wrapper">
      {/* Top Header: View Mode Switcher + Create Task Button */}
      <div className="view-mode-header-row">
        {/* View Switcher Segmented Control */}
        <div className="view-switcher-group">
          <button
            className={`view-switcher-btn ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewMode('kanban')}
            title="Kanban Board View (Drag & Drop)"
          >
            <Columns3 size={16} />
            <span>Kanban Board</span>
          </button>

          <button
            className={`view-switcher-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <List size={16} />
            <span>List View</span>
          </button>

          <button
            className={`view-switcher-btn ${viewMode === 'analytics' ? 'active' : ''}`}
            onClick={() => setViewMode('analytics')}
            title="Analytics & Metrics Dashboard"
          >
            <BarChart3 size={16} />
            <span>Analytics</span>
          </button>
        </div>

        {/* Primary Create Task Button */}
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> New Task
        </button>
      </div>

      {/* Filter Row: Only shown in Kanban & List modes */}
      {viewMode !== 'analytics' && (
        <>
          <div className="filter-top-row">
            {/* Search Input */}
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search tasks by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="search-clear-btn"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Actions */}
            <div className="filter-actions">
              {/* Priority Filter */}
              <div className="select-wrapper">
                <Filter size={14} className="select-icon" />
                <select
                  className="custom-select"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">🔴 Urgent</option>
                  <option value="high">🟡 High</option>
                  <option value="medium">🔵 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>

              {/* Sort Selector */}
              <div className="select-wrapper">
                <ArrowUpDown size={14} className="select-icon" />
                <select
                  className="custom-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="createdAt">Newest First</option>
                  <option value="dueDate">Due Date</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status Tabs: Primarily for List View */}
          {viewMode === 'list' && (
            <div className="status-tabs-row fade-in">
              <div className="status-tabs">
                {statuses.map((s) => (
                  <button
                    key={s.id}
                    className={`status-tab ${statusFilter === s.id ? 'active' : ''}`}
                    onClick={() => setStatusFilter(s.id)}
                  >
                    <span>{s.label}</span>
                    <span className="status-tab-badge">{s.count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
