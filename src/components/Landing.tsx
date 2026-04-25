"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Activity, Brain, Shield, Zap, CheckCircle2 } from 'lucide-react';
import './Landing.css';

const Landing: React.FC = () => {
  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav animate-fade-in">
        <div className="landing-logo">
          <div className="logo-icon">HF</div>
          <span>HealthForge</span>
        </div>
        <div className="nav-links">
          <Link href="#features">Features</Link>
          <Link href="#science">Science</Link>
          <Link href="/login" className="btn-secondary">Login</Link>
          <Link href="/signup" className="btn-primary-landing">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content animate-fade-in">
          <div className="badge">AI-Powered Health Intelligence</div>
          <h1>Forge Your <span className="gradient-text">Ultimate Self</span></h1>
          <p>
            The next generation of personalized health tracking. 
            Integrated AI insights, real-time nutrition analysis, and 
            bio-metric precision in one stunning dashboard.
          </p>
          <div className="hero-actions">
            <Link href="/signup" className="btn-primary-landing large">
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link href="#demo" className="btn-outline-landing large">
              Watch Demo
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">5+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">99%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">AI</span>
              <span className="stat-label">Coach</span>
            </div>
          </div>
        </div>
        <div className="hero-visual animate-float">
          <div className="hero-image-container glass">
             <img src="/health_forge_hero_1777130631012.png" alt="HealthForge Intelligence" />
             <div className="floating-card c1 glass animate-pulse-slow">
                <Activity size={24} className="icon-cyan" />
                <div>
                  <small>Heart Rate</small>
                  <strong>72 BPM</strong>
                </div>
             </div>
             <div className="floating-card c2 glass animate-pulse-slow-delay">
                <Zap size={24} className="icon-purple" />
                <div>
                  <small>Energy Level</small>
                  <strong>Optimal</strong>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Precision Tools for <span className="gradient-text">Performance</span></h2>
          <p>Everything you need to master your biology.</p>
        </div>
        <div className="features-grid">
          <FeatureCard 
            icon={<Brain size={32} />} 
            title="AI Health Coach" 
            desc="Personalized insights driven by your unique bio-data and daily habits." 
          />
          <FeatureCard 
            icon={<Activity size={32} />} 
            title="Real-time Tracking" 
            desc="Seamlessly monitor calories, macros, water, and sleep with precision." 
          />
          <FeatureCard 
            icon={<Shield size={32} />} 
            title="Data Privacy" 
            desc="Your health data is encrypted and secure. You own your information." 
          />
        </div>
      </section>

      {/* Social Proof */}
      <section className="cta-section glass">
        <div className="cta-content">
          <h2>Ready to transform?</h2>
          <p>Join thousands of athletes and health-conscious individuals today.</p>
          <Link href="/signup" className="btn-primary-landing xlarge">Create Your Profile</Link>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="marquee-container">
        <div className="marquee-content">
          <span>AI COACHING</span> <div className="star">✦</div>
          <span>REAL-TIME MACROS</span> <div className="star">✦</div>
          <span>BIO-PRECISION</span> <div className="star">✦</div>
          <span>NEO-HEALTH</span> <div className="star">✦</div>
          <span>AI COACHING</span> <div className="star">✦</div>
          <span>REAL-TIME MACROS</span> <div className="star">✦</div>
          <span>BIO-PRECISION</span> <div className="star">✦</div>
          <span>NEO-HEALTH</span> <div className="star">✦</div>
        </div>
      </div>

      {/* Grid Section Decoration */}
      <div className="grid-decoration"></div>

      <footer className="landing-footer">
        <div className="footer-logo">
          <div className="logo-icon small">HF</div>
          <span>HealthForge</span>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 HealthForge AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="feature-card glass glass-hover">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

export default Landing;
