import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuditForm } from '@/contexts/AuditFormContext';
import AuditForm from './AuditForm';

export function AuditFormModal() {
  const { isOpen, closeAuditForm } = useAuditForm();

  return (
    <Dialog open={isOpen} onOpenChange={closeAuditForm}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Process Audit Assessment</DialogTitle>
          <DialogDescription>
            Complete this form to receive your personalized process optimization analysis.
          </DialogDescription>
        </DialogHeader>
        <AuditForm />
      </DialogContent>
    </Dialog>
  );
}