'use client';

import { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Sparkles, X, Loader2, Check, RotateCcw } from 'lucide-react';

interface AITextareaProps {
  field: {
    name: string;
    label: string;
    type: string;
    required: boolean;
    hint?: string;
    value?: string;
  };
  onChange: (value: string) => void;
  /** The instance title (e.g. "Open-Source ML Framework - 15K GitHub Stars") for context */
  instanceTitle?: string;
  /** The criterion name (e.g. "Original Contributions") for context */
  criterionName?: string;
}

export const AITextarea: React.FC<AITextareaProps> = ({ field, onChange, instanceTitle = '', criterionName = '' }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [keyPoints, setKeyPoints] = useState('');
  const [metrics, setMetrics] = useState('');
  const [userWords, setUserWords] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const openModal = () => {
    setModalOpen(true);
    setGenerated(null);
    setError(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setGenerated(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!keyPoints.trim()) return;
    setGenerating(true);
    setGenerated(null);
    setError(null);

    try {
      const res = await fetch('/api/generate-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldLabel: field.label,
          instanceTitle,
          criterionName,
          keyPoints: keyPoints.trim(),
          metrics: metrics.trim(),
          userWords: userWords.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      setGenerated(data.generated);
    } catch {
      setError('Network error — please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleAccept = () => {
    if (generated) {
      onChange(generated);
      closeModal();
    }
  };

  const handleReject = () => {
    setGenerated(null);
  };

  const modalInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '72px',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  };

  const modalLabelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#d1d5db',
    marginBottom: '6px',
  };

  const modalHintStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '4px',
    marginBottom: '0',
  };

  return (
    <>
      <div style={{ position: 'relative' }}>
        <textarea
          ref={textareaRef}
          value={field.value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.hint || `Enter ${field.label.toLowerCase()}`}
          rows={3}
          style={{
            width: '100%',
            padding: '10px 38px 10px 14px', // right pad for icon
            borderRadius: '8px',
            border: field.value ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            fontSize: '14px',
            outline: 'none',
            resize: 'vertical',
            minHeight: '42px', // same height as a single-line input
            fontFamily: 'inherit',
            lineHeight: '1.5',
            transition: 'border-color 0.2s, background 0.2s',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = field.value ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
        />

        {/* Magic Pen button — top-right corner of the textarea */}
        <button
          onClick={openModal}
          title="AI-assisted writing"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '26px',
            height: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            background: 'rgba(139, 92, 246, 0.1)',
            color: '#a78bfa',
            cursor: 'pointer',
            transition: 'all 0.2s',
            padding: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.45)';
            e.currentTarget.style.color = '#c4b5fd';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.25)';
            e.currentTarget.style.color = '#a78bfa';
          }}
        >
          <Sparkles style={{ width: '14px', height: '14px' }} />
        </button>
      </div>

      {modalOpen &&
        ReactDOM.createPortal(
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={closeModal}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '680px',
                maxHeight: '90vh',
                overflowY: 'auto',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: 'rgba(24, 24, 27, 0.97)',
                backdropFilter: 'blur(12px)',
                padding: '28px',
                position: 'relative',
              }}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = '#9ca3af';
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles style={{ width: '16px', height: '16px', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white', margin: 0 }}>AI Writing Assistant</h3>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 22px 0' }}>
                Writing for: <span style={{ color: '#9ca3af' }}>{field.label}</span>
                {instanceTitle && (
                  <>
                    {' '}
                    · <span style={{ color: '#6b7280' }}>{instanceTitle}</span>
                  </>
                )}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={modalLabelStyle}>
                    Key points to convey <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    value={keyPoints}
                    onChange={(e) => setKeyPoints(e.target.value)}
                    placeholder="e.g. Built a distributed training framework that reduced GPU hours by 60%"
                    style={modalInputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  />
                  <p style={modalHintStyle}>What are the most important facts about this?</p>
                </div>

                <div>
                  <label style={modalLabelStyle}>Metrics & numbers</label>
                  <textarea
                    value={metrics}
                    onChange={(e) => setMetrics(e.target.value)}
                    placeholder="e.g. 15K GitHub stars, adopted by 3 Fortune 500 companies, 2M downloads"
                    style={{ ...modalInputStyle, minHeight: '58px' }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  />
                  <p style={modalHintStyle}>Any quantifiable impact — numbers strengthen your case</p>
                </div>

                <div>
                  <label style={modalLabelStyle}>Your own words / tone</label>
                  <textarea
                    value={userWords}
                    onChange={(e) => setUserWords(e.target.value)}
                    placeholder="e.g. I want it to sound confident but not arrogant. Emphasize the technical novelty."
                    style={{ ...modalInputStyle, minHeight: '58px' }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  />
                  <p style={modalHintStyle}>Optional — guide the tone or include phrases you want kept</p>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    background: 'rgba(239, 68, 68, 0.1)',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '13px', color: '#ef4444' }}>{error}</p>
                </div>
              )}

              {generated && (
                <div style={{ marginTop: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#a78bfa' }}>Generated text</span>
                    <button
                      onClick={handleReject}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        borderRadius: '5px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        background: 'transparent',
                        color: '#6b7280',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.color = '#9ca3af';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.color = '#6b7280';
                      }}
                    >
                      <RotateCcw style={{ width: '11px', height: '11px' }} />
                      Dismiss
                    </button>
                  </div>

                  <div
                    style={{
                      padding: '14px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      background: 'rgba(139, 92, 246, 0.08)',
                      minHeight: '60px',
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '14px', color: '#e2e8f0', lineHeight: '1.6' }}>{generated}</p>
                  </div>

                  {/* Accept button */}
                  <button
                    onClick={handleAccept}
                    style={{
                      marginTop: '12px',
                      width: '100%',
                      padding: '11px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(to right, #16a34a, #4ade80)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    <Check style={{ width: '16px', height: '16px' }} />
                    Use this text
                  </button>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!keyPoints.trim() || generating}
                style={{
                  marginTop: generated ? '12px' : '24px',
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  background:
                    !keyPoints.trim() || generating ? 'rgba(139, 92, 246, 0.25)' : 'linear-gradient(to right, #7c3aed, #8b5cf6)',
                  color: !keyPoints.trim() || generating ? '#a78bfa' : 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: !keyPoints.trim() || generating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (keyPoints.trim() && !generating) {
                    e.currentTarget.style.opacity = '0.9';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {generating ? (
                  <>
                    <Loader2
                      style={{
                        width: '16px',
                        height: '16px',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles style={{ width: '16px', height: '16px' }} />
                    {generated ? 'Regenerate' : 'Generate'}
                  </>
                )}
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
