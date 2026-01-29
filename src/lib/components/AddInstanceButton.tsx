'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useDemoStore } from '@/lib/stores/DemoStore';

interface AddInstanceButtonProps {
  criterionId: string;
  criterionName: string;
}

export const AddInstanceButton: React.FC<AddInstanceButtonProps> = ({ criterionId, criterionName }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { addInstance } = useDemoStore('addInstance');

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    addInstance(criterionId, title.trim());
    setTitle('');
    setIsAdding(false);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 0);
  };

  if (isAdding) {
    return (
      <div style={{ maxWidth: '80%', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            background: 'rgba(59, 130, 246, 0.05)',
          }}
        >
          <span style={{ fontSize: '13px', color: '#9ca3af' }}>Give this {criterionName} instance a title</span>
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
              if (e.key === 'Escape') {
                setIsAdding(false);
                setTitle('');
              }
            }}
            placeholder={`Enter a title for this piece of evidence...`}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: title.trim() ? '#2563eb' : 'rgba(37, 99, 235, 0.3)',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                cursor: title.trim() ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
              }}
            >
              Add Instance
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setTitle('');
              }}
              style={{
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
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '80%', margin: '0 auto' }}>
      <button
        onClick={() => setIsAdding(true)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '24px',
          borderRadius: '12px',
          border: '2px dashed rgba(59, 130, 246, 0.3)',
          background: 'rgba(59, 130, 246, 0.05)',
          color: '#3b82f6',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
        }}
      >
        <Plus style={{ width: '20px', height: '20px' }} />
        Add Another Instance
      </button>
    </div>
  );
};
