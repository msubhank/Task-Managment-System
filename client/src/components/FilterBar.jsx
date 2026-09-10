import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Search, Plus, X, Filter, ArrowUpDown } from 'lucide-react';

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
      {/* Top Row: Search & Actions */}
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

        {/* Action Controls */}
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

          {/* New Task Button */}
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      {/* Bottom Row: Status Filter Tabs */}
      <div className="status-tabs-row">
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
    </div>
  );
}
