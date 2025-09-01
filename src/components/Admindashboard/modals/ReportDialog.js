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
import { AlertTriangle, BookOpen, Clock, User, Info, CheckCircle2 } from 'lucide-react';

const ReportDialog = ({
    isReportDialogOpen,
    setIsReportDialogOpen,
    selectedReport,
    handleReportStatus,
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
     // Priority icon function for reports
      const getPriorityIcon = (priority) => {
        const priorityLevel = priority ? priority.toLowerCase().replace(' priority', '') : 'low';
    
        switch (priorityLevel) {
          case 'critical':
            return <AlertTriangle className="h-5 w-5 text-red-600" />;
          case 'high':
            return <AlertCircle className="h-5 w-5 text-orange-600" />;
          case 'medium':
            return <Info className="h-5 w-5 text-yellow-600" />;
          case 'low':
            return <Clock className="h-5 w-5 text-blue-600" />;
          default:
            return <Info className="h-5 w-5 text-gray-600" />;
        }
      };
    
      // Priority badge function for reports
      const getPriorityBadge = (priority) => {
        const priorityLevel = priority ? priority.toLowerCase().replace(' priority', '') : 'low';
    
        switch (priorityLevel) {
          case 'critical':
            return 'bg-red-50 text-red-700 border-red-200';
          case 'high':
            return 'bg-orange-50 text-orange-700 border-orange-200';
          case 'medium':
            return 'bg-yellow-50 text-yellow-700 border-yellow-200';
          case 'low':
            return 'bg-blue-50 text-blue-700 border-blue-200';
          default:
            return 'bg-gray-50 text-gray-700 border-gray-200';
        }
      };

    return (
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] sm:w-full">
                <DialogHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            {selectedReport && (
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                    {getPriorityIcon(selectedReport.priority)}
                                </div>
                            )}
                            <div>
                                <DialogTitle className="text-lg font-semibold text-gray-900">
                                    User Report Details
                                </DialogTitle>
                                <DialogDescription className="text-sm text-gray-600 mt-1">
                                    Review and manage this user report
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {selectedReport && (
                    <div className="space-y-4 sm:space-y-6 pt-2 max-h-[60vh] overflow-y-auto">
                        {/* Report Message */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium text-gray-900">Report Details</h4>
                            </div>
                            <div className="rounded-lg border bg-gray-50 p-3 sm:p-4">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {selectedReport.details || selectedReport.description || selectedReport.reason}
                                </p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Reporter Information */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <h4 className="text-sm font-medium text-gray-900">Reporter Information</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Reporter:</span>
                                        <span className="font-medium text-gray-900">
                                            {selectedReport.reporterName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-mono text-xs text-gray-700">
                                            {selectedReport.reporterEmail}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Reported Content Information */}
                            {selectedReport.bookId && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-gray-500" />
                                        <h4 className="text-sm font-medium text-gray-900">Reported Content</h4>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Book Title:</span>
                                            <span className="font-medium text-gray-900">
                                                {selectedReport.bookId?.title}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Price:</span>
                                            <span className="font-mono text-xs text-gray-700">
                                                {selectedReport.bookId?.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Reported User Information (if applicable) */}
                            {selectedReport.reportedUserId && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-gray-500" />
                                        <h4 className="text-sm font-medium text-gray-900">Reported User</h4>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Username:</span>
                                            <span className="font-medium text-gray-900">
                                                {selectedReport.reportedUserId?.name || selectedReport.reportedUserId?._id}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-mono text-xs text-gray-700">
                                                {selectedReport.reportedUserId?.email}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* System Information */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <h4 className="text-sm font-medium text-gray-900">Report Information</h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Report Type:</span>
                                    <span className="font-mono text-xs text-gray-700">{selectedReport.reportType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Priority Level:</span>
                                    <Badge variant="outline" className={`${getPriorityBadge(selectedReport.priority)} text-xs`}>
                                        {selectedReport.priority}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Submitted:</span>
                                    <span className="text-gray-900">{formatDate(selectedReport.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    {selectedReport.status === "resolved" ? (
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
                                {selectedReport.category && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Category:</span>
                                        <span className="text-gray-900">{selectedReport.category}</span>
                                    </div>
                                )}
                                {selectedReport.status === "resolved" && selectedReport.resolvedAt && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Resolved:</span>
                                        <span className="text-gray-900">{formatDate(selectedReport.resolvedAt)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter className="gap-2 pt-4 flex flex-row overflow-x-auto py-2">
                    <Button variant="outline" onClick={() => setIsReportDialogOpen(false)} className="shrink-0 text-xs px-3 py-1 h-8 sm:text-sm sm:px-4 sm:py-2 sm:h-9">
                        <X className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                        Close
                    </Button>
                    {selectedReport?.status !== "resolved" && (
                        <>
                            <Button variant="outline" className="shrink-0 text-xs px-3 py-1 h-8 sm:text-sm sm:px-4 sm:py-2 sm:h-9">
                                <Mail className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                                Contact Reporter
                            </Button>
                            <Button
                                onClick={() => { handleReportStatus(selectedReport._id, 'resolved'), setIsReportDialogOpen(false) }}
                                className="bg-green-600 hover:bg-green-700 shrink-0 text-xs px-3 py-1 h-8 sm:text-sm sm:px-4 sm:py-2 sm:h-9">
                                <CheckCircle className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                                Mark as Resolved
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ReportDialog;