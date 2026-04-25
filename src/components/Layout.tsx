"use client";
import React, { useState } from 'react';
import { LayoutDashboard, Utensils, Moon, Activity, MessageSquare, Settings, User, Clock, Menu, X } from 'lucide-react';
import Dashboard from './Dashboard';
import NutritionSection from './NutritionSection';
import SleepSection from './SleepSection';
import FitnessSection from './FitnessSection';
import HistorySection from '@/components/HistorySection';
import AIChat from './AIChat';
import MealTracker from './MealTracker';
import './Layout.css';
import '../styles/marker-colors.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMealModalOpen, setMealModalOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    closeSidebar();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <Dashboard />;
      case 'Nutrition': return <NutritionSection />;
      case 'Sleep': return <SleepSection />;
      case 'Fitness': return <FitnessSection />;
      case 'History': return <HistorySection />;
      case 'AI Assistant': return (
        <div className="section-container animate-fade-in ai-full-page">
          <AIChat />
        </div>
      );
      case 'Settings': return (
        <div className="section-container animate-fade-in">
          <div className="metric-card glass settings-placeholder">
             <Settings className="settings-icon" size={40} />
             <h2>Settings & Preferences</h2>
             <p>Account configuration, notification preferences, and API keys will be managed here.</p>
             <button className="btn-primary back-btn" onClick={() => setActiveTab('Dashboard')}>Back to Dashboard</button>
          </div>
        </div>
      );
      default: return <Dashboard />;
    }
  };

  return (
    <div className={`layout-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={`sidebar glass ${isSidebarOpen ? 'open' : ''}`}>
        <div className="logo">
          <div className="logo-flex">
            <div className="logo-icon">HF</div>
            <span>HealthForge</span>
          </div>
          <button className="sidebar-close" onClick={closeSidebar} aria-label="Close Menu">
            <X size={24} />
          </button>
        </div>
        
        <nav className="nav-menu">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'Dashboard'} 
            onClick={() => handleTabChange('Dashboard')}
          />
          <NavItem 
            icon={<Utensils size={20} />} 
            label="Nutrition" 
            active={activeTab === 'Nutrition'} 
            onClick={() => handleTabChange('Nutrition')}
          />
          <NavItem 
            icon={<Moon size={20} />} 
            label="Sleep" 
            active={activeTab === 'Sleep'} 
            onClick={() => handleTabChange('Sleep')}
          />
          <NavItem 
            icon={<Activity size={20} />} 
            label="Fitness" 
            active={activeTab === 'Fitness'} 
            onClick={() => handleTabChange('Fitness')}
          />
          <NavItem 
            icon={<Clock size={20} />} 
            label="History" 
            active={activeTab === 'History'} 
            onClick={() => handleTabChange('History')}
          />
          <NavItem 
            icon={<MessageSquare size={20} />} 
            label="AI Assistant" 
            active={activeTab === 'AI Assistant'} 
            onClick={() => handleTabChange('AI Assistant')}
          />
        </nav>

        <div className="sidebar-footer">
          <NavItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={activeTab === 'Settings'}
            onClick={() => handleTabChange('Settings')}
          />
          <div 
            className="user-profile clickable" 
            onClick={() => setLogoutModalOpen(true)}
            title="Click to Logout"
          >
            <div className="avatar glass">
              <User size={18} />
            </div>
            <div className="user-info">
              <span className="user-name">Harsh Shirke</span>
              <span className="user-status">Premium</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          {!isSidebarOpen && (
            <button 
              className="menu-toggle" 
              onClick={toggleSidebar}
              title="Toggle Sidebar Menu"
              aria-label="Toggle Sidebar Menu"
            >
              <Menu size={24} />
            </button>
          )}
          <h1>
            <span 
              className={`marker-highlight marker-${activeTab.toLowerCase().split(' ')[0]}`}
            >
              {activeTab === 'Dashboard' ? 'Welcome back, Harsh' : activeTab}
            </span>
          </h1>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => setMealModalOpen(true)}>Track Meal</button>
          </div>
        </header>
        <div className="content-scroll">
          {renderContent()}
        </div>
      </main>
      <MealTracker isOpen={isMealModalOpen} onClose={() => setMealModalOpen(false)} />

      {isLogoutModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass animate-slide-up">
            <div className="modal-header">
              <h2>Ready to leave?</h2>
              <button className="close-btn" onClick={() => setLogoutModalOpen(false)}>×</button>
            </div>
            <p className="modal-warning-text">
              Are you sure you want to log out of your session? You will need to sign back in to access your data.
            </p>
            <div className="modal-actions-row">
              <button 
                className="btn-secondary modal-action-btn" 
                onClick={() => setLogoutModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary modal-action-btn logout-danger-btn" 
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/login';
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
    <div 
      className={`nav-item ${active ? 'active' : ''}`} 
      onClick={onClick}
    >
    {icon}
    <span>{label}</span>
  </div>
);

export default Layout;
