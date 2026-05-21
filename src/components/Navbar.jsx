import { useState, useEffect } from 'react';
import { Play, ChevronDown, LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ 
  profile, 
  userId, 
  onUserChange,
  onStartNewCall,
  onLogout,
  showLogoutConfirm,
  setShowLogoutConfirm
}) {
  const firstName = profile?.firstName || 'User';
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!showDropdown) return;
    const handleClose = () => setShowDropdown(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [showDropdown]);

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <div className="navbar-page-title">Dashboard</div>
          <div className="navbar-greeting">
            <h1 className="navbar-title">
              Hi, {firstName} 👋 Welcome to Hintro
            </h1>
            <p className="navbar-subtitle">
              Ready to make your next call smarter ?
            </p>
          </div>
        </div>

        <div className="navbar-right">
          
          <div className="user-switcher" title="Toggle mock data state">
            <span className="user-switcher-label">User</span>
            <button 
              className={`user-switcher-btn ${userId === 'u1' ? 'active' : ''}`}
              onClick={() => onUserChange('u1')}
            >
              Empty (u1)
            </button>
            <button 
              className={`user-switcher-btn ${userId === 'u2' ? 'active' : ''}`}
              onClick={() => onUserChange('u2')}
            >
              Active (u2)
            </button>
          </div>

          
          <button 
            className="btn-watch-tutorial" 
            onClick={() => alert('Tutorial video player modal will open here!')}
          >
            <span className="play-icon">
              <Play size={10} fill="currentColor" />
            </span>
            <span>Watch Tutorial</span>
          </button>

          
          <button 
            className="btn-start-call" 
            onClick={onStartNewCall}
          >
            Start New Call
          </button>

          
          <div 
            className="navbar-avatar-container"
            style={{ position: 'relative' }}
          >
            <div 
              className="navbar-avatar"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              title="Account options"
            >
              <div className="navbar-avatar-img">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <ChevronDown size={14} className="navbar-avatar-chevron" />
            </div>

            {showDropdown && (
              <div className="profile-dropdown animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="profile-dropdown-item"
                  onClick={() => {
                    setShowDropdown(false);
                    setShowLogoutConfirm(true);
                  }}
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      
      {showLogoutConfirm && (
        <div className="logout-overlay animate-fade-in" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-card animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="logout-title">Leaving already?</h2>
            <p className="logout-desc">
              You can log back in anytime to continue your meetings with Hintro.
            </p>
            <div className="logout-actions">
              <button className="btn-secondary" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={onLogout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
