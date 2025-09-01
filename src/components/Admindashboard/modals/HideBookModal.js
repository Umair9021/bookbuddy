import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const HideBookModal = ({
  hideBookModal,
  setHideBookModal,
  hideBookReason,
  setHideBookReason,
  selectedBook,
  handleHideBookWithReason
}) => {
  return (
    <Dialog open={hideBookModal} onOpenChange={setHideBookModal}>
      <DialogContent className="sm:max-w-lg rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Hide Book</DialogTitle>
          <DialogDescription className="flex items-center text-sm text-muted-foreground mt-1">
            <span className="mr-2">ℹ️</span>
            Provide a clear reason for hiding this book. The seller will be notified immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          <Label htmlFor="reason" className="text-sm font-medium">
            Reason for Hiding
          </Label>
          <Textarea
            id="reason"
            value={hideBookReason}
            onChange={(e) => setHideBookReason(e.target.value)}
            className="min-h-[100px] resize-none"
            placeholder="e.g., Inappropriate content, duplicate listing, incorrect information..."
          />
          <p className="text-xs text-muted-foreground">
            Please be specific. This helps the seller understand and improves marketplace quality.
          </p>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setHideBookModal(false);
              setHideBookReason("");
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleHideBookWithReason(selectedBook, hideBookReason)}
          >
            Hide Book & Notify Seller
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HideBookModal;