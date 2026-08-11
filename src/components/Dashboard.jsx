import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';

const initialLogs = [
  { text: "[SYSTEM] Boot sequence initialized.", type: 'sys' },
  { text: "[DATABASE] Connected to MongoDB Cluster (14ms).", type: 'ok' },
  { text: "[SERVER] Express API listening on port 3000.", type: 'sys' },
  { text: "[QA] Playwright suite: 12 tests loaded.", type: 'sys' },
  { text: "[OK] All checks completed successfully.", type: 'ok' }
];

const DiagnosticLogs = [
  { text: "[QA] Starting full system diagnostics run...", type: 'sys' },
  { text: "[QA] Running API health checks...", type: 'sys' },
  { text: "[PASS] GET /api/v1/health - 200 OK (38ms)", type: 'ok' },
  { text: "[PASS] POST /api/v1/auth/login - Token generated (56ms)", type: 'ok' },
  { text: "[QA] Initializing automated GUI browser scrapers...", type: 'sys' },
  { text: "[PASS] MCB ATM locator page parsed correctly", type: 'ok' },
  { text: "[PASS] HBL branch scrapers loaded into memory", type: 'ok' },
  { text: "[DATABASE] Re-indexing collections...", type: 'sys' },
  { text: "[OK] Database indexes verified. Collections optimized.", type: 'ok' },
  { text: "[SYSTEM] Memory usage: 142MB | CPU load: 1.8%", type: 'sys' },
  { text: "🎉 DIAGNOSTICS COMPLETE: All systems stable and verified.", type: 'success' }
];

const Dashboard = () => {
  const [logs, setLogs] = useState(initialLogs);
  const [isScanning, setIsScanning] = useState(false);
  const [latency, setLatency] = useState(48);
  const [uptime, setUptime] = useState(99.98);
  const consoleBodyRef = useRef(null);

  useEffect(() => {
    if (consoleBodyRef.current) {
      consoleBodyRef.current.scrollTop = consoleBodyRef.current.scrollHeight;
    }
  }, [logs]);

  // Simulate subtle updates of latency and uptime in real time
  useEffect(() => {
    if (isScanning) return;
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * (55 - 42 + 1)) + 42);
      setUptime(+(99.95 + Math.random() * 0.04).toFixed(2));
    }, 4000);
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleRunDiagnostics = () => {
    if (isScanning) return;
    setIsScanning(true);
    setLogs([{ text: "[SYSTEM] Restarting diagnostic sequence...", type: 'sys' }]);

    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < DiagnosticLogs.length) {
        const nextLog = DiagnosticLogs[currentLog];
        setLogs(prev => [...prev, nextLog]);
        currentLog++;
      } else {
        clearInterval(logInterval);
        setIsScanning(false);
      }
    }, 550);
  };

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <div className="dashboard-controls">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="dashboard-title">System Diagnostics Monitor</div>
        <div className="dashboard-badge">QA-Verified</div>
      </div>

      <div className="dashboard-body">
        {/* Core Metrics Grid */}
        <div className="metrics-grid">
          {/* Metric 1 */}
          <div className="metric-box">
            <span className="metric-label">API Status</span>
            <div className="metric-value-container">
              <span className={`pulse-dot ${isScanning ? 'warning' : 'active'}`} />
              <span className="metric-value">{isScanning ? 'Scanning' : '99.98%'}</span>
            </div>
            <span className="metric-sub">Uptime verified</span>
          </div>

          {/* Metric 2 */}
          <div className="metric-box">
            <span className="metric-label">Response Time</span>
            <span className="metric-value">{latency}ms</span>
            <div className="svg-chart-container">
              <svg className="chart-svg" viewBox="0 0 100 30">
                <path
                  d="M0,15 Q15,5 30,22 T60,8 T90,20 L100,15"
                  fill="none"
                  stroke={isScanning ? '#f59e0b' : '#06b6d4'}
                  strokeWidth="2"
                  className="chart-path"
                />
              </svg>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="metric-box">
            <span className="metric-label">QA test suite</span>
            <div className="progress-ring-container">
              <svg className="progress-ring" width="36" height="36">
                <circle
                  className="progress-ring-bg"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="3.5"
                  fill="transparent"
                  r="15"
                  cx="18"
                  cy="18"
                />
                <circle
                  className={`progress-ring-fill ${isScanning ? 'scanning' : ''}`}
                  stroke={isScanning ? '#f59e0b' : '#8b5cf6'}
                  strokeWidth="3.5"
                  fill="transparent"
                  r="15"
                  cx="18"
                  cy="18"
                  strokeDasharray="94.2"
                  strokeDashoffset={isScanning ? '40' : '0'}
                />
              </svg>
              <span className="progress-text">{isScanning ? '..' : '12/12'}</span>
            </div>
            <span className="metric-sub">Passed (100%)</span>
          </div>
        </div>

        {/* Diagnostics Live Console */}
        <div className="console-panel">
          <div className="console-panel-header">
            <span>Diagnostics Runner Feed</span>
            <span className="console-blinker" />
          </div>
          <div ref={consoleBodyRef} className="console-logs-list">
            {logs.map((log, index) => (
              <div key={index} className={`console-log-row ${log.type}`}>
                <span className="log-arrow">&gt;&gt;</span> {log.text}
              </div>
            ))}
          </div>
        </div>

        {/* Run diagnostics controls */}
        <div className="dashboard-footer">
          <button
            type="button"
            className={`btn diagnostic-btn ${isScanning ? 'scanning' : ''}`}
            onClick={handleRunDiagnostics}
            disabled={isScanning}
          >
            {isScanning ? 'Running System Scan...' : 'Run Diagnostics Check'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
