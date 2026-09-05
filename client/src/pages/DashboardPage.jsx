import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkHealth } from '../services/api';
import { 
  ShieldCheck, 
  User, 
  Key, 
  Database, 
  LogOut, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Calendar, 
  ArrowRight,
  Lock,
  Server
} from 'lucide-react';

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    checkHealth().then(setHealth).catch(() => {});
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Today';

  return (
    <div className="container fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Welcome & Profile Header Card */}
      <div className="glass-card profile-banner" style={{ marginTop: '2rem', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div className="avatar-circle">
              {getInitials(user?.name)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{user?.name}</h2>
                <span className="badge badge-connected" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  <ShieldCheck size={12} /> {user?.role || 'User'}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {user?.email} &bull; Member since {memberSince}
              </p>
            </div>
          </div>

          <button onClick={logout} className="btn btn-secondary">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Phase 2 Milestone Banner */}
      <div style={{
        marginTop: '2rem',
        background: 'var(--gradient-subtle)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sparkles size={14} /> Phase 2 Milestone Reached
          </div>
          <h3 style={{ fontSize: '1.4rem', marginTop: '0.25rem' }}>
            Full-Stack Authentication & Security Active
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Your account credentials are encrypted with <b>bcrypt (10 salt rounds)</b> and stored in <b>MongoDB Atlas</b>. 
            API requests are authenticated with stateless <b>JWT Bearer tokens</b>.
          </p>
        </div>
        <span className="badge badge-connected" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <CheckCircle2 size={16} /> Phase 2 Verified
        </span>
      </div>

      {/* Technical Concepts Overview Grid */}
      <div className="grid-cols-3" style={{ marginTop: '2rem' }}>
        {/* Card 1: Password Security */}
        <div className="glass-card status-card">
          <div className="status-card-header">
            <div className="status-card-icon" style={{ color: '#fbbf24' }}>
              <Lock size={22} />
            </div>
            <span className="badge badge-connected">Mongoose Hook</span>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Bcrypt Password Hashing</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Passwords are automatically salted and hashed via Mongoose pre-save hooks and excluded from queries with <code>select: false</code>.
            </p>
          </div>
          <div className="code-box">
            saltRounds: 10 &bull; one-way hash
          </div>
        </div>

        {/* Card 2: Stateless JWT */}
        <div className="glass-card status-card">
          <div className="status-card-header">
            <div className="status-card-icon" style={{ color: '#8b5cf6' }}>
              <Key size={22} />
            </div>
            <span className="badge badge-connected">Stateless Auth</span>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>JSON Web Token (JWT)</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Signed with HMAC SHA-256 secret. Axios interceptors automatically inject <code>Authorization: Bearer</code> headers.
            </p>
          </div>
          <div className="code-box">
            Expires: 7 Days &bull; HS256
          </div>
        </div>

        {/* Card 3: Cloud Database */}
        <div className="glass-card status-card">
          <div className="status-card-header">
            <div className="status-card-icon" style={{ color: '#10b981' }}>
              <Database size={22} />
            </div>
            <span className="badge badge-connected">MongoDB Atlas</span>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Cloud Data Persistence</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Users collection with unique email index for O(1) lookups and relational linking to future task documents.
            </p>
          </div>
          <div className="code-box">
            Collection: users &bull; indexed
          </div>
        </div>
      </div>

      {/* Live Authenticated User Token Inspector */}
      <section className="glass-card" style={{ marginTop: '2.5rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} style={{ color: '#38bdf8' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Active Session & User Object (GET /api/auth/me)</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            User ID: <code>{user?._id}</code>
          </span>
        </div>

        <div className="code-box" style={{ maxHeight: '240px' }}>
          <pre style={{ margin: 0 }}>
            {JSON.stringify({
              authenticated: true,
              user,
              tokenPreview: token ? `${token.substring(0, 32)}...[truncated]` : 'None'
            }, null, 2)}
          </pre>
        </div>
      </section>

      {/* Upcoming Phase 3 Teaser */}
      <section style={{ 
        marginTop: '2.5rem', 
        background: 'rgba(255, 255, 255, 0.02)', 
        border: '1px solid var(--border-subtle)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Coming Up in Phase 3
          </div>
          <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>Core Task Management & Interactive List View</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Task schema with user relations, priorities, checklist subtasks, debounced search, and multi-attribute filters.
          </p>
        </div>
        <span className="btn btn-primary" style={{ cursor: 'default' }}>
          Phase 3 Ready <ArrowRight size={16} />
        </span>
      </section>
    </div>
  );
}
