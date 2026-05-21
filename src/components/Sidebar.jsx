import { 
  LayoutDashboard, 
  PhoneCall, 
  FileText, 
  MessageSquare, 
  Globe, 
  History, 
  MessageSquarePlus, 
  Zap, 
  Download,
  Info,
  X,
  Menu
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ 
  activeView, 
  setActiveView, 
  profile, 
  dashboardData,
  onLogout,
  onOpenFeedbackModal,
  mobileOpen,
  setMobileOpen
}) {
  const mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'call-insights', label: 'Call Insights', icon: PhoneCall },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: FileText, hasInfo: true },
    { id: 'prompts', label: 'Prompts', icon: MessageSquare, hasInfo: true },
    { id: 'boxy-controls', label: 'Boxy Controls', icon: Globe, hasInfo: true },
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    setMobileOpen(false);
  };

  return (
    <>
      
      <div className="mobile-nav-header">
        <span className="sidebar-logo" style={{ marginBottom: 0, paddingLeft: 0 }}>Hintro</span>
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">Hintro</div>
        
        <nav className="sidebar-nav">
          
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`sidebar-nav-item ${activeView === item.id ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.hasInfo && (
                  <Info size={14} className="nav-info-icon" />
                )}
              </button>
            );
          })}

          
          <div style={{ flexGrow: 1 }} />

          
          <button
            onClick={() => handleNavClick('feedback-history')}
            className={`sidebar-nav-item ${activeView === 'feedback-history' ? 'active' : ''}`}
          >
            <History size={18} />
            <span>Feedback History</span>
          </button>

          
          <button
            onClick={() => {
              onOpenFeedbackModal();
              setMobileOpen(false);
            }}
            className="sidebar-nav-item"
          >
            <MessageSquarePlus size={18} />
            <span>Feedback</span>
          </button>
        </nav>

        
        <button
          onClick={() => alert('Upgrade modal is under development! Stay tuned.')}
          className="sidebar-upgrade-btn"
        >
          Upgrade
        </button>

        
        <div className="sidebar-footer">
          © 2025 Hintro
        </div>
      </aside>
    </>
  );
}
