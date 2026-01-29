export interface Field {
  name: string;
  label: string;
  type: 'text' | 'date' | 'file' | 'files' | 'url' | 'files_or_urls';
  required: boolean;
  hint?: string;
  value?: any;
}

export interface Instance {
  id: string;
  title: string;
  fields: Field[];
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
  guidance: string;
  instances: Instance[];
}

export interface DemographicInformation {
  fields: Field[];
}

export interface CaseStrategy {
  applicant_name: string;
  profile_type: string;
  demographic_information: DemographicInformation;
  criteria: Criterion[];
}
