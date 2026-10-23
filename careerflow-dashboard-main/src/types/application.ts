export type ApplicationStatus = 'applied' | 'oa' | 'interview' | 'offer' | 'rejected' | 'withdrawn';

export type ApplicationSource = 'linkedin' | 'referral' | 'career_page' | 'other';

export interface AddApplicationData {
  company: string;
  role: string;
  source: ApplicationSource;
  resumeVersionId?: string;
}

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
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  createdAt: string;
  applicationsCount: number;
}
