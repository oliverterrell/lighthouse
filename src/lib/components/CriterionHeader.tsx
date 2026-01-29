'use client';

import { CriteriaExamplesTooltipContent } from '@/lib/components/CriteriaExamplesTooltipContent';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Info } from 'lucide-react';
import { Crown, TrendingUp, Lightbulb, Trophy, Award, Newspaper, Scale, BookOpen } from 'lucide-react';
import React, { useState } from 'react';
import { criteriaGradients } from '@/lib/constants';
import criterionExamplesJson from '@/lib/criterion-examples.json';

interface CriterionHeaderProps {
  name: string;
  description: string;
  guidance: string;
  progress: number;
}

const criteriaIcons: Record<string, any> = {
  'Critical Role': Crown,
  'High Remuneration': TrendingUp,
  'Original Contributions': Lightbulb,
  Membership: Trophy,
  Awards: Award,
  Press: Newspaper,
  Judging: Scale,
  'Scholarly Articles': BookOpen,
};

const criteriaColors: Record<string, string> = {
  'Critical Role': 'from-purple-500 to-violet-600',
  'High Remuneration': 'from-emerald-500 to-green-600',
  'Original Contributions': 'from-blue-500 to-indigo-600',
  Membership: 'from-orange-500 to-amber-600',
  Awards: 'from-yellow-500 to-amber-600',
  Press: 'from-rose-500 to-pink-600',
  Judging: 'from-indigo-500 to-blue-600',
  'Scholarly Articles': 'from-teal-500 to-cyan-600',
};

export const CriterionHeader: React.FC<CriterionHeaderProps> = ({ name, description, guidance, progress }) => {
  const router = useRouter();
  const Icon = criteriaIcons[name] || Info;
  const colorGradient = criteriaColors[name] || 'from-gray-500 to-gray-600';
  const [showTooltip, setShowTooltip] = useState(false);
  const criterionExamples = criterionExamplesJson.criteria_examples.find((criterion) => criterion.name === name);

  return (
    <div style={{ marginBottom: '48px', maxWidth: '80%', margin: '0 auto 48px' }}>
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px',
          padding: '8px 16px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          color: '#9ca3af',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.color = '#9ca3af';
        }}
      >
        <ArrowLeft style={{ width: '18px', height: '18px' }} />
        Back to Overview
      </button>

      {/* Header Card */}
      <div
        style={{
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(24, 24, 27, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '32px',
          position: 'relative',
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              className={`bg-gradient-to-br ${colorGradient}`}
              style={{
                padding: '16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon style={{ width: '32px', height: '32px', color: 'white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>{name}</h1>
              <p style={{ fontSize: '15px', color: '#9ca3af' }}>{description}</p>
            </div>

            <Info
              style={{
                position: 'absolute',
                top: '20px',
                right: '32px',
                cursor: 'pointer',
                width: '20px',
                height: '20px',
                color: '#9ca3af',
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '64px',
                  width: '780px',
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
                {/* Arrow - now on the right side */}
                <div
                  style={{
                    position: 'absolute',
                    top: '42px',
                    right: '-6px',
                    width: '12px',
                    height: '12px',
                    background: 'rgba(24, 24, 27, 0.98)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderLeft: 'none',
                    borderBottom: 'none',
                    transform: 'rotate(45deg)',
                    zIndex: -1,
                  }}
                />

                <div style={{ position: 'relative' }}>
                  <CriteriaExamplesTooltipContent
                    criterionExamples={criterionExamples}
                    name={name}
                    guidance={guidance}
                    setTooltipHook={[showTooltip, setShowTooltip]}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Guidance */}
        <div
          style={{
            marginBottom: '24px',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            background: 'rgba(59, 130, 246, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Info style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6', textTransform: 'uppercase' }}>
              Strategy Guidance
            </span>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#d1d5db', margin: 0 }}>{guidance}</p>
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af' }}>Overall Progress</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>{progress}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: `linear-gradient(to right, ${(criteriaGradients[name] || ['#6b7280', '#6b7280'])[0]}, ${(criteriaGradients[name] || ['#6b7280', '#6b7280'])[1]})`,
                height: '100%',
                width: `${progress}%`,
                transition: 'width 0.5s ease',
                borderRadius: '9999px',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
