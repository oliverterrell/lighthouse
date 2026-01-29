'use client';

import { useState } from 'react';
import { InstanceCard } from './InstanceCard';

interface InstancesListProps {
  instances: any[];
  criterionId: string;
  criterionName: string;
}

export const InstancesList: React.FC<InstancesListProps> = ({ instances, criterionId, criterionName }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (instances.length === 0) {
    return (
      <div
        style={{
          maxWidth: '80%',
          margin: '0 auto 32px',
          padding: '48px',
          textAlign: 'center',
          borderRadius: '16px',
          border: '2px dashed rgba(255, 255, 255, 0.1)',
          background: 'rgba(24, 24, 27, 0.5)',
        }}
      >
        <p style={{ fontSize: '16px', color: '#9ca3af' }}>No instances yet. Add your first one below!</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '80%', margin: '0 auto 32px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600', color: 'white' }}>Evidence Instances</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {instances.map((instance) => (
          <InstanceCard
            key={instance.id}
            instance={instance}
            criterionId={criterionId}
            isExpanded={expandedId === instance.id}
            onToggle={() => setExpandedId(expandedId === instance.id ? null : instance.id)}
            criterionName={criterionName}
          />
        ))}
      </div>
    </div>
  );
};
