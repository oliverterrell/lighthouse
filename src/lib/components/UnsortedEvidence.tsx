'use client';

import { Upload } from 'lucide-react';

interface UnsortedEvidenceProps {
  onUploadClick: () => void;
}

export const UnsortedEvidence: React.FC<UnsortedEvidenceProps> = ({ onUploadClick }) => {
  return (
    <div
      style={{
        maxWidth: '80%',
        margin: '48px auto 0',
        padding: '32px',
        textAlign: 'center',
        borderRadius: '12px',
        border: '2px dashed rgba(139, 92, 246, 0.3)',
        background: 'rgba(139, 92, 246, 0.05)',
        transition: 'all 0.2s',
      }}
    >
      <p style={{ fontSize: '16px', color: '#d1d5db', marginBottom: '12px' }}>Have some evidence but not sure where it fits?</p>
      <button
        onClick={onUploadClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          background: 'linear-gradient(to right, #8b5cf6, #a78bfa)',
          color: 'white',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginBottom: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.9';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <Upload style={{ width: '18px', height: '18px' }} />
        Upload Here
      </button>
      <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>and we'll help you sort it out!</p>
    </div>
  );
};
