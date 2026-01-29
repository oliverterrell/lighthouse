'use client';

import { CriterionHeader } from './CriterionHeader';
import { InstancesList } from './InstancesList';
import { AddInstanceButton } from './AddInstanceButton';
import { calculateProgress } from '@/lib/utils';

interface CriterionDetailViewProps {
  criterion: {
    id: string;
    name: string;
    description: string;
    guidance: string;
    instances: any[];
  };
}

export const CriterionDetailView: React.FC<CriterionDetailViewProps> = ({ criterion }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'black', paddingTop: '32px', paddingBottom: '48px' }}>
      {/* Header Section */}
      <CriterionHeader
        name={criterion.name}
        description={criterion.description}
        guidance={criterion.guidance}
        progress={calculateProgress(criterion)}
      />

      {/* Instances List */}
      <InstancesList instances={criterion.instances} criterionId={criterion.id} criterionName={criterion.name} />

      {/* Add Instance Button */}
      <AddInstanceButton criterionId={criterion.id} criterionName={criterion.name} />
    </div>
  );
};
