import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { checkHealth } from './services/api';
import { 
  Server, 
  Database, 
  Layers, 
  Terminal, 
  CheckCircle, 
  ExternalLink, 
  Code2, 
  Key, 
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkHealth();
      setHealth(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const copyEnvSample = () => {
    navigator.clipboard.writeText('MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar 
        onRefreshHealth={fetchHealth} 
        healthStatus={health} 
        loadingHealth={loading} 
      />

      {/* Main Content */}
      <main className="container" style={{ paddingBottom: '4rem' }}>
        {/* Hero Section */}
        <section className="hero-section fade-in">
          <div className="hero-pill">
            <Sparkles size={14} /> Phase 1: Foundation & Architecture Complete
          </div>
          <h1 className="hero-title">
            Enterprise <span className="hero-gradient">MERN Task Manager</span>
          </h1>
          <p className="hero-subtitle">
            Built for interview excellence and full-stack mastery. Explore the architecture, 
            understand the data layer, and prepare for high-level technical discussions.
          </p>
        </section>

        {/* MongoDB Setup & Guide Banner */}
        <section className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
              flexShrink: 0
            }}>
              <Database size={26} />
            </div>

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>How MongoDB Works in this Project</h3>
                <span className={`badge ${health?.database?.isConnected ? 'badge-connected' : 'badge-disconnected'}`}>
                  {health?.database?.isInMemory ? '⚡ Active: In-Memory (Zero Setup)' : (health?.database?.isConnected ? '🟢 Active: External DB' : '⚪ Disconnected')}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                You have two seamless options for your database. You can develop right away using the built-in in-memory engine, or plug in a free cloud cluster from MongoDB Atlas:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {/* Option A */}
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: '10px', 
                  padding: '1.25rem' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#38bdf8', marginBottom: '0.5rem' }}>
                    <CheckCircle size={16} /> Option A: MongoDB Atlas (Cloud)
                  </div>
                  <ol style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                    <li>Sign up free at <a href="https://www.mongodb.com/atlas" target="_blank" rel="noreferrer" style={{ color: '#818cf8' }}>mongodb.com/atlas</a>.</li>
                    <li>Create a free <b>M0 Sandbox Cluster</b>.</li>
                    <li>Under <b>Database Access</b>, create a user & password.</li>
                    <li>Under <b>Network Access</b>, add IP: <code>0.0.0.0/0</code>.</li>
                    <li>Click <b>Connect &gt; Drivers</b> and copy your connection string.</li>
                    <li>Open <code>server/.env</code> and paste it into <code>MONGO_URI</code>!</li>
                  </ol>
                  <button 
                    onClick={copyEnvSample} 
                    className="btn btn-secondary btn-sm" 
                    style={{ marginTop: '0.75rem', fontSize: '0.75rem' }}
                  >
                    {copied ? 'Copied Sample!' : 'Copy Sample Connection String'}
                  </button>
                </div>

                {/* Option B */}
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: '10px', 
                  padding: '1.25rem' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#34d399', marginBottom: '0.5rem' }}>
                    <CheckCircle size={16} /> Option B: Zero-Setup In-Memory Mode
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                    Already configured and ready! If <code>MONGO_URI</code> is blank in <code>server/.env</code>, the server starts an embedded MongoDB instance in RAM.
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                    • Perfect for rapid offline coding & interview prep.<br/>
                    • Supports real Mongoose schemas, queries & aggregations.<br/>
                    • No local installation or cloud accounts required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 1 Stack Health Cards */}
        <div className="grid-cols-3">
          {/* Card 1: Node & Express */}
          <div className="glass-card status-card">
            <div className="status-card-header">
              <div className="status-card-icon" style={{ color: '#8b5cf6' }}>
                <Server size={22} />
              </div>
              <span className="badge badge-connected">Phase 1 Ready</span>
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Express 4 REST API</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Centralized error handling, CORS preflights, Morgan logging, and environment configuration.
              </p>
            </div>
            <div className="code-box">
              GET /api/health &bull; 200 OK
            </div>
          </div>

          {/* Card 2: Database Layer */}
          <div className="glass-card status-card">
            <div className="status-card-header">
              <div className="status-card-icon" style={{ color: '#10b981' }}>
                <Database size={22} />
              </div>
              <span className={`badge ${health?.database?.isConnected ? 'badge-connected' : 'badge-disconnected'}`}>
                {health?.database?.state || 'Connecting...'}
              </span>
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Mongoose 8 ORM</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Resilient connection layer supporting both remote MongoDB clusters and embedded in-memory mode.
              </p>
            </div>
            <div className="code-box">
              Mode: {health?.database?.isInMemory ? 'In-Memory RAM' : (health?.database?.host || 'Standby')}
            </div>
          </div>

          {/* Card 3: React 19 Client */}
          <div className="glass-card status-card">
            <div className="status-card-header">
              <div className="status-card-icon" style={{ color: '#38bdf8' }}>
                <Layers size={22} />
              </div>
              <span className="badge badge-connected">Vite 6 Client</span>
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>React 19 Frontend Shell</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Axios API client with request/response interceptors and dark glassmorphic design system.
              </p>
            </div>
            <div className="code-box">
              Proxy: /api &rarr; :5000
            </div>
          </div>
        </div>

        {/* Live Backend Response Inspector */}
        <section className="glass-card" style={{ marginTop: '2.5rem', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={18} style={{ color: '#38bdf8' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Live API Health Response (GET /api/health)</h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Server Uptime: {health?.uptimeSeconds !== undefined ? `${health.uptimeSeconds}s` : 'N/A'}
            </span>
          </div>

          <div className="code-box" style={{ maxHeight: '200px' }}>
            <pre style={{ margin: 0 }}>
              {loading 
                ? 'Fetching live API health from http://localhost:5000/api/health...' 
                : (error ? `Error: ${error}` : JSON.stringify(health, null, 2))}
            </pre>
          </div>
        </section>

        {/* Next Step / Phase 2 Teaser */}
        <section style={{ 
          marginTop: '2.5rem', 
          background: 'var(--gradient-subtle)', 
          border: '1px solid rgba(99, 102, 241, 0.25)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Up Next: Phase 2
            </div>
            <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>Full-Stack Authentication & Security</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              User model, bcrypt password hashing, JWT issuance & verification, Protected Routes, and Login/Register UI.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-connected">Phase 1 Complete</span>
          </div>
        </section>
      </main>
    </div>
  );
}
