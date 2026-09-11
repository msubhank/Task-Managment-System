import React, { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../services/taskService';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  TrendingUp, 
  Sparkles, 
  Activity, 
  RefreshCw,
  Tag
} from 'lucide-react';

export default function AnalyticsOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="analytics-loading-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card stat-card-skeleton" />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="glass-card empty-state-box">
        <AlertTriangle size={36} style={{ color: 'var(--status-urgent)' }} />
        <h3>Failed to load analytics</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{error}</p>
        <button onClick={loadStats} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  const total = stats.total || 0;

  // Calculate percentages for Priority distribution
  const priorityPercentages = {
    urgent: total > 0 ? Math.round(((stats.byPriority?.urgent || 0) / total) * 100) : 0,
    high: total > 0 ? Math.round(((stats.byPriority?.high || 0) / total) * 100) : 0,
    medium: total > 0 ? Math.round(((stats.byPriority?.medium || 0) / total) * 100) : 0,
    low: total > 0 ? Math.round(((stats.byPriority?.low || 0) / total) * 100) : 0
  };

  return (
    <div className="analytics-container fade-in">
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Task Intelligence & Metrics</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Live aggregation calculated by MongoDB Aggregation Pipeline (<code style={{ color: '#38bdf8' }}>$facet</code>)
          </p>
        </div>
        <button onClick={loadStats} className="btn btn-secondary btn-sm" title="Refresh metrics">
          <RefreshCw size={13} /> Refresh Metrics
        </button>
      </div>

      {/* 4 Glowing KPI Metric Cards */}
      <div className="analytics-kpi-grid">
        {/* Card 1: Total Tasks */}
        <div className="glass-card kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Total Tasks</span>
            <div className="kpi-card-icon" style={{ color: '#818cf8', background: 'rgba(99, 102, 241, 0.12)' }}>
              <Layers size={18} />
            </div>
          </div>
          <div className="kpi-card-value">{stats.total}</div>
          <div className="kpi-card-meta" style={{ color: 'var(--text-muted)' }}>
            Across all project columns
          </div>
        </div>

        {/* Card 2: In Progress */}
        <div className="glass-card kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">In Progress</span>
            <div className="kpi-card-icon" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-card-value" style={{ color: '#38bdf8' }}>{stats.inProgress}</div>
          <div className="kpi-card-meta" style={{ color: 'var(--text-secondary)' }}>
            Active workflow items
          </div>
        </div>

        {/* Card 3: Completed */}
        <div className="glass-card kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Completed</span>
            <div className="kpi-card-icon" style={{ color: '#34d399', background: 'rgba(52, 211, 153, 0.12)' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-card-value" style={{ color: '#34d399' }}>{stats.completed}</div>
          <div className="kpi-card-meta" style={{ color: '#34d399' }}>
            {stats.completionRate}% completion rate
          </div>
        </div>

        {/* Card 4: Overdue */}
        <div className="glass-card kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Overdue</span>
            <div className="kpi-card-icon" style={{ color: stats.overdue > 0 ? '#f43f5e' : '#94a3b8', background: stats.overdue > 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="kpi-card-value" style={{ color: stats.overdue > 0 ? '#f43f5e' : 'var(--text-primary)' }}>
            {stats.overdue}
          </div>
          <div className="kpi-card-meta" style={{ color: stats.overdue > 0 ? '#fb7185' : 'var(--text-muted)' }}>
            {stats.overdue > 0 ? 'Requires immediate attention' : 'All deadlines on track'}
          </div>
        </div>
      </div>

      {/* Analytics Visual Breakdown Grid */}
      <div className="analytics-details-grid" style={{ marginTop: '1.75rem' }}>
        {/* Left Column: Priority Distribution */}
        <div className="glass-card analytics-panel">
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} style={{ color: 'var(--accent-primary)' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Priority Distribution</h3>
            </div>
            <span className="badge badge-connected" style={{ fontSize: '0.7rem' }}>MongoDB $group</span>
          </div>

          <div className="priority-bars-container">
            {/* Urgent */}
            <div className="priority-bar-item">
              <div className="bar-labels">
                <span style={{ color: '#fb7185', fontWeight: 600 }}>Urgent</span>
                <span style={{ color: 'var(--text-secondary)' }}>{stats.byPriority?.urgent || 0} ({priorityPercentages.urgent}%)</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${priorityPercentages.urgent}%`, background: 'var(--priority-urgent)' }} />
              </div>
            </div>

            {/* High */}
            <div className="priority-bar-item">
              <div className="bar-labels">
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>High</span>
                <span style={{ color: 'var(--text-secondary)' }}>{stats.byPriority?.high || 0} ({priorityPercentages.high}%)</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${priorityPercentages.high}%`, background: 'var(--priority-high)' }} />
              </div>
            </div>

            {/* Medium */}
            <div className="priority-bar-item">
              <div className="bar-labels">
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>Medium</span>
                <span style={{ color: 'var(--text-secondary)' }}>{stats.byPriority?.medium || 0} ({priorityPercentages.medium}%)</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${priorityPercentages.medium}%`, background: 'var(--priority-medium)' }} />
              </div>
            </div>

            {/* Low */}
            <div className="priority-bar-item">
              <div className="bar-labels">
                <span style={{ color: '#34d399', fontWeight: 600 }}>Low</span>
                <span style={{ color: 'var(--text-secondary)' }}>{stats.byPriority?.low || 0} ({priorityPercentages.low}%)</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${priorityPercentages.low}%`, background: 'var(--priority-low)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="glass-card analytics-panel">
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} style={{ color: '#38bdf8' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Recent Task Activity</h3>
            </div>
            <span className="badge badge-connected" style={{ fontSize: '0.7rem' }}>Last 5 Updated</span>
          </div>

          <div className="activity-feed-list">
            {stats.recentActivity?.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem 0' }}>
                No recent activity recorded yet.
              </p>
            ) : (
              stats.recentActivity?.map((item) => (
                <div key={item._id} className="activity-item">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h4 className="activity-item-title">{item.title}</h4>
                    <span className={`badge status-badge-${item.status}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Category: {item.category || 'General'}</span>
                    &bull;
                    <span>Updated: {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
