import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Application, ResumeVersion } from '@/types/application';
import { useEffect } from "react";
import api from "@/lib/api";

interface ApplicationContextType {
  applications: Application[];
  resumeVersions: ResumeVersion[];
  addApplication: (app: any) => void;
  updateApplication: (id: string, app: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  addResumeVersion: (resume: Omit<ResumeVersion, 'id' | 'applicationsCount'>) => void;
  deleteResumeVersion: (id: string) => void;
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
      source: app.source,                 // LinkedIn / Referral / Career Page
      resumeVersionId: app.resumeVersionId || null,
      notes: ""
    });

    fetchApplications();
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
    fetchApplications();
  } catch (err) {
    console.error("Update failed", err);
  }
};


const deleteApplication = async (id: string) => {
  try {
    await api.delete(`/applications/${id}`);
    fetchApplications();
  } catch (err) {
    console.error("Delete failed", err);
  }
};


const addResumeVersion = async (resume) => {
  try {
    await api.post("/resumes", {
      label: resume.name
    });
    fetchResumes();
  } catch (err) {
    console.error("Add resume failed", err);
  }
};


const deleteResumeVersion = async (id: string) => {
  try {
    await api.delete(`/resumes/${id}`);
    fetchResumes();
  } catch (err) {
    console.error("Delete resume failed", err);
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
        description: "",
        createdAt: r.createdAt,
        applicationsCount: 0
      }))
    );
  } catch (err) {
    console.error("Failed to load resumes", err);
  }
};

  return (
    <ApplicationContext.Provider value={{
      applications,
      resumeVersions,
      addApplication,
      updateApplication,
      deleteApplication,
      addResumeVersion,
      deleteResumeVersion,
    }}>
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
