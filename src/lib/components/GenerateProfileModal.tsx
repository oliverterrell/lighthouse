'use client';

import { useDemoStore } from '@/lib/stores/DemoStore';
import React, { useState } from 'react';
import { X, RefreshCw, Check } from 'lucide-react';
import { saveStrategy } from '@/lib/strategyLoader';

interface GenerateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GenerateProfileModal: React.FC<GenerateProfileModalProps> = ({ isOpen, onClose }) => {
  const { setActiveStrategy } = useDemoStore('setActiveStrategy');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/generate-profile', { method: 'POST' });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setGeneratedData(data);
      setStatus('success');
    } catch (e) {
      setError('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const handleUseProfile = () => {
    if (!generatedData) return;
    const profileId = generatedData.profile_type;
    saveStrategy(profileId, generatedData);
    setActiveStrategy(generatedData, profileId);
    onClose();
  };

  // Kick off generation when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setGeneratedData(null);
      setStatus('idle');
      setError(null);
      generate();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '720px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          background: '#18181b',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          zIndex: 50,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            flexShrink: 0,
          }}
        >
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: 0 }}>Generate Custom Profile</h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0' }}>
              AI-generated O-1 visa strategy with a unique applicant and criteria
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Loading */}
          {status === 'loading' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '64px 0',
                gap: '16px',
              }}
            >
              <RefreshCw
                style={{
                  width: '32px',
                  height: '32px',
                  color: '#3b82f6',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>Generating a unique profile...</p>
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '64px 0',
                gap: '16px',
              }}
            >
              <p style={{ fontSize: '14px', color: '#ef4444', margin: 0 }}>{error}</p>
              <button
                onClick={generate}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Generated JSON */}
          {status === 'success' && generatedData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Applicant summary */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <p style={{ fontSize: '15px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>
                  {generatedData.applicant_name}
                </p>
                <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
                  Profile: {generatedData.profile_type} &middot;{' '}
                  {generatedData.criteria.reduce((sum: number, c: any) => sum + c.instances.length, 0)} total instances across{' '}
                  {generatedData.criteria.length} criteria
                </p>
              </div>

              {/* JSON preview */}
              <pre
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#d1d5db',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  overflowX: 'auto',
                  overflowY: 'auto',
                  maxHeight: '320px',
                  margin: 0,
                  boxSizing: 'border-box',
                }}
              >
                {JSON.stringify(generatedData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        {status === 'success' && generatedData && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              flexShrink: 0,
            }}
          >
            <button
              onClick={generate}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'transparent',
                color: '#9ca3af',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#9ca3af';
              }}
            >
              <RefreshCw style={{ width: '14px', height: '14px' }} />
              Regenerate
            </button>

            <button
              onClick={handleUseProfile}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Check style={{ width: '16px', height: '16px' }} />
              Use This Profile
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
