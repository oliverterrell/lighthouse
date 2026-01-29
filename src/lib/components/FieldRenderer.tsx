'use client';

import { AITextarea } from '@/lib/components/AITextarea';
import { useState, useRef } from 'react';
import { Link as LinkIcon, Upload, Trash2, Link, FileText } from 'lucide-react';

interface FieldRendererProps {
  field: {
    name: string;
    label: string;
    type: string;
    required: boolean;
    hint?: string;
    value?: any;
  };
  onChange: (value: any) => void;
  criterionName?: string;
  instanceTitle?: string;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, onChange, criterionName, instanceTitle }) => {
  const [dragActive, setDragActive] = useState(false);
  const urlInputRef = useRef(null);

  const handleFileUpload = (file: File) => {
    // For demo, just store filename
    onChange(file.name);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const renderInput = () => {
    switch (field.type) {
      case 'text':
        if (['work_description', 'impact_description', 'selection_criteria', 'key_responsibilities'].includes(field.name)) {
          return <AITextarea field={field} onChange={onChange} criterionName={criterionName} instanceTitle={instanceTitle} />;
        }
        return (
          <input
            type="text"
            value={field.value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.hint || `Enter ${field.label.toLowerCase()}`}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: field.value ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s',
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
        );

      case 'date':
        return (
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              value={field.value || ''}
              onChange={(e) => onChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: field.value ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s',
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
          </div>
        );

      case 'url':
        return (
          <div style={{ position: 'relative' }}>
            <input
              type="url"
              value={field.value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com"
              style={{
                width: '100%',
                padding: '10px 14px',
                paddingLeft: '40px',
                borderRadius: '8px',
                border: field.value ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s',
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
            <LinkIcon
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#9ca3af',
                pointerEvents: 'none',
              }}
            />
          </div>
        );

      case 'file':
      case 'files':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '8px',
                border: dragActive ? '2px dashed rgba(59, 130, 246, 0.5)' : '2px dashed rgba(255, 255, 255, 0.15)',
                background: dragActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!dragActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!dragActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Upload style={{ width: '18px', height: '18px', color: '#9ca3af' }} />
                <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                  {dragActive ? 'Drop files here' : 'Click to upload or drag & drop'}
                </span>
              </div>
              <input
                type="file"
                multiple={true}
                onChange={(e) => {
                  if (e.target.files?.length) {
                    const newNames = Array.from(e.target.files).map((f) => f.name);
                    const merged = [...(field.value || []), ...newNames.filter((n) => !field.value.includes(n))];
                    onChange(merged);
                  }
                  e.target.value = '';
                }}
                style={{ display: 'none' }}
              />
            </label>

            {/* File list */}
            {field.value?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {field.value.map((fileName: string, index: number) => (
                  <div
                    key={fileName + index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <div className={'flex items-center gap-2'}>
                      <FileText style={{ width: '12px', height: '12px', color: '#86efac', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: '#86efac' }}>{fileName}</span>
                    </div>
                    <button
                      onClick={() => {
                        const updated = field.value.filter((_: string, i: number) => i !== index);
                        onChange(updated);
                      }}
                      style={{
                        padding: '2px',
                        borderRadius: '4px',
                        background: 'transparent',
                        border: 'none',
                        color: '#6b7280',
                        cursor: 'pointer',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#6b7280';
                      }}
                    >
                      <Trash2 style={{ width: '13px', height: '13px' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'files_or_urls':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '8px',
                border: dragActive ? '2px dashed rgba(59, 130, 246, 0.5)' : '2px dashed rgba(255, 255, 255, 0.15)',
                background: dragActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!dragActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!dragActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Upload style={{ width: '18px', height: '18px', color: '#9ca3af' }} />
                <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                  {dragActive ? 'Drop files here' : 'Upload files or paste URLs'}
                </span>
              </div>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files?.length) {
                    const newNames = Array.from(e.target.files).map((f) => f.name);
                    const merged = [...(field.value || []), ...newNames.filter((n) => !field.value.includes(n))];
                    onChange(merged);
                  }
                  e.target.value = '';
                }}
                style={{ display: 'none' }}
              />
            </label>

            {/* URL input */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                ref={urlInputRef}
                type="url"
                placeholder="Or paste a URL"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const url = (e.target as HTMLInputElement).value.trim();
                    if (url && !field.value.includes(url)) {
                      onChange([...(field.value || []), url]);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  const url = urlInputRef.current?.value.trim();
                  if (url && !field.value.includes(url)) {
                    const existing = Array.isArray(field.value) ? field.value : [];
                    onChange([...existing, url]);
                    urlInputRef.current.value = '';
                  }
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#9ca3af',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#9ca3af';
                }}
              >
                Add
              </button>
            </div>

            {/* File/URL list */}
            {field.value?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {field.value.map((item: string, index: number) => {
                  const isUrl = item.startsWith('http://') || item.startsWith('https://');
                  return (
                    <div
                      key={item + index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        {isUrl ? (
                          <Link style={{ width: '12px', height: '12px', color: isUrl ? '#60a5fa' : '#6b7280', flexShrink: 0 }} />
                        ) : (
                          <FileText style={{ width: '12px', height: '12px', color: '#86efac', flexShrink: 0 }} />
                        )}
                        <span
                          style={{
                            fontSize: '12px',
                            color: isUrl ? '#60a5fa' : '#86efac',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const updated = field.value.filter((_: string, i: number) => i !== index);
                          onChange(updated);
                        }}
                        style={{
                          padding: '2px',
                          borderRadius: '4px',
                          background: 'transparent',
                          border: 'none',
                          color: '#6b7280',
                          cursor: 'pointer',
                          transition: 'color 0.2s',
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#6b7280';
                        }}
                      >
                        <Trash2 style={{ width: '13px', height: '13px' }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      default:
        return (
          <input
            type="text"
            value={field.value || ''}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          />
        );
    }
  };

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#d1d5db' }}>
        {field.label}
        {field.required && <span style={{ marginLeft: '4px', color: '#ef4444' }}>*</span>}
      </label>
      {renderInput()}
      {field.hint && <p style={{ marginTop: '6px', fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>{field.hint}</p>}
    </div>
  );
};
