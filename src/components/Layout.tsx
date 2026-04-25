"use client";
import React, { useState } from 'react';
import { LayoutDashboard, Utensils, Moon, Activity, MessageSquare, Settings, User } from 'lucide-react';
import MealTracker from './MealTracker';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMealModalOpen, setMealModalOpen] = useState(false);

  return (
    <div className="layout-container bg-gradient-mesh">
      <aside className="sidebar glass">
        <div className="logo">
          <div className="logo-icon">HF</div>
          <span>HealthForge</span>
        </div>
        
        <nav className="nav-menu">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<Utensils size={20} />} label="Nutrition" />
          <NavItem icon={<Moon size={20} />} label="Sleep" />
          <NavItem icon={<Activity size={20} />} label="Fitness" />
          <NavItem icon={<MessageSquare size={20} />} label="AI Assistant" />
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
          <h1>Welcome back, Harsh</h1>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => setMealModalOpen(true)}>Track Meal</button>
          </div>
        </header>
        <div className="content-scroll">
          {children}
        </div>
      </main>
      <MealTracker isOpen={isMealModalOpen} onClose={() => setMealModalOpen(false)} />
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`nav-item ${active ? 'active' : ''}`}>
    {icon}
    <span>{label}</span>
  </div>
);

export default Layout;
