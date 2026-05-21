import { useState } from 'react';
import { 
  Upload, 
  Video, 
  ArrowUpRight,
  Calendar,
  PieChart,
  Clock,
  Sparkles
} from 'lucide-react';
import './DashboardView.css';

export default function DashboardView({ 
  stats, 
  calls, 
  loading, 
  onStartCall, 
  onWatchTutorial, 
  getInitials 
}) {
  
  const formatDuration = (totalSeconds) => {
    if (!totalSeconds || totalSeconds === 0) return '0';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}sec`;
    }
    return `${minutes}m ${seconds}sec`;
  };

  
  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  
  const formatDateHeading = (dateStr) => {
    const d = new Date(dateStr);
    const month = d.toLocaleDateString('en-US', { month: 'long' });
    const day = d.getDate();
    return `${month} ${getOrdinal(day)}`;
  };

  
  const formatCallTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  };

  
  const getRelativeTime = (dateStr) => {
    if (!dateStr) return '-';
    const now = new Date();
    const past = new Date(dateStr);
    const diffTime = now - past;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  
  const groupCallsByDate = (callList) => {
    if (!callList || callList.length === 0) return {};
    return callList.reduce((groups, call) => {
      const dateKey = formatDateHeading(call.started_at);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(call);
      return groups;
    }, {});
  };

  const groupedCalls = groupCallsByDate(calls);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: 'var(--text-secondary)' }}>
        <span>Loading dashboard data...</span>
      </div>
    );
  }

  
  const lastSessionStr = stats?.lastSession && stats.lastSession.length > 0 
    ? getRelativeTime(stats.lastSession[0]) 
    : '-';

  
  const isEmpty = !calls || calls.length === 0;

  return (
    <div className="dashboard-grid animate-fade-in">
      
      
      <section className="stats-grid">
        
        <div className="stat-card">
          <div className="stat-icon red">
            <PieChart size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Sessions</div>
            <div className="stat-value">{stats?.totalSessions || 0}</div>
          </div>
        </div>

        
        <div className="stat-card">
          <div className="stat-icon green">
            <Clock size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Average Duration</div>
            <div className="stat-value">{formatDuration(stats?.averageDuration)}</div>
          </div>
        </div>

        
        <div className="stat-card">
          <div className="stat-icon green">
            <Sparkles size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-label">AI Used</div>
            <div className="stat-value">
              {stats?.totalAIInteractions || 0}
              {stats?.totalAIInteractions > 0 && <span className="stat-unit"> times</span>}
            </div>
          </div>
        </div>

        
        <div className="stat-card">
          <div className="stat-icon blue">
            <Calendar size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Last Session</div>
            <div className="stat-value" style={{ fontSize: lastSessionStr.length > 5 ? '1.1rem' : '1.5rem' }}>{lastSessionStr}</div>
          </div>
        </div>
      </section>

      
      <section className="recent-calls-section">
        <h2 className="section-title">Recent calls</h2>

        {!isEmpty ? (
          <div className="calls-list">
            {Object.keys(groupedCalls).map((dateHeading) => (
              <div key={dateHeading} className="calls-date-group">
                
                <div className="calls-date-heading">{dateHeading}</div>
                
                
                {groupedCalls[dateHeading].map((call) => (
                  <div key={call._id} className="call-entry">
                    <div className="call-entry-avatar">{getInitials(call.client || (call.participants && call.participants[0]?.name) || '')}</div>
                    <div className="call-entry-info">
                      <span className="call-entry-name">{call.description || call.client}</span>
                      <div className="call-entry-meta">
                        <span className="call-entry-time">{formatCallTime(call.started_at)}</span>
                        {call.ai_interactions !== undefined && (
                          <>
                            <span className="meta-separator">•</span>
                            <span className="call-entry-ai">{call.ai_interactions} AI Interactions</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          
          <div className="empty-calls-card animate-scale-in">
            <div className="empty-icon-wrapper">
              <Calendar size={28} />
            </div>
            <h3 className="empty-calls-title">No Recent Calls</h3>
            <p className="empty-calls-desc">
              Connect your Google Calendar to see upcoming meetings, get reminders, and join calls directly from Hintro.
            </p>
            <div className="empty-actions">
              <button className="btn-outline-sm" onClick={onStartCall}>
                Start a Call
              </button>
            </div>
          </div>
        )}
      </section>

      
      {isEmpty && (
        <section className="how-it-works-section">
          <h2 className="section-title">How it works</h2>
          <div className="steps-grid">
            
            
            <div className="step-card">
              <span className="step-badge">STEP 1</span>
              <div className="step-icon-wrapper">
                <Upload size={20} />
              </div>
              <h3 className="step-title">Upload Document</h3>
              <p className="step-desc">
                Add files for instant answers in meetings
              </p>
              <button className="step-btn" onClick={() => alert('Knowledge Base upload flow will open here!')}>
                Upload
              </button>
            </div>

            
            <div className="step-card">
              <span className="step-badge">STEP 2</span>
              <div className="step-icon-wrapper">
                <Video size={20} />
              </div>
              <h3 className="step-title">Start a call</h3>
              <p className="step-desc">
                Get real-time AI assistance in your meeting
              </p>
              <button className="step-btn" onClick={onStartCall}>
                Start New Call
              </button>
            </div>

            
            <div className="step-card">
              <span className="step-badge">STEP 3</span>
              <div className="step-icon-wrapper">
                <ArrowUpRight size={20} />
              </div>
              <h3 className="step-title">View Insights</h3>
              <p className="step-desc">
                Review notes and action items after the call
              </p>
              <button className="step-btn" onClick={() => alert('Navigating to detailed call insights views.')}>
                View Insights
              </button>
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
