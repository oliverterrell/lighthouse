import { Fragment } from 'react';

export const calculateProgress = (criterion: any): number => {
  if (!criterion.instances || criterion.instances.length === 0) return 0;

  let totalFields = 0;
  let completedFields = 0;

  criterion.instances.forEach((instance: any) => {
    instance.fields.forEach((field: any) => {
      totalFields++;
      if (field.value && field.value !== '' && !(Array.isArray(field.value) && field.value.length === 0)) {
        completedFields++;
      }
    });
  });

  return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
};

export const renderMarkdown = (text: string): React.ReactNode => {
  // Split by lines first to handle line breaks
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    // Split each line by bold (**text**) and italic (*text*) patterns
    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    const rendered = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={partIdx} style={{ fontWeight: 700 }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={partIdx} style={{ fontStyle: 'italic' }}>
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
    return (
      <Fragment key={lineIdx}>
        {rendered}
        {lineIdx < lines.length - 1 && <br />}
      </Fragment>
    );
  });
};
