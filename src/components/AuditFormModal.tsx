import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuditForm } from "@/contexts/AuditFormContext";
import AuditForm from "./AuditForm";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function AuditFormModal() {
  const { isOpen, closeAuditForm } = useAuditForm();

  return (
    <Dialog open={isOpen} onOpenChange={closeAuditForm}>
      <DialogContent className="max-w-3xl" aria-describedby="audit-form-desc">
        <DialogTitle asChild>
          <VisuallyHidden>Process Audit Form</VisuallyHidden>
        </DialogTitle>
        <p id="audit-form-desc" className="sr-only">
          Complete the audit form to receive your process optimization report
        </p>
        <AuditForm />
      </DialogContent>
    </Dialog>
  );
}