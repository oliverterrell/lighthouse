import React from 'react';
import { criteriaGradients } from '@/lib/constants';

const ExampleInstance = ({ example, isGood }) => {
  const borderColor = isGood ? 'rgba(134, 239, 172, 0.2)' : 'rgba(240, 128, 128, 0.2)';
  const accentColor = isGood ? '#86efac' : '#f08080';

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.2)',
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        padding: '12px',
        marginTop: '8px',
      }}
    >
      {/* Instance Title */}
      <div
        style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#f3f4f6',
          marginBottom: '8px',
          paddingBottom: '6px',
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        {example.title}
      </div>

      {/* Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {example.fields.map((field, idx) => {
          // Skip empty fields
          if (!field.value || (Array.isArray(field.value) && field.value.length === 0)) {
            return null;
          }

          return (
            <div key={idx} style={{ fontSize: '11px' }}>
              <span style={{ color: '#9ca3af', fontWeight: '500' }}>{field.label || field.name}: </span>
              <span style={{ color: '#d1d5db' }}>
                {Array.isArray(field.value) ? (
                  <span style={{ fontStyle: 'italic' }}>{field.value.length} file(s) provided</span>
                ) : (
                  field.value
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Why this is good/bad */}
      {example.why_this_is_good && (
        <div
          style={{
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '11px',
            color: '#9ca3af',
            fontStyle: 'italic',
            lineHeight: '1.5',
          }}
        >
          <span style={{ color: accentColor, fontWeight: '600', fontStyle: 'normal' }}>Why this works: </span>
          {example.why_this_is_good}
        </div>
      )}
      {example.why_this_is_bad && (
        <div
          style={{
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '11px',
            color: '#9ca3af',
            fontStyle: 'italic',
            lineHeight: '1.5',
          }}
        >
          <span style={{ color: accentColor, fontWeight: '600', fontStyle: 'normal' }}>Why this fails: </span>
          {example.why_this_is_bad}
        </div>
      )}
    </div>
  );
};

const CharacteristicsList = ({ characteristics, isGood }) => {
  const color = isGood ? '#86efac' : '#f08080';
  const icon = isGood ? '✓' : '✗';

  return (
    <ul style={{ margin: '8px 0 0 0', padding: '0 0 0 16px', fontSize: '11px' }}>
      {characteristics.map((item, idx) => (
        <li
          key={idx}
          style={{
            color: '#d1d5db',
            marginBottom: '4px',
            lineHeight: '1.5',
          }}
        >
          <span style={{ color, fontWeight: '600', marginRight: '4px' }}>{icon}</span>
          {item}
        </li>
      ))}
    </ul>
  );
};

export const CriteriaExamplesTooltipContent = ({ criterionExamples, guidance, name, setTooltipHook }) => {
  if (!criterionExamples) {
    return null;
  }

  const [showTooltip, setShowTooltip] = setTooltipHook;

  const { good_vs_bad_guidance, good_example, bad_example } = criterionExamples;

  return (
    <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} style={{ position: 'relative' }}>
      <div className={'flex items-center gap-x-1.5'}>
        <h3
          style={{
            fontSize: '14px',
            color: criteriaGradients[name][1],
            fontWeight: '600',
            textTransform: 'uppercase',
          }}
        >
          What should I provide?
        </h3>
      </div>

      <div style={{ marginTop: '12px', paddingTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {/* Main guidance text */}
        <p style={{ fontSize: '12px', color: '#d1d5db', margin: 0, lineHeight: '1.5' }}>{guidance}</p>

        {/* Good vs Bad Characteristics */}
        {good_vs_bad_guidance && (
          <div style={{ marginTop: '12px' }}>
            {/* Good characteristics */}
            {good_vs_bad_guidance.good_characteristics && (
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    color: '#86efac',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    margin: '8px 0 0 0',
                  }}
                >
                  Strong Evidence Includes:
                </p>
                <CharacteristicsList characteristics={good_vs_bad_guidance.good_characteristics} isGood={true} />
              </div>
            )}

            {/* Bad characteristics */}
            {good_vs_bad_guidance.bad_characteristics && (
              <div style={{ marginTop: '8px' }}>
                <p
                  style={{
                    fontSize: '11px',
                    color: '#f08080',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    margin: '8px 0 0 0',
                  }}
                >
                  Weak Evidence Includes:
                </p>
                <CharacteristicsList characteristics={good_vs_bad_guidance.bad_characteristics} isGood={false} />
              </div>
            )}
          </div>
        )}

        {/* Good Example */}
        {good_example && (
          <div style={{ marginTop: '16px' }}>
            <p
              style={{
                fontSize: '11px',
                color: '#86efac',
                fontWeight: '600',
                textTransform: 'uppercase',
                marginBottom: '0',
              }}
            >
              ✓ Good Example
            </p>
            <ExampleInstance example={good_example} isGood={true} />
          </div>
        )}

        {/* Bad Example */}
        {bad_example && (
          <div style={{ marginTop: '12px' }}>
            <p
              style={{
                fontSize: '11px',
                color: '#f08080',
                fontWeight: '600',
                textTransform: 'uppercase',
                marginBottom: '0',
              }}
            >
              ✗ Bad Example
            </p>
            <ExampleInstance example={bad_example} isGood={false} />
          </div>
        )}
      </div>
    </div>
  );
};
