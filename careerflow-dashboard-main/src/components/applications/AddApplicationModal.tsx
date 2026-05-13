import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApplications } from "@/contexts/ApplicationContext";

interface AddApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddApplicationModal({ open, onOpenChange }: AddApplicationModalProps) {
  const { addApplication, resumeVersions } = useApplications();

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    source: "LinkedIn",
    resumeVersionId: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company || !formData.role) return;

    await addApplication({
      company: formData.company,
      role: formData.role,
      source: formData.source,
      resumeVersionId: formData.resumeVersionId || undefined,
    } as any);

    setFormData({
      company: "",
      role: "",
      source: "LinkedIn",
      resumeVersionId: ""
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
              placeholder="e.g., Google"
              required
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
              placeholder="e.g., Software Engineer Intern"
              required
            />
          </div>

          {/* Source */}
          <div className="space-y-2">
            <Label>Source</Label>
            <Select
              value={formData.source}
              onValueChange={(value) => setFormData((p) => ({ ...p, source: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Career Page">Career Page</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resume Version */}
          <div className="space-y-2">
            <Label>Resume Version</Label>
            <Select
              value={formData.resumeVersionId}
              onValueChange={(value) => setFormData((p) => ({ ...p, resumeVersionId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resume (optional)" />
              </SelectTrigger>
              <SelectContent>
                {resumeVersions.map((resume) => (
                  <SelectItem key={resume.id} value={resume.id}>
                    {resume.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Application</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
