import { Criterion } from '@/lib/enums';

export const criteriaTitleMap = {
  [Criterion.HighRemuneration]: 'High Remuneration',
  [Criterion.Membership]: 'Membership',
  [Criterion.OriginalContributions]: 'Original Contributions',
  [Criterion.CriticalRole]: 'Critical Role',
  [Criterion.Awards]: 'Awards',
  [Criterion.Press]: 'Press',
  [Criterion.Judging]: 'Judging',
  [Criterion.ScholarlyArticles]: 'Scholarly Articles',
};

export const criteriaExplanations: Record<string, any> = {
  'Critical Role': {
    what: 'Demonstrates employment in a critical or essential capacity for organizations with a distinguished reputation.',
    why: 'USCIS wants to see that you held significant responsibility and made meaningful impact at well-regarded organizations.',
    howToProve:
      "Provide offer letters, org charts showing your position, project documentation, and evidence of the company's reputation.",
  },
  'High Remuneration': {
    what: 'Proves you command a high salary or remuneration compared to others in your field.',
    why: 'High compensation is a market signal of extraordinary ability—employers pay top dollar for top talent.',
    howToProve:
      "Submit recent paystubs, offer letters, equity documentation, and salary comparison data showing you're in the top percentile.",
  },
  'Original Contributions': {
    what: 'Shows original work of major significance that has advanced your field.',
    why: 'USCIS looks for evidence that your contributions have been recognized and adopted by others in your industry.',
    howToProve:
      'Document patents, open-source projects with adoption metrics, published research, industry citations, or innovative products.',
  },
  Membership: {
    what: 'Membership in associations that require outstanding achievements, judged by recognized experts.',
    why: 'Selective organizations only admit individuals who have demonstrated exceptional accomplishment in their field.',
    howToProve:
      "Provide acceptance letters, membership certificates, and documentation of the organization's selective admission criteria.",
  },
  Awards: {
    what: 'Recognition through nationally or internationally recognized prizes or awards for excellence.',
    why: 'Awards are third-party validation of your extraordinary ability from respected institutions or competitions.',
    howToProve: "Submit award certificates, announcement letters, and documentation of the award's prestige and selection process.",
  },
  Press: {
    what: 'Published material about you in professional publications, major trade publications, or major media.',
    why: 'Media coverage indicates that your work is noteworthy enough to attract attention from reputable outlets.',
    howToProve: 'Provide article links or PDFs, showing your name and discussing your professional achievements.',
  },
  Judging: {
    what: "Participation as a judge of others' work in your field, either individually or on a panel.",
    why: 'Being asked to judge demonstrates that peers and organizations recognize you as an expert authority.',
    howToProve:
      'Submit invitation letters, judging certificates, conference programs listing you as a reviewer, or grant panel documentation.',
  },
  'Scholarly Articles': {
    what: 'Authorship of scholarly articles in professional journals or major media in your field.',
    why: 'Publications demonstrate that your research and ideas have been peer-reviewed and deemed worthy of publication.',
    howToProve: 'Provide copies of publications, citation metrics, journal impact factors, and your role as author.',
  },
};

export const criteriaGradients: Record<string, [string, string]> = {
  'Critical Role': ['#a855f7', '#7c3aed'],
  'High Remuneration': ['#22c55e', '#16a34a'],
  'Original Contributions': ['#3b82f6', '#4f46e5'],
  Membership: ['#f97316', '#d97706'],
  Awards: ['#eab308', '#d97706'],
  Press: ['#f43f5e', '#ec4899'],
  Judging: ['#6366f1', '#3b82f6'],
  'Scholarly Articles': ['#14b8a6', '#06b6d4'],
};
