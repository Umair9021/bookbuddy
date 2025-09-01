import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { X, Mail, CheckCircle } from 'lucide-react';
import { AlertTriangle, Flag, BookOpen, Clock, User, CheckCircle2 } from 'lucide-react';

const WarningDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedWarning,
  handleWarningStatus
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Flag className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <Flag className="h-5 w-5 text-blue-500" />;
      default:
        return <Flag className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (severity) {
      case 'high':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] sm:w-full">
        <DialogHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {selectedWarning && (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  {getSeverityIcon(selectedWarning.severity)}
                </div>
              )}
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  System Warning Details
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-1">
                  Review and manage this security alert
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {selectedWarning && (
          <div className="space-y-4 sm:space-y-6 pt-2 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-900">Warning Message</h4>
              </div>
              <div className="rounded-lg border bg-gray-50 p-3 sm:p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedWarning.message}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <h4 className="text-sm font-medium text-gray-900">User Information</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Username:</span>
                    <span className="font-medium text-gray-900">
                      {selectedWarning.userId?.name || selectedWarning.userId?._id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-mono text-xs text-gray-700">
                      {selectedWarning.userId?.email}
                    </span>
                  </div>
                </div>
              </div>

              {selectedWarning.bookId && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <h4 className="text-sm font-medium text-gray-900">Related Content</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Book Title:</span>
                      <span className="font-medium text-gray-900">
                        {selectedWarning.bookId?.title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-mono text-xs text-gray-700">
                        {selectedWarning.bookId?.price}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <h4 className="text-sm font-medium text-gray-900">System Information</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Warning ID:</span>
                  <span className="font-mono text-xs text-gray-700"></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Severity Level:</span>
                  <Badge variant="outline" className={`${getSeverityBadge(selectedWarning.severity)} text-xs`}>
                    {selectedWarning.severity}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">{formatDate(selectedWarning.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  {selectedWarning.isResolved ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Resolved
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
                {selectedWarning.isResolved && selectedWarning.resolvedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolved:</span>
                    <span className="text-gray-900">{formatDate(selectedWarning.resolvedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 pt-4 flex flex-row overflow-x-auto py-2">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="shrink-0 text-xs px-3 py-1 h-8 sm:text-sm sm:px-4 sm:py-2 sm:h-9">
            <X className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
            Close
          </Button>
          {!selectedWarning?.isResolved && (
            <>
              <Button variant="outline" className="shrink-0 text-xs px-3 py-1 h-8 sm:text-sm sm:px-4 sm:py-2 sm:h-9">
                <Mail className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                Send Message
              </Button>
              <Button
                onClick={() => { handleWarningStatus(selectedWarning, 'resolved', selectedWarning.bookId), setIsDialogOpen(false) }}
                className="bg-green-600 hover:bg-green-700 shrink-0 text-xs px-3 py-1 h-8 sm:text-sm sm:px-4 sm:py-2 sm:h-9">
                <CheckCircle className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                Mark as Resolved
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarningDialog;