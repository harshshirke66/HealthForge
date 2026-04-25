"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Activity, Brain, Shield, Zap, CheckCircle2, Flame } from 'lucide-react';
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
          <div className="hero-composition">
             <div className="comp-grid"></div>
             
             <div className="comp-core glass animate-pulse-slow">
                <div className="core-circle">
                   <div className="core-inner-circle spin-infinite"></div>
                </div>
                <h3>AI Health Core</h3>
             </div>

             <div className="comp-bars">
                <div className="bar b1"></div>
                <div className="bar b2"></div>
                <div className="bar b3"></div>
             </div>

             <div className="floating-card c1 glass">
                <Activity size={24} className="icon-cyan" />
                <div>
                  <small>Heart Rate</small>
                  <strong>72 BPM</strong>
                </div>
             </div>
             <div className="floating-card c2 glass">
                <Zap size={24} className="icon-purple" />
                <div>
                  <small>Energy Level</small>
                  <strong>Optimal</strong>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Bento Box Features */}
      <section id="features" className="bento-section">
        <div className="section-header">
           <h2>Unfair <span className="gradient-text">Advantage</span></h2>
           <p>The entire health stack, reimagined for the modern human.</p>
        </div>
        
        <div className="bento-grid">
           {/* Big Main Box */}
           <div className="bento-card bento-large glass">
              <div className="bento-icon-wrapper cyan">
                <Brain size={40} />
              </div>
              <div className="bento-text">
                <h3>Groq AI Intelligence</h3>
                <p>Lightning fast LLaMa 3.1 analysis provides instant, actionable feedback on your daily inputs without waiting.</p>
              </div>
           </div>

           {/* Top Right Box */}
           <div className="bento-card glass">
              <div className="bento-icon-wrapper orange">
                <Flame size={32} />
              </div>
              <div className="bento-text">
                <h3>Dynamic Home Workouts</h3>
                <p>Zero equipment needed. Fresh, AI-generated routines crafted daily to match your energy.</p>
              </div>
           </div>

           {/* Bottom Right Box */}
           <div className="bento-card glass">
              <div className="bento-icon-wrapper yellow">
                <Zap size={32} />
              </div>
              <div className="bento-text">
                <h3>Caloric Precision</h3>
                <p>Track macros and micros with an interactive, fluid dashboard that stays out of your way.</p>
              </div>
           </div>

           {/* Full Width Bottom Box */}
           <div className="bento-card bento-wide glass">
              <div className="bento-flex">
                 <div className="bento-icon-wrapper purple"><Shield size={40} /></div>
                 <div className="bento-text">
                   <h3>Absolute Data Sovereignty</h3>
                   <p>Your biometric data is securely stored. Zero third-party telemetry. No ads. Just pure, unadulterated privacy.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Massive Typography Manifesto */}
      <section className="manifesto-section">
         <div className="manifesto-marquee">
            <span>NO EXCUSES • ONLY DATA • MASTER YOUR BIOLOGY • NO EXCUSES • ONLY DATA • </span>
         </div>
         <div className="manifesto-cta">
            <Link href="/signup" className="btn-primary-landing xlarge animate-pulse-slow">
               Initialize System
            </Link>
         </div>
      </section>

      {/* Grid Section Decoration */}
      <div className="grid-decoration"></div>

      <footer className="landing-footer">
        <div className="footer-grid">
           <div className="footer-brand">
             <div className="logo-icon large">HF</div>
             <p>The ultimate AI-driven health intelligence system. Stop guessing. Start tracking.</p>
           </div>
           
           <div className="footer-links">
             <div className="link-column">
                <h4>System</h4>
                <Link href="#features">Core Features</Link>
                <Link href="/login">User Dashboard</Link>
                <Link href="/login">Initialize Login</Link>
             </div>
             <div className="link-column">
                <h4>Protocol</h4>
                <Link href="/privacy">Privacy Directive</Link>
                <Link href="/terms">Terms of Service</Link>
                <Link href="/data">Data Sovereignty</Link>
             </div>
           </div>
        </div>

        <div className="footer-huge-text">
           HEALTHFORGE
        </div>

        <div className="footer-bottom">
          <div className="system-status">
            <span className="pulse-dot"></span>
            System Status: <strong>Optimal</strong>
          </div>
          <p>Version 1.0.0 &copy; 2026 HealthForge</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
