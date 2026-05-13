import { useState } from 'react';
import { Trash2, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApplications } from '@/contexts/ApplicationContext';
import { StatusBadge } from './StatusBadge';
import { SourceBadge } from './SourceBadge';
import { ApplicationStatus } from '@/types/application';

export function ApplicationsTable() {
  const { applications, updateApplication, deleteApplication } = useApplications();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredApplications = statusFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    updateApplication(id, { status: newStatus });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="oa">Online Assessment</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="hidden md:table-cell">Resume</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.company}</TableCell>
                <TableCell>{app.role}</TableCell>
                <TableCell>
                  <StatusBadge status={app.status} />
                </TableCell>
                <TableCell>
                  <SourceBadge source={app.source} />
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {app.resumeVersion || '-'}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {new Date(app.appliedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'oa')}>
                        Move to OA
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'interview')}>
                        Move to Interview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'offer')}>
                        Mark as Offer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'rejected')}>
                        Mark as Rejected
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteApplication(app.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredApplications.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
