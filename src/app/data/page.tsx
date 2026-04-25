"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import '../../styles/legal.css';

export default function DataSovereignty() {
  return (
    <div className="legal-container">
      <div className="legal-content data">
        <div className="legal-badge">Core Principle</div>
        
        <h1>Data Sovereignty</h1>
        
        <p>HealthForge was built on a single, uncompromising principle: Your biological data belongs to you, and no one else.</p>

        <h2>1. The Ownership Guarantee</h2>
        <p>You have absolute sovereignty over your profile. HealthForge acts solely as the processing engine. The data sitting in our PostgreSQL database is your property. You can export it, wipe it, or modify it at any time.</p>

        <h2>2. Data Deletion Protocol</h2>
        <ul>
          <li>Deleting your account permanently wipes all rows associated with your user ID.</li>
          <li>We do not retain "soft-deleted" records for marketing purposes.</li>
          <li>Once it's gone from the Forge, it's gone forever.</li>
        </ul>

        <h2>3. Third-Party Independence</h2>
        <p>We do not connect to external ad networks. We do not use Google Analytics. We do not sell aggregations of user sleep schedules or nutritional habits to insurance companies. HealthForge Intelligence is a closed, secure ecosystem designed entirely for your personal optimization.</p>

        <div className="legal-footer">
          <Link href="/" className="legal-back-btn">
             <ArrowLeft size={20} /> Return to Base
          </Link>
          <span className="last-updated">UPDATED: APRIL 2026</span>
        </div>
      </div>
    </div>
  );
}
