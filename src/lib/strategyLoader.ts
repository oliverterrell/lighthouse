import { CaseStrategy } from '@/lib/types';

const STORAGE_PREFIX = 'lighthouse_strategy_';

export async function loadStrategy(path: string, profileId: string): Promise<CaseStrategy> {
  const cached = localStorage.getItem(STORAGE_PREFIX + profileId);

  if (cached) {
    console.log('Loading from localStorage:', profileId);
    return JSON.parse(cached);
  }

  console.log('Fetching fresh data for:', profileId);
  const response = await fetch(path);
  const data = await response.json();

  localStorage.setItem(STORAGE_PREFIX + profileId, JSON.stringify(data));

  return data;
}

export function saveStrategy(profileId: string, strategy: CaseStrategy): void {
  localStorage.setItem(STORAGE_PREFIX + profileId, JSON.stringify(strategy));
}

export function clearStrategy(profileId: string): void {
  localStorage.removeItem(STORAGE_PREFIX + profileId);
}

export function clearAllStrategies(): void {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(STORAGE_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
}
