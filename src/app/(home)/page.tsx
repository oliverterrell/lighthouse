'use client';

import { LandingContent } from '@/app/(home)/LandingContent';
import { StrategyOverview } from '@/app/(home)/StrategyOverview';
import { LighthouseSvg } from '@/lib/icons';
import { ProfileSelector } from '@/lib/components/ProfileSelector';
import { useDemoStore } from '@/lib/stores/DemoStore';

export default function Home() {
  const { activeStrategy, setActiveStrategy } = useDemoStore('activeStrategy', 'setActiveStrategy');

  const resetPage = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div
        style={{
          position: 'relative',
          display: 'flex',
          height: '80px',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(24, 24, 27, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0 34px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LighthouseSvg size={115} style={{ transform: 'translateY(-10px)' }} className={'cursor-pointer'} onClick={resetPage} />
          <span
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              letterSpacing: '-0.02em',
              pointerEvents: 'none',
            }}
          >
            Lighthouse HQ
          </span>
        </div>

        <ProfileSelector onStrategyLoad={setActiveStrategy} />
      </div>

      {activeStrategy ? <StrategyOverview /> : <LandingContent />}
    </div>
  );
}
