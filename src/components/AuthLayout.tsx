"use client";
import React from 'react';
import Link from 'next/link';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  type: 'login' | 'signup';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, type }) => {
  return (
    <div className="auth-container">
      <div className="auth-visual">
         <div className="auth-mesh-gradient"></div>
         <div className="auth-floating-content animate-float">
            <div className="logo large">
              <div className="logo-icon">HF</div>
              <span>HealthForge</span>
            </div>
            <p>Master your biology with AI intelligence.</p>
         </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-form-wrapper animate-fade-in">
          <Link href="/" className="back-link">← Back to home</Link>
          <div className="auth-header">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          
          {children}

          <div className="auth-footer">
            {type === 'login' ? (
              <p>Don't have an account? <Link href="/signup">Sign up</Link></p>
            ) : (
              <p>Already have an account? <Link href="/login">Log in</Link></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
