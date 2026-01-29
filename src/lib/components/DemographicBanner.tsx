import { useDemoStore } from '@/lib/stores/DemoStore';
import { CheckCircle2, AlertCircle, Edit2, Upload, Loader2, XCircle, AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

interface ValidationResult {
  isValid: boolean;
  issues: string[];
  feedback: string;
  severity: 'error' | 'warning' | 'success';
}

export const DemographicBanner = () => {
  const { activeStrategy, updateDemographicField } = useDemoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [dragActive, setDragActive] = useState<string | null>(null);

  if (!activeStrategy) return null;

  const fields = activeStrategy?.demographic_information?.fields ?? [];
  const completedFields = fields.filter((f: any) => f.value && f.value !== '').length;
  const totalFields = fields.length;
  const isComplete = completedFields === totalFields;
  const progress = Math.round((completedFields / totalFields) * 100);

  const handleFileUpload = async (fieldName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // If it's a passport, validate it BEFORE saving
    if (fieldName === 'passport') {
      setValidating(true);
      setValidation(null);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/validate-passport', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          setValidation(result);

          // Only save to store if validation passes
          if (result.isValid) {
            updateDemographicField(fieldName, file.name);
          } else {
            // Clear the field if invalid
            updateDemographicField(fieldName, '');
          }
        } else {
          setValidation({
            isValid: false,
            issues: ['Validation failed'],
            feedback: result.error || 'Could not validate passport. Please try again.',
            severity: 'error',
          });
          // Don't save invalid file
          updateDemographicField(fieldName, '');
        }
      } catch (error) {
        setValidation({
          isValid: false,
          issues: ['Network error'],
          feedback: 'Failed to validate passport. Please check your connection and try again.',
          severity: 'error',
        });
        // Don't save on error
        updateDemographicField(fieldName, '');
      } finally {
        setValidating(false);
      }
    } else {
      // For non-passport files, save immediately
      updateDemographicField(fieldName, file.name);
    }
  };

  const handleDrag = (e: React.DragEvent, fieldName: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(fieldName);
    } else if (e.type === 'dragleave') {
      setDragActive(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, fieldName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Create a fake event to reuse existing upload handler
      const fakeEvent = {
        target: { files: [file], value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      await handleFileUpload(fieldName, fakeEvent);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success':
        return <CheckCircle2 style={{ width: '20px', height: '20px', color: '#22c55e' }} />;
      case 'warning':
        return <AlertTriangle style={{ width: '20px', height: '20px', color: '#eab308' }} />;
      case 'error':
        return <XCircle style={{ width: '20px', height: '20px', color: '#ef4444' }} />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e' };
      case 'warning':
        return { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.3)', text: '#eab308' };
      case 'error':
        return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.2)', text: '#9ca3af' };
    }
  };

  return (
    <div
      style={{
        maxWidth: '80%',
        margin: '0 auto 32px',
        background: isComplete
          ? 'linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))'
          : 'linear-gradient(to right, rgba(234, 179, 8, 0.1), rgba(234, 179, 8, 0.05))',
        border: isComplete ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
        borderRadius: '12px',
        padding: '20px 24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isComplete ? (
            <CheckCircle2 style={{ width: '24px', height: '24px', color: '#22c55e' }} />
          ) : (
            <AlertCircle style={{ width: '24px', height: '24px', color: '#eab308' }} />
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  margin: 0,
                }}
              >
                Demographic Information
              </h3>
              <span
                style={{
                  fontSize: '12px',
                  color: isComplete ? '#22c55e' : '#eab308',
                  fontWeight: '500',
                }}
              >
                {completedFields}/{totalFields} complete ({progress}%)
              </span>
            </div>
            <p
              style={{
                fontSize: '14px',
                color: '#9ca3af',
                margin: 0,
              }}
            >
              {isComplete
                ? 'Section complete. All basic information collected.'
                : 'Complete your basic information before submitting evidence'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <Edit2 style={{ width: '16px', height: '16px' }} />
          {isEditing ? 'Close' : isComplete ? 'Review' : 'Edit'}
        </button>
      </div>

      {isEditing && (
        <div
          style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
            }}
          >
            {fields.map((field: any) => (
              <div
                key={field.name}
                style={{
                  gridColumn: field.type === 'file' ? 'span 2' : 'span 1',
                }}
              >
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#d1d5db',
                    marginBottom: '6px',
                  }}
                >
                  {field.label}
                  {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                </label>

                {field.type === 'file' ? (
                  <>
                    <label
                      onDragEnter={(e) => handleDrag(e, field.name)}
                      onDragLeave={(e) => handleDrag(e, field.name)}
                      onDragOver={(e) => handleDrag(e, field.name)}
                      onDrop={(e) => handleDrop(e, field.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background:
                          dragActive === field.name
                            ? 'rgba(59, 130, 246, 0.15)'
                            : field.value
                              ? 'rgba(34, 197, 94, 0.1)'
                              : 'rgba(255, 255, 255, 0.05)',
                        border:
                          dragActive === field.name
                            ? '2px dashed rgba(59, 130, 246, 0.5)'
                            : field.value
                              ? '1px solid rgba(34, 197, 94, 0.3)'
                              : '1px dashed rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (dragActive !== field.name) {
                          e.currentTarget.style.background = field.value ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.08)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (dragActive !== field.name) {
                          e.currentTarget.style.background = field.value ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {validating && field.name === 'passport' ? (
                          <Loader2
                            style={{
                              width: '16px',
                              height: '16px',
                              color: '#3b82f6',
                              animation: 'spin 1s linear infinite',
                            }}
                          />
                        ) : (
                          <Upload
                            style={{
                              width: '16px',
                              height: '16px',
                              color: dragActive === field.name ? '#3b82f6' : field.value ? '#22c55e' : '#9ca3af',
                            }}
                          />
                        )}
                        <span
                          style={{
                            fontSize: '14px',
                            color: dragActive === field.name ? '#3b82f6' : field.value ? '#22c55e' : '#9ca3af',
                          }}
                        >
                          {validating && field.name === 'passport'
                            ? 'Validating...'
                            : dragActive === field.name
                              ? 'Drop file here'
                              : field.value || 'Click to upload or drag & drop file'}
                        </span>
                      </div>
                      {field.value && !validating && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateDemographicField(field.name, '');
                            setValidation(null);
                          }}
                          style={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '4px',
                            color: '#ef4444',
                            cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      )}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          handleFileUpload(field.name, e);
                          // Clear the input so same file can be re-uploaded
                          e.target.value = '';
                        }}
                        disabled={validating}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {/* Validation Feedback */}
                    {validation && field.name === 'passport' && (
                      <div
                        style={{
                          position: 'relative',
                          marginTop: '12px',
                          padding: '12px 16px',
                          background: getSeverityColor(validation.severity).bg,
                          border: `1px solid ${getSeverityColor(validation.severity).border}`,
                          borderRadius: '8px',
                        }}
                      >
                        {/* Dismiss button */}
                        <button
                          onClick={() => setValidation(null)}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            padding: 0,
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)';
                          }}
                        >
                          <X style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                        </button>

                        <div style={{ display: 'flex', gap: '12px', paddingRight: '24px' }}>
                          {getSeverityIcon(validation.severity)}
                          <div style={{ flex: 1 }}>
                            <p
                              style={{
                                margin: '0 0 8px 0',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: getSeverityColor(validation.severity).text,
                              }}
                            >
                              {validation.isValid ? 'Passport Verified' : 'Upload Rejected'}
                            </p>
                            <p
                              style={{
                                margin: '0 0 8px 0',
                                fontSize: '13px',
                                color: '#d1d5db',
                                lineHeight: '1.5',
                              }}
                            >
                              {validation.feedback}
                            </p>
                            {validation.issues.length > 0 && (
                              <>
                                <ul
                                  style={{
                                    margin: 0,
                                    paddingLeft: '20px',
                                    fontSize: '12px',
                                    color: '#9ca3af',
                                  }}
                                >
                                  {validation.issues.map((issue, idx) => (
                                    <li key={'passport-validation-li-' + idx}>{issue}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <input
                    type="text"
                    value={field.value || ''}
                    onChange={(e) => updateDemographicField(field.name, e.target.value)}
                    placeholder={field.hint || `Enter ${field.label.toLowerCase()}`}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: field.value ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
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
                      e.currentTarget.style.borderColor = field.value ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  />
                )}

                {field.hint && (
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      margin: '4px 0 0 0',
                    }}
                  >
                    {field.hint}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Changes are saved automatically</p>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Add spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
