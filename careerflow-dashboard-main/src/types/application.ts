export type ApplicationStatus = 'applied' | 'oa' | 'interview' | 'offer' | 'rejected';

export type ApplicationSource = 'linkedin' | 'indeed' | 'company_website' | 'referral' | 'other';

export interface Application {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  source: ApplicationSource;
  resumeVersion?: string;
  appliedDate: string;
  notes?: string;
}

export interface ResumeVersion {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  applicationsCount: number;
}
