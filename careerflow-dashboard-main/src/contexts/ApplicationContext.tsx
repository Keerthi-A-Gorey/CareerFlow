import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Application, ResumeVersion } from '@/types/application';
import { useEffect } from "react";
import api from "@/lib/api";

interface AddResumeData {
  name: string;
  description?: string;
  file?: File | null;
}

interface ApplicationContextType {
  applications: Application[];
  resumeVersions: ResumeVersion[];
  addApplication: (app: any) => Promise<void>;
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

  const addApplication = async (app: any) => {
    try {
      await api.post("/applications", {
        company: app.company,
        role: app.role,
        type: "Intern",
        source: app.source,
        resumeVersionId: app.resumeVersionId || null,
        notes: ""
      });

      await fetchApplications();
    } catch (err) {
      console.error("Add application failed", err);
    }
  };

  const updateApplication = async (id: string, updates: Partial<Application>) => {
    try {
      if (updates.status) {
        await api.patch(`/applications/${id}/status`, {
          status: updates.status.charAt(0).toUpperCase() + updates.status.slice(1)
        });
      }
      await fetchApplications();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      await api.delete(`/applications/${id}`);
      await fetchApplications();
    } catch (err) {
      console.error("Delete failed", err);
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
      await fetchResumes();
    } catch (err) {
      console.error("Delete resume failed", err);
      throw err;
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(
        res.data.map((a: any) => ({
          id: a._id,
          company: a.company,
          role: a.role,
          status: a.currentStatus.toLowerCase(),
          source: a.source.toLowerCase(),
          resumeVersion: a.resumeVersionId?.label || "",
          appliedDate: a.appliedAt
        }))
      );
    } catch (err) {
      console.error("Failed to load applications", err);
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await api.get("/resumes");
      setResumeVersions(
        res.data.map((r: any) => ({
          id: r._id,
          name: r.label,
          description: r.description || "",
          fileUrl: r.fileUrl || "",
          fileName: r.fileName || "",
          fileType: r.fileType || "",
          fileSize: r.fileSize || 0,
          createdAt: r.createdAt,
          applicationsCount: r.applicationsCount || 0
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
