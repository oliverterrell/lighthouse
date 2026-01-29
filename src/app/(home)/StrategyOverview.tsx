import { CriteriaCard } from '@/lib/components/CriteriaCard';
import { DemographicBanner } from '@/lib/components/DemographicBanner';
import { Status } from '@/lib/enums';
import { useDemoStore } from '@/lib/stores/DemoStore';
import { Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { calculateProgress } from '@/lib/utils';

const getStatusFromProgress = (progress: number): Status => {
  if (progress === 0) return Status.NotStarted;
  if (progress === 100) return Status.Complete;
  return Status.InProgress;
};

export const StrategyOverview = () => {
  const router = useRouter();

  const { activeStrategy } = useDemoStore('activeStrategy');

  if (!activeStrategy) return null;

  return (
    <div className={'flex w-full flex-col'}>
      <div className="mx-auto mt-14 w-[80%] py-3" style={{ marginBottom: '14px' }}>
        <h1
          style={{
            transform: 'translateY(-20px)',
            fontSize: '24px',
            fontWeight: '100',
            width: '80%',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'left',
          }}
        >
          Welcome, {activeStrategy.applicant_name}
        </h1>
        <DemographicBanner />

        <div style={{ height: '60px' }}></div>

        <div className={'mx-auto w-[80%]'}>
          <h1 className="relative mb-2 flex justify-between text-3xl font-bold text-gray-50">
            <span>Your O-1 Visa Strategy</span>
          </h1>
          <p className={'text-gray-600'}>
            Our case agents and legal team have curated the following strategy based on your unique experience.
          </p>
          <p className="text-gray-600">Complete the evidence collection for each criterion below.</p>
          <hr className={'mx-auto mt-4 w-full'} style={{ borderColor: '#898989' }} />
        </div>
      </div>

      <div className="mx-auto grid max-w-[80%] grid-cols-3 items-center justify-center gap-6" style={{ paddingBottom: '36px' }}>
        {activeStrategy
          ? activeStrategy?.criteria
            ? activeStrategy.criteria.map((criterion: any, index: number) => {
                const progress = calculateProgress(criterion);
                return (
                  <CriteriaCard
                    key={'card' + criterion.id + '-' + index}
                    criteriaType={criterion.id}
                    title={criterion.name}
                    instanceCount={criterion.instances.length}
                    progress={progress}
                    status={getStatusFromProgress(progress)}
                    onClick={() => router.push(`/criteria/${criterion.id}`)}
                    guidance={criterion.guidance}
                  />
                );
              })
            : null
          : null}
      </div>
    </div>
  );
};
