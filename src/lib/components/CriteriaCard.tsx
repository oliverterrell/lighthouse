import { Criterion, Status } from '@/lib/enums';
import { criteriaExplanations, criteriaTitleMap } from '@/lib/constants';
import React, { useRef, useState } from 'react';
import { TrendingUp, Award, Lightbulb, Crown, Trophy, Newspaper, Scale, BookOpen } from 'lucide-react';

interface CriteriaCardProps {
  criteriaType: Criterion;
  progress: number; // 0-100
  status: Status;
  onClick: () => void;
  instanceCount?: number;
  title: string;
  description?: string;
  guidance?: string;
}

const criteriaConfig = {
  [Criterion.HighRemuneration]: {
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    progressColor: 'bg-emerald-500',
    icon: TrendingUp,
  },
  [Criterion.Membership]: {
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    progressColor: 'bg-orange-500',
    icon: Trophy,
  },
  [Criterion.OriginalContributions]: {
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    progressColor: 'bg-blue-500',
    icon: Lightbulb,
  },
  [Criterion.CriticalRole]: {
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    progressColor: 'bg-purple-500',
    icon: Crown,
  },
  [Criterion.Awards]: {
    color: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
    progressColor: 'bg-yellow-500',
    icon: Award,
  },
  [Criterion.Press]: {
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-700',
    progressColor: 'bg-rose-500',
    icon: Newspaper,
  },
  [Criterion.Judging]: {
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    progressColor: 'bg-indigo-500',
    icon: Scale,
  },
  [Criterion.ScholarlyArticles]: {
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-700',
    progressColor: 'bg-teal-500',
    icon: BookOpen,
  },
};

const statusConfig = {
  [Status.NotStarted]: { label: 'Not Started', color: 'bg-gray-100 text-gray-600' },
  [Status.InProgress]: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  [Status.ReadyForReview]: { label: 'Needs Review', color: 'bg-amber-100 text-amber-700' },
  [Status.Complete]: { label: 'Complete', color: 'bg-green-100 text-green-700' },
};

export const CriteriaCard: React.FC<CriteriaCardProps> = ({
  criteriaType,
  progress,
  status,
  onClick,
  title,
  instanceCount,
  description,
  guidance,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('bottom');
  const cardRef = useRef<HTMLDivElement>(null);
  const config = criteriaConfig[criteriaType];

  const Icon = config.icon;
  const statusInfo = statusConfig[status];
  const explanation = criteriaExplanations[title];

  return (
    <div
      ref={cardRef}
      title={'Click to view'}
      style={{ position: 'relative' }}
      onMouseEnter={() => {
        if (cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          setTooltipPosition(spaceBelow < 300 ? 'top' : 'bottom');
        }
        setShowTooltip(true);
      }}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        onClick={onClick}
        className={`relative w-[340px] overflow-hidden rounded-xl border-2 ${config.borderColor} ${config.bgColor} flex h-full cursor-pointer flex-col p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`}
      >
        {/* Icon and Status Badge */}
        <div className="mb-4 flex items-start justify-between">
          <div className={`rounded-lg bg-gradient-to-br p-3 ${config.color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
        </div>

        {/* Title and Description */}
        <div className="mb-4 flex-grow">
          <h3 className={`text-lg font-semibold ${config.textColor} mb-1`}>{title}</h3>
          {description && <p className="line-clamp-2 text-sm text-gray-600">{description}</p>}
          {instanceCount && (
            <p className="mt-1 text-xs text-gray-500">
              {instanceCount} {instanceCount === 1 ? 'instance' : 'instances'}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gray-500">Progress</span>
            <span className={`font-semibold ${config.textColor}`}>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full ${config.progressColor} rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Hover indicator */}
        <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent transition-colors hover:border-gray-300" />
      </div>

      {/* Tooltip */}
      {showTooltip && explanation && (
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            position: 'absolute',
            ...(tooltipPosition === 'bottom' ? { top: '100%', marginTop: '12px' } : { bottom: '100%', marginBottom: '12px' }),
            left: '50%',
            transform: 'translateX(-50%)',
            width: '420px',
            background: 'rgba(24, 24, 27, 0.98)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            zIndex: 50,
            pointerEvents: 'auto',
          }}
        >
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              ...(tooltipPosition === 'bottom'
                ? { top: '-6px', borderRight: 'none', borderBottom: 'none' }
                : { bottom: '-6px', borderLeft: 'none', borderTop: 'none' }),
              left: '50%',
              width: '12px',
              height: '12px',
              background: 'rgba(24, 24, 27, 0.98)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transform: 'translateX(-50%) rotate(45deg)',
              zIndex: -1,
            }}
          />

          <div style={{ position: 'relative' }}>
            {/* Title */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div className={`rounded-md bg-gradient-to-br p-1.5 ${config.color}`}>
                  <Icon style={{ width: '14px', height: '14px', color: 'white' }} />
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'white', margin: 0 }}>{title}</h4>
              </div>
              {description && <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, fontStyle: 'italic' }}>{description}</p>}
            </div>

            {/* What */}
            <div style={{ marginBottom: '10px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#3b82f6', marginBottom: '4px', textTransform: 'uppercase' }}>
                What it is
              </p>
              <p style={{ fontSize: '12px', color: '#d1d5db', margin: 0, lineHeight: '1.5' }}>{explanation.what}</p>
            </div>

            {/* Why */}
            <div style={{ marginBottom: '10px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#10b981', marginBottom: '4px', textTransform: 'uppercase' }}>
                Why it matters
              </p>
              <p style={{ fontSize: '12px', color: '#d1d5db', margin: 0, lineHeight: '1.5' }}>{explanation.why}</p>
            </div>

            {/* How to prove */}
            <div>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#f59e0b', marginBottom: '4px', textTransform: 'uppercase' }}>
                How to prove it
              </p>
              <p style={{ fontSize: '12px', color: '#d1d5db', margin: 0, lineHeight: '1.5' }}>{explanation.howToProve}</p>
            </div>

            {/* Guidance if available */}
            {guidance && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#8b5cf6', marginBottom: '4px', textTransform: 'uppercase' }}>
                  For your case
                </p>
                <p style={{ fontSize: '12px', color: '#d1d5db', margin: 0, lineHeight: '1.5' }}>{guidance}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
