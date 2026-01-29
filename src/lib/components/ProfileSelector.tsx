import { useDemoStore } from '@/lib/stores/DemoStore';
import { loadStrategy } from '@/lib/strategyLoader';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

const STORAGE_PREFIX = 'lighthouse_strategy_';

const TEST_PROFILES = [
  { id: 'startup-founder', name: 'Sarah Chen - Startup Founder', path: '/test-data/startup-founder.json' },
  { id: 'research-scientist', name: 'Dr. James Rodriguez - Research Scientist', path: '/test-data/research-scientist.json' },
  { id: 'creative-director', name: 'Maya Patel - Creative Director', path: '/test-data/creative-director.json' },
  { id: 'ai-researcher', name: 'Dr. Priya Sharma - AI Researcher', path: '/test-data/ai-researcher.json' },
];

export const ProfileSelector = ({ onStrategyLoad }) => {
  const { activeStrategy } = useDemoStore('activeStrategy');
  const [selectedProfile, setSelectedProfile] = useState(activeStrategy?.profile_type ?? '');
  const [customProfiles, setCustomProfiles] = useState<{ id: string; name: string }[]>([]);

  const scanCustomProfiles = () => {
    const staticIds = new Set(TEST_PROFILES.map((p) => p.id));
    const custom = Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .map((key) => key.replace(STORAGE_PREFIX, ''))
      .filter((id) => !staticIds.has(id))
      .map((id) => {
        const data = JSON.parse(localStorage.getItem(STORAGE_PREFIX + id)!);
        return { id, name: data.applicant_name };
      });
    setCustomProfiles(custom);
  };

  useEffect(() => {
    scanCustomProfiles();
  }, []);

  // Re-scan and auto-select whenever an external profile is saved
  useEffect(() => {
    if (activeStrategy) {
      scanCustomProfiles();
      setSelectedProfile(activeStrategy.profile_type);
      onStrategyLoad(activeStrategy, activeStrategy.profile_type);
    }
  }, [activeStrategy?.profile_type]);

  const handleSelect = async (path: string, id: string) => {
    if (!id) {
      window.location.reload();
      return;
    }
    setSelectedProfile(id);
    // Custom profiles are already in localStorage, so loadStrategy will find them
    const data = await loadStrategy(path, id);
    onStrategyLoad(data, id);
  };

  return (
    <div className="relative inline-block w-64" style={{ marginRight: '8px' }}>
      <select
        value={selectedProfile}
        onChange={(e) => {
          const staticProfile = TEST_PROFILES.find((p) => p.id === e.target.value);
          if (staticProfile) {
            handleSelect(staticProfile.path, staticProfile.id);
          } else if (e.target.value) {
            // Custom profile — already in localStorage, path won't be used
            handleSelect('', e.target.value);
          } else {
            handleSelect('', '');
          }
        }}
        className="block w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-white/10 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/15 focus:border-white/30"
        style={{ padding: '8px 6px', appearance: 'none' }}
      >
        <option value="" className="bg-gray-900 text-white">
          Select Test Profile
        </option>
        {TEST_PROFILES.map((profile) => (
          <option key={'test-prof-' + profile.id} value={profile.id} className="bg-gray-900 text-white">
            {profile.name}
          </option>
        ))}
        {customProfiles.length > 0 && (
          <>
            <option disabled className="bg-gray-900 text-gray-600">
              ─── Generated ───
            </option>
            {customProfiles.map((profile) => (
              <option key={'custom-' + profile.id} value={profile.id} className="bg-gray-900 text-white">
                {profile.name} (Custom)
              </option>
            ))}
          </>
        )}
      </select>
      <ChevronDown style={{ position: 'absolute', right: '8px', top: '6px', pointerEvents: 'none' }} />
    </div>
  );
};
