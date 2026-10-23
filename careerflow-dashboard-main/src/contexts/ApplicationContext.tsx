import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AddApplicationData, Application, ApplicationSource, ApplicationStatus, ResumeVersion } from '@/types/application';
import { useEffect } from "react";
import api from "@/lib/api";

interface AddResumeData {
  name: string;
  description?: string;
  file?: File | null;
}

type BackendApplicationStatus = "Applied" | "OA" | "Interview" | "Offer" | "Rejected" | "Withdrawn";
type BackendApplicationSource = "LinkedIn" | "Referral" | "Career Page" | "Other";

interface ApplicationResponse {
  _id: string;
  company: string;
  role: string;
  currentStatus: BackendApplicationStatus;
  source: BackendApplicationSource;
  resumeVersionId?: { label: string } | null;
  appliedAt: string;
}

interface ResumeVersionResponse {
  _id: string;
  label: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  createdAt: string;
  applicationsCount?: number;
}

const statusFromBackend: Record<BackendApplicationStatus, ApplicationStatus> = {
  Applied: "applied",
  OA: "oa",
  Interview: "interview",
  Offer: "offer",
  Rejected: "rejected",
  Withdrawn: "withdrawn"
};

const sourceFromBackend: Record<BackendApplicationSource, ApplicationSource> = {
  LinkedIn: "linkedin",
  Referral: "referral",
  "Career Page": "career_page",
  Other: "other"
};

interface ApplicationContextType {
  applications: Application[];
  resumeVersions: ResumeVersion[];
  addApplication: (app: AddApplicationData) => Promise<void>;
  updateApplication: (id: string, app: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  addResumeVersion: (resume: AddResumeData) => Promise<void>;
  deleteResumeVersion: (id: string) => Promise<void>;
  refreshResumes: () => Promise<void>;
}

const ApplicationContext = createContext<ApplicationContextType | null>(null);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>([]);

  useEffect(() => {
    fetchApplications();
    fetchResumes();
  }, []);

  const addApplication = async (app: AddApplicationData) => {
    try {
      await api.post("/applications", {
        company: app.company,
        role: app.role,
        type: "Intern",
        source: app.source === "linkedin" ? "LinkedIn"
          : app.source === "career_page" ? "Career Page"
            : app.source === "referral" ? "Referral" : "Other",
        resumeVersionId: app.resumeVersionId || null,
        notes: ""
      });

      await fetchApplications();
    } catch (err) {
      console.error("Add application failed", err);
      throw err;
    }
  };

  const formatStatusForBackend = (status: string): string => {
    const lower = status.toLowerCase();
    if (lower === 'oa') return 'OA';
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const updateApplication = async (id: string, updates: Partial<Application>) => {
    try {
      if (updates.status) {
        await api.patch(`/applications/${id}/status`, {
          status: formatStatusForBackend(updates.status)
        });
      }
      await fetchApplications();
    } catch (err) {
      console.error("Update failed", err);
      throw err;
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      await api.delete(`/applications/${id}`);
      await fetchApplications();
    } catch (err) {
      console.error("Delete failed", err);
      throw err;
    }
  };

  const addResumeVersion = async (resume: AddResumeData) => {
    try {
      if (resume.file) {
        const formData = new FormData();
        formData.append("label", resume.name);
        if (resume.description) {
          formData.append("description", resume.description);
        }
        formData.append("file", resume.file);
        await api.post("/resumes", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await api.post("/resumes", {
          label: resume.name,
          description: resume.description || ""
        });
      }
      await fetchResumes();
    } catch (err) {
      console.error("Add resume failed", err);
      throw err;
    }
  };

  const deleteResumeVersion = async (id: string) => {
    try {
      await api.delete(`/resumes/${id}`);
      await Promise.all([fetchResumes(), fetchApplications()]);
    } catch (err) {
      console.error("Delete resume failed", err);
      throw err;
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await api.get<ApplicationResponse[]>("/applications");
      setApplications(
        res.data.map((application) => ({
          id: application._id,
          company: application.company,
          role: application.role,
          status: statusFromBackend[application.currentStatus],
          source: sourceFromBackend[application.source],
          resumeVersion: application.resumeVersionId?.label || "",
          appliedDate: application.appliedAt
        }))
      );
    } catch (err) {
      console.error("Failed to load applications", err);
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await api.get<ResumeVersionResponse[]>("/resumes");
      setResumeVersions(
        res.data.map((resume) => ({
          id: resume._id,
          name: resume.label,
          description: resume.description || "",
          fileUrl: resume.fileUrl || "",
          fileName: resume.fileName || "",
          fileType: resume.fileType || "",
          fileSize: resume.fileSize || 0,
          createdAt: resume.createdAt,
          applicationsCount: resume.applicationsCount || 0
        }))
      );
    } catch (err) {
      console.error("Failed to load resumes", err);
    }
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        resumeVersions,
        addApplication,
        updateApplication,
        deleteApplication,
        addResumeVersion,
        deleteResumeVersion,
        refreshResumes: fetchResumes
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
}
