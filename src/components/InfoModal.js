"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react"; // shadcn + lucide icons

export default function InfoModal({ open, onClose, title = "Notice", message }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl shadow-lg">
        <DialogHeader className="flex flex-row items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {title}
          </DialogTitle>
        </DialogHeader>

          <p className="text-gray-600 leading-relaxed">{message}</p>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
