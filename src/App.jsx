import { useState, useEffect } from 'react';
import { api } from './api';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import FeedbackHistoryView from './components/FeedbackHistoryView';
import FeedbackModal from './components/FeedbackModal';
import LoginView from './components/LoginView';
import { Sparkles } from 'lucide-react';
import './App.css';


const FALLBACKS = {
  u1: {
    profile: {
      id: "u1",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      login_method: "google",
      status: "active"
    },
    dashboard: {
      user: {},
      subscription: null,
      usage: {
        kb_files: { used: 0, limit: 100, percentage: 0 },
        vocab_terms: 0,
        notes: 0
      }
    },
    stats: {
      totalSessions: 0,
      averageDuration: 0,
      totalAIInteractions: 0,
      lastSession: []
    },
    history: []
  },
  u2: {
    profile: {
      id: "u2",
      email: "jane.smith@example.com",
      firstName: "Jane",
      lastName: "Smith",
      login_method: "google",
      status: "active"
    },
    dashboard: {
      user: {},
      subscription: {
        plan: "professional",
        billing_cycle: "monthly",
        status: "active"
      },
      usage: {
        kb_files: { used: 340, limit: 1000, percentage: 34 },
        vocab_terms: 104,
        notes: 24
      }
    },
    stats: {
      totalSessions: 126,
      averageDuration: 2211,
      totalAIInteractions: 16,
      lastSession: [
        new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      ]
    },
    history: [
      {
        _id: "cs1",
        user_id: "u2",
        status: "ended",
        client: "Acme Corp",
        description: "Design Call",
        started_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        ended_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600 * 1000).toISOString(),
        total_duration_seconds: 3600,
        language: ["en"],
        ai_interactions: 6,
        participants: [
          { name: "Jane Smith", isUser: true },
          { name: "Client", isUser: false }
        ]
      },
      {
        _id: "cs2",
        user_id: "u2",
        status: "ended",
        client: "TechStart",
        description: "Sales Call",
        started_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1800 * 1000).toISOString(),
        ended_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3000 * 1000).toISOString(),
        total_duration_seconds: 1200,
        language: ["en"],
        ai_interactions: 3,
        participants: [
          { name: "Jane Smith", isUser: true },
          { name: "TechStart Lead", isUser: false }
        ]
      },
      {
        _id: "cs3",
        user_id: "u2",
        status: "ended",
        client: "BigCorp",
        description: "Design Call",
        started_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        ended_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2400 * 1000).toISOString(),
        total_duration_seconds: 2400,
        language: ["en"],
        ai_interactions: 4,
        participants: [
          { name: "Jane Smith", isUser: true },
          { name: "BigCorp PM", isUser: false }
        ]
      },
      {
        _id: "cs4",
        user_id: "u2",
        status: "ended",
        client: "StartupXYZ",
        description: "Sales Call",
        started_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 1800 * 1000).toISOString(),
        ended_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3600 * 1000).toISOString(),
        total_duration_seconds: 1800,
        language: ["en"],
        ai_interactions: 2,
        participants: [
          { name: "Jane Smith", isUser: true },
          { name: "StartupXYZ CTO", isUser: false }
        ]
      }
    ]
  }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('u2');
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState(null);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    loadFeedbacks();
  }, []);

  
  useEffect(() => {
    const stored = localStorage.getItem('hintro_isLoggedIn');
    const storedUser = localStorage.getItem('hintro_userId');
    if (stored === 'true' && storedUser) {
      setIsLoggedIn(true);
      setUserId(storedUser);
    }
  }, []);

  
  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData();
    }
  }, [userId, isLoggedIn]);

  const loadFeedbacks = () => {
    try {
      const stored = localStorage.getItem('hintro_feedbacks');
      setFeedbacks(stored ? JSON.parse(stored) : []);
    } catch (err) {
      console.error('Error loading feedbacks:', err);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profileRes, dashRes, statsRes, historyRes] = await Promise.allSettled([
        api.getProfile(userId),
        api.getDashboard(userId),
        api.getStats(userId),
        api.getCallHistory(userId, 10)
      ]);

      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value);
      } else {
        setProfile(FALLBACKS[userId].profile);
      }

      if (dashRes.status === 'fulfilled') {
        setDashboardData(dashRes.value);
      } else {
        setDashboardData(FALLBACKS[userId].dashboard);
      }

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value);
      } else {
        setStats(FALLBACKS[userId].stats);
      }

      if (historyRes.status === 'fulfilled') {
        setCalls(historyRes.value.callSessions || []);
      } else {
        setCalls(FALLBACKS[userId].history);
      }
    } catch (err) {
      console.error('Failed to fetch data, applying full mock fallback:', err);
      applyFallbacks();
    } finally {
      setLoading(false);
    }
  };

  const applyFallbacks = () => {
    setProfile(FALLBACKS[userId].profile);
    setDashboardData(FALLBACKS[userId].dashboard);
    setStats(FALLBACKS[userId].stats);
    setCalls(FALLBACKS[userId].history);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('hintro_isLoggedIn', 'true');
    localStorage.setItem('hintro_userId', userId);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    setIsLoggedIn(false);
    localStorage.removeItem('hintro_isLoggedIn');
    setActiveView('dashboard');
  };

  const handleStartNewCall = () => {
    alert('Launching real-time Hintro call session environment...');
  };

  const handleWatchTutorial = () => {
    alert('Opening tutorial overlay video...');
  };

  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  };

  
  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      
      
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        profile={profile}
        dashboardData={dashboardData}
        onLogout={handleLogout}
        onOpenFeedbackModal={() => setFeedbackModalOpen(true)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      
      <main className="main-content">
        
        
        <Navbar 
          profile={profile}
          userId={userId}
          onUserChange={(newId) => {
            setUserId(newId);
          }}
          onStartNewCall={handleStartNewCall}
          onLogout={handleLogout}
          showLogoutConfirm={showLogoutConfirm}
          setShowLogoutConfirm={setShowLogoutConfirm}
        />

        
        <div className="main-content-body">
          {activeView === 'dashboard' && (
            <DashboardView 
              stats={stats}
              calls={calls}
              loading={loading}
              onStartCall={handleStartNewCall}
              onWatchTutorial={handleWatchTutorial}
              getInitials={getInitials}
            />
          )}

          {activeView === 'feedback-history' && (
            <FeedbackHistoryView 
              feedbacks={feedbacks}
              onOpenFeedback={() => setFeedbackModalOpen(true)}
            />
          )}

          {activeView !== 'dashboard' && activeView !== 'feedback-history' && (
            <div className="glass animate-fade-in" style={{ padding: '60px 40px', textAlign: 'center' }}>
              <Sparkles size={48} style={{ color: 'var(--accent-primary)', marginBottom: '20px' }} />
              <h2 className="section-title" style={{ marginBottom: '10px', textTransform: 'capitalize' }}>{activeView.replace(/-/g, ' ')}</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', fontSize: '0.92rem' }}>
                This section is a structural placeholder. Toggle to <strong>Dashboard</strong> or <strong>Feedback History</strong> to explore interactive mock behaviors.
              </p>
            </div>
          )}
        </div>

      </main>

      
      <FeedbackModal 
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onFeedbackAdded={loadFeedbacks}
      />

    </div>
  );
}


// temporary context shell config
