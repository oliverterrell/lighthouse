'use client';

import { useDemoStore } from '@/lib/stores/DemoStore';
import { ChevronDown, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { FieldRenderer } from './FieldRenderer';

interface InstanceCardProps {
  instance: any;
  criterionId: string;
  isExpanded: boolean;
  onToggle: () => void;
  criterionName: string;
}

export const InstanceCard: React.FC<InstanceCardProps> = ({ instance, criterionId, isExpanded, onToggle, criterionName }) => {
  const { updateInstanceField, deleteInstance } = useDemoStore();

  const completedFields = instance.fields.filter(
    (f: any) => f.value && f.value !== '' && !(Array.isArray(f.value) && f.value.length === 0)
  ).length;
  const totalFields = instance.fields.length;
  const progress = Math.round((completedFields / totalFields) * 100);
  const isComplete = completedFields === totalFields;

  return (
    <div
      style={{
        overflow: 'hidden',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(24, 24, 27, 0.95)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s',
      }}
    >
      {/* Header - Always Visible */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: 0 }}>{instance.title}</h3>
            {isComplete && <CheckCircle2 style={{ width: '20px', height: '20px', color: '#22c55e' }} />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
              {completedFields}/{totalFields} fields complete
            </p>
            {!isComplete && progress > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                <span style={{ fontSize: '12px', color: '#f59e0b' }}>In Progress</span>
              </div>
            )}
          </div>
          {/* Progress Bar */}
          <div
            style={{
              marginTop: '12px',
              width: '100%',
              height: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: isComplete ? 'linear-gradient(to right, #16a34a, #4ade80)' : 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                width: `${progress}%`,
                transition: 'width 0.3s',
                borderRadius: '9999px',
              }}
            />
          </div>
        </div>
        <ChevronDown
          style={{
            marginLeft: '16px',
            width: '20px',
            height: '20px',
            color: '#9ca3af',
            transition: 'transform 0.2s',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </div>

      {/* Expanded Form */}
      {isExpanded && (
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {instance.fields.map((field: any) => (
              <FieldRenderer
                key={field.name}
                field={field}
                onChange={(value) => updateInstanceField(criterionId, instance.id, field.name, value)}
                criterionName={criterionName}
                instanceTitle={instance.title}
              />
            ))}
          </div>

          {/* Actions */}
          <div
            style={{
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              }}
              onClick={() => deleteInstance(criterionId, instance.id)}
            >
              <Trash2 style={{ width: '16px', height: '16px' }} />
              Delete Instance
            </button>
            <button
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onClick={onToggle}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
