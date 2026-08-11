import React, { useState, useEffect, useRef } from 'react';
import './BugHunter.css';

const initialLines = [
  { line: 1, text: "import React, { useState } from 'react';", type: 'normal' },
  { line: 2, text: "", type: 'normal' },
  { line: 3, text: "function MaintenanceScheduler({ user }) {", type: 'normal' },
  { line: 4, text: "  const [slots, setSlots] = useState(null);", type: 'normal' },
  { line: 5, text: "  // BUG 1: Accessing property of null state without optional check", type: 'comment' },
  { line: 6, text: "  const totalSlots = slots.length;", type: 'bug', bugId: 1, resolvedText: "  const totalSlots = slots?.length || 0; // FIXED!" },
  { line: 7, text: "", type: 'normal' },
  { line: 8, text: "  const handleSelectSlot = (slotId) => {", type: 'normal' },
  { line: 9, text: "    // BUG 2: Variable assignment '=' instead of comparison '==='", type: 'comment' },
  { line: 10, text: "    if (user.role = 'admin') {", type: 'bug', bugId: 2, resolvedText: "    if (user.role === 'admin') { // FIXED!" },
  { line: 11, text: "      alert('Slot selected by admin!');", type: 'normal' },
  { line: 12, text: "    }", type: 'normal' },
  { line: 13, text: "  };", type: 'normal' },
  { line: 14, text: "", type: 'normal' },
  { line: 15, text: "  return (", type: 'normal' },
  { line: 16, text: "    <div className='slots-grid'>", type: 'normal' },
  { line: 17, text: "      {/* BUG 3: Missing closing bracket in jsx mapping */}", type: 'comment' },
  { line: 18, text: "      {slots.map(s => <button key={s.id}>{s.time}</button>)", type: 'bug', bugId: 3, resolvedText: "      {slots?.map(s => <button key={s.id}>{s.time}</button>)} // FIXED!" },
  { line: 19, text: "    </div>", type: 'normal' },
  { line: 20, text: "  );", type: 'normal' },
  { line: 21, text: "}", type: 'normal' }
];

const BugHunter = () => {
  const [resolvedBugs, setResolvedBugs] = useState([]);
  const [showHints, setShowHints] = useState(false);
  const [logs, setLogs] = useState([
    { text: "[SYSTEM] Bug Hunter sandbox initialized. Code loaded.", type: 'sys' },
    { text: "[SYSTEM] Objective: Locate and click the 3 buggy lines of code.", type: 'sys' },
    { text: "", type: 'empty' }
  ]);
  const [isCompleted, setIsCompleted] = useState(false);
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleLineClick = (lineObj) => {
    if (isCompleted) return;

    if (lineObj.type === 'bug') {
      const bugId = lineObj.bugId;
      if (resolvedBugs.includes(bugId)) return;

      const newResolved = [...resolvedBugs, bugId];
      setResolvedBugs(newResolved);

      // Log success
      setLogs(prev => [
        ...prev,
        { text: `[OK] Squash! Resolved Bug #${bugId} on Line ${lineObj.line}.`, type: 'ok' }
      ]);

      if (newResolved.length === 3) {
        setIsCompleted(true);
        setLogs(prev => [
          ...prev,
          { text: "🎉 CONGRATULATIONS! All bugs fixed. QA compilation successful.", type: 'success' }
        ]);
      }
    } else if (lineObj.type !== 'comment' && lineObj.text !== "") {
      setLogs(prev => [
        ...prev,
        { text: `[WARN] Line ${lineObj.line} is verified stable. No issues detected.`, type: 'warn' }
      ]);
    }
  };

  const handleReset = () => {
    setResolvedBugs([]);
    setIsCompleted(false);
    setShowHints(false);
    setLogs([
      { text: "[SYSTEM] Sandbox reset. Code reloaded.", type: 'sys' },
      { text: "[SYSTEM] Locate and click the 3 buggy lines of code.", type: 'sys' },
      { text: "", type: 'empty' }
    ]);
  };

  return (
    <section id="bughunter" className="bughunter">
      <div className="bughunter-container">
        <div className="section-header">
          <h2 className="section-title">QA Debugging Sandbox</h2>
          <div className="section-divider"></div>
        </div>

        <div className="bughunter-grid">
          {/* Editor Column */}
          <div className="editor-panel">
            <div className="editor-header">
              <span className="editor-tab active">MaintenanceScheduler.jsx</span>
              <span className="editor-lang">JavaScript (React)</span>
            </div>
            <div className="editor-body">
              {initialLines.map((lineObj) => {
                const isBugResolved = lineObj.type === 'bug' && resolvedBugs.includes(lineObj.bugId);
                const displayStyle = lineObj.type === 'comment' ? 'comment' : lineObj.type === 'bug' ? 'bug-line' : 'normal-line';
                const resolvedClass = isBugResolved ? 'resolved' : '';
                const squiggleClass = (showHints && lineObj.type === 'bug' && !isBugResolved) ? 'squiggle-hint' : '';

                return (
                  <div
                    key={lineObj.line}
                    className={`editor-row ${displayStyle} ${resolvedClass} ${squiggleClass}`}
                    onClick={() => handleLineClick(lineObj)}
                  >
                    <span className="line-num">{lineObj.line}</span>
                    <span className="line-code">
                      {isBugResolved ? lineObj.resolvedText : lineObj.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Console / Output Column */}
          <div className="console-panel-right">
            <div className="console-panel-header-right">
              <span>Interactive QA Console Feed</span>
              <span className="console-badge">{resolvedBugs.length}/3 Fixed</span>
            </div>
            <div className="console-panel-body-right">
              {logs.map((log, index) => (
                <div key={index} className={`console-row-right ${log.type}`}>
                  {log.text && <span className="console-arrow-right">&gt;</span>} {log.text}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>

            {showHints && (
              <div className="hints-box">
                <span className="hints-title">💡 Bug Investigation Hints:</span>
                <ul className="hints-list">
                  <li><strong>Line 6:</strong> Accessing <code>.length</code> on null state.</li>
                  <li><strong>Line 10:</strong> Variable assignment <code>=</code> instead of comparison <code>===</code>.</li>
                  <li><strong>Line 18:</strong> Missing closing curly bracket <code>&#125;</code> in map expression.</li>
                </ul>
              </div>
            )}

            {isCompleted ? (
              <div className="success-badge-card">
                <div className="badge-icon">🎖️</div>
                <div className="badge-details">
                  <h4>QA Certified Debugger</h4>
                  <p>Verified by Talal Irfan</p>
                </div>
                <button type="button" className="btn reset-btn" onClick={handleReset}>
                  Test Again
                </button>
              </div>
            ) : (
              <div className="console-footer-right">
                <button
                  type="button"
                  className={`btn hint-btn ${showHints ? 'active' : ''}`}
                  onClick={() => setShowHints(!showHints)}
                >
                  {showHints ? 'Hide Hints' : 'Need a Hint?'}
                </button>
                <button type="button" className="btn reset-btn" onClick={handleReset}>
                  Reset Sandbox
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BugHunter;
