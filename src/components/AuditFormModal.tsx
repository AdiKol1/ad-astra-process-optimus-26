import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuditForm } from "@/contexts/AuditFormContext";
import AuditForm from "./AuditForm";

export function AuditFormModal() {
  const { isOpen, closeAuditForm } = useAuditForm();

  return (
    <Dialog open={isOpen} onOpenChange={closeAuditForm}>
      <DialogContent className="max-w-3xl">
        <AuditForm />
      </DialogContent>
    </Dialog>
  );
}