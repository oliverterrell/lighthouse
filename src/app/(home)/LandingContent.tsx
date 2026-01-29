'use client';

import { GenerateProfileModal } from '@/lib/components/GenerateProfileModal';
import { clearAllStrategies } from '@/lib/strategyLoader';
import { useState } from 'react';

export const LandingContent = () => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - 100px)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
      }}
    >
      <div style={{ maxWidth: '800px', textAlign: 'center' }}>
        {/* Main heading */}
        <h1
          style={{
            marginBottom: '32px',
            fontSize: '56px',
            fontWeight: 'bold',
            color: 'white',
            lineHeight: '1.2',
          }}
        >
          Welcome to Lighthouse HQ
        </h1>

        {/* Subtitle */}
        <p
          style={{
            marginBottom: '24px',
            fontSize: '20px',
            color: '#9ca3af',
            fontWeight: '500',
          }}
        >
          Your Personal Visa Concierge
        </p>

        {/* Divider */}
        <div
          style={{
            margin: '48px auto',
            height: '1px',
            width: '120px',
            background: 'linear-gradient(to right, transparent, #4b5563, transparent)',
          }}
        />

        {/* Description */}
        <p
          style={{
            marginBottom: '64px',
            fontSize: '18px',
            color: '#d1d5db',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 64px',
          }}
        >
          We guide you through every step of your O-1 visa journey—from strategy development to evidence collection and final
          submission.
        </p>

        {/* Call to action */}
        <div style={{ marginBottom: '120px', marginTop: '120px' }}>
          <p
            style={{
              fontSize: '16px',
              color: '#9ca3af',
              marginBottom: '20px',
            }}
          >
            Ready to get started?
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '15px',
              color: '#d1d5db',
            }}
          >
            <span>Select a test profile from the</span>
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              top right
            </span>
            <span>to explore the experience</span>
          </div>

          {/* OR divider */}
          <div
            style={{
              margin: '40px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}
          >
            <div style={{ height: '1px', width: '60px', background: '#374151' }} />
            <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>OR</span>
            <div style={{ height: '1px', width: '60px', background: '#374151' }} />
          </div>

          {/* Upload option */}
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '14px',
                padding: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#60a5fa')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#3b82f6')}
              onClick={() => setShowGenerateModal(true)}
            >
              Click here
            </button>{' '}
            to generate novel profile
          </p>
        </div>

        {/* Feature highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '48px',
            marginTop: '96px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                margin: '0 auto 16px',
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
              }}
            >
              <span style={{ fontSize: '32px' }}>📋</span>
            </div>
            <h3
              style={{
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
              }}
            >
              Personalized Strategy
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>Tailored approach based on your unique background</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                margin: '0 auto 16px',
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <span style={{ fontSize: '32px', color: 'white' }}>✓</span>
            </div>
            <h3
              style={{
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
              }}
            >
              Guided Collection
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>Clear guidance on what evidence you need and why</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                margin: '0 auto 16px',
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              <span style={{ fontSize: '32px' }}>🚀</span>
            </div>
            <h3
              style={{
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
              }}
            >
              Expert Support
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>Professional review and submission assistance</p>
          </div>
        </div>

        {/* Reset data */}
        <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '96px' }}>
          Click{' '}
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '14px',
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#60a5fa')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#3b82f6')}
            onClick={() => {
              clearAllStrategies();
              window.location.reload();
            }}
          >
            here
          </button>{' '}
          to reset all demo data and start fresh
        </p>
      </div>

      <GenerateProfileModal isOpen={showGenerateModal} onClose={() => setShowGenerateModal(false)} />
    </div>
  );
};
