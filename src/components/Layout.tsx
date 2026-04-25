"use client";
import React, { useState } from 'react';
import { LayoutDashboard, Utensils, Moon, Activity, MessageSquare, Settings, User, Clock } from 'lucide-react';
import Dashboard from './Dashboard';
import NutritionSection from './NutritionSection';
import SleepSection from './SleepSection';
import FitnessSection from './FitnessSection';
import HistorySection from './HistorySection';

import AIChat from './AIChat';
import MealTracker from './MealTracker';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMealModalOpen, setMealModalOpen] = useState(false);

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
      default: return <Dashboard />;
    }
  };

  return (
    <div className="layout-container bg-gradient-mesh">
      <aside className="sidebar glass">
        <div className="logo">
          <div className="logo-icon">HF</div>
          <span>HealthForge</span>
        </div>
        
        <nav className="nav-menu">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'Dashboard'} 
            onClick={() => setActiveTab('Dashboard')}
          />
          <NavItem 
            icon={<Utensils size={20} />} 
            label="Nutrition" 
            active={activeTab === 'Nutrition'} 
            onClick={() => setActiveTab('Nutrition')}
          />
          <NavItem 
            icon={<Moon size={20} />} 
            label="Sleep" 
            active={activeTab === 'Sleep'} 
            onClick={() => setActiveTab('Sleep')}
          />
          <NavItem 
            icon={<Activity size={20} />} 
            label="Fitness" 
            active={activeTab === 'Fitness'} 
            onClick={() => setActiveTab('Fitness')}
          />
          <NavItem 
            icon={<Clock size={20} />} 
            label="History" 
            active={activeTab === 'History'} 
            onClick={() => setActiveTab('History')}
          />
          <NavItem 
            icon={<MessageSquare size={20} />} 
            label="AI Assistant" 
            active={activeTab === 'AI Assistant'} 
            onClick={() => setActiveTab('AI Assistant')}
          />
        </nav>

        <div className="sidebar-footer">
          <NavItem icon={<Settings size={20} />} label="Settings" />
          <div className="user-profile">
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
          <h1>{activeTab === 'Dashboard' ? 'Welcome back, Harsh' : activeTab}</h1>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => setMealModalOpen(true)}>Track Meal</button>
          </div>
        </header>
        <div className="content-scroll">
          {renderContent()}
        </div>
      </main>
      <MealTracker isOpen={isMealModalOpen} onClose={() => setMealModalOpen(false)} />
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
