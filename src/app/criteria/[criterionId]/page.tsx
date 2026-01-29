'use client';

import { useDemoStore } from '@/lib/stores/DemoStore';
import { CriterionDetailView } from '@/lib/components/CriterionDetailView';
import { use } from 'react';

export default function CriterionPage({ params }: { params: Promise<{ criterionId: string }> }) {
  const { activeStrategy } = useDemoStore();

  if (!activeStrategy) {
    return <div>No strategy loaded</div>;
  }

  const { criterionId } = use(params);

  const criterion = activeStrategy.criteria.find((c: any) => c.id === criterionId);

  if (!criterion) {
    return <div>Criterion not found</div>;
  }

  return <CriterionDetailView criterion={criterion} />;
}
