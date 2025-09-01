import {
  AlertTriangle,
  Flag,
  Ban,
  CheckCircle,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Mail,
  User,
  Filter,
  Info,
  BookOpen
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const ReportsContent = ({
  warnings,
  reports,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  filteredItems,
  handleViewDetails,
  openReportDialog,
  handleUserStatusChange,
  handleWarningStatus,
  handleReportStatus
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

  const getStatusBadge = (warning) => {
    if (warning.isResolved) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Resolved
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Active
      </span>
    );
  };

  const getReportIcon = (reason) => {
    switch (reason) {
      case 'harassment':
      case 'scam':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'inappropriate_content':
      case 'fake_account':
        return <Flag className="h-5 w-5 text-orange-500" />;
      case 'spam':
        return <Ban className="h-5 w-5 text-yellow-500" />;
      case 'no_show':
      case 'condition_misrepresented':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getReportBadge = (priority) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (priority) {
      case 'critical':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'high':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getReportStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
    switch (status) {
      case 'resolved':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle className="h-3 w-3" />
            Resolved
          </span>
        );
      case 'investigating':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            <Eye className="h-3 w-3" />
            Investigating
          </span>
        );
      case 'action_taken':
        return (
          <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
            <CheckCircle2 className="h-3 w-3" />
            Action Taken
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-orange-100 text-orange-800`}>
            <Clock className="h-3 w-3" />
            Open
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Reports & Warnings
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
            Monitor and manage user reports and system alerts
          </p>
        </div>

        <div className="flex gap-4 sm:mt-0 mt-2">
          <span className="text-xs text-gray-600 sm:text-sm">
            Warnings: {warnings.length}
          </span>
          <span className="text-xs text-gray-600 sm:text-sm">
            Reports: {reports.length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 h-[calc(100vh-160px)] sm:h-135 overflow-hidden flex flex-col">
        <div className="flex flex-row items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-medium text-gray-700 text-sm sm:text-base">Items</h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center ml-70 sm:hidden gap-1 text-xs h-8"
          >
            <Filter className="h-3 w-3" />
          </Button>

          <div className="flex items-right gap-2 relative">
            <div className="hidden sm:flex gap-2 items-center">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-28 h-8 text-xs">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="report">Reports</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-28 h-8 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-xs w-32 md:w-40"
              />
            </div>

            {showFilters && (
              <div className="sm:hidden absolute top-full right-0 mt-2 bg-white p-3 rounded-lg border border-gray-200 shadow-lg z-10 w-64">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="warning">Warnings</SelectItem>
                        <SelectItem value="report">Reports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Search</label>
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-8 text-xs w-full"
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="w-full mt-2 text-xs"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-1 sm:p-2">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <p className="text-gray-600 font-medium text-sm sm:text-base">No matching items</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Try adjusting filters</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <div
                  key={`${item.type}-${item._id}`}
                  className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between p-3 gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1 w-full">
                      <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                        {item.type === 'warning' ? getSeverityIcon(item.severity) : getReportIcon(item.reason)}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xs font-semibold text-gray-900">
                            {item.type === 'warning' ? 'System Warning' : 'User Report'}
                          </h3>

                          <span
                            className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${item.type === 'warning'
                              ? getSeverityBadge(item.severity)
                              : getReportBadge(item.priority)
                              }`}
                          >
                            {item.type === 'warning'
                              ? `${item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}`
                              : `${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}`
                            }
                          </span>

                          {item.type === 'warning' ? getStatusBadge(item) : getReportStatusBadge(item.status)}
                        </div>

                        <p className="text-xs text-gray-700 line-clamp-2 leading-tight">
                          {item.type === 'warning' ? item.message : item.details}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.type === 'warning'
                              ? (item.userId?.name || 'Unknown')
                              : (item.reporterName || item.reporter?.name || 'Anonymous')
                            }
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 w-full sm:w-auto flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs font-medium hover:bg-gray-50 w-full sm:w-auto justify-center py-1 h-7"
                          >
                            Actions
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-44" align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem onClick={() => {
                            if (item.type === 'warning') {
                              handleViewDetails(item);
                            } else {
                              openReportDialog(item);
                            }
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>

                          {item.type === 'warning' && (
                            <>
                              {!item.userId?.isSuspended && (
                                <DropdownMenuItem
                                  onClick={() => handleUserStatusChange(item.userId._id, true)}
                                  className="text-red-600"
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Suspend User
                                </DropdownMenuItem>
                              )}
                              {item.userId?.isSuspended && (
                                <DropdownMenuItem
                                  onClick={() => handleUserStatusChange(item.userId._id, false)}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                              {!item.isResolved && (
                                <DropdownMenuItem
                                  onClick={() => handleWarningStatus(item, 'resolved', item.bookId)}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Resolve
                                </DropdownMenuItem>
                              )}
                            </>
                          )}

                          {item.type === 'report' && item.status !== 'resolved' && (
                            <DropdownMenuItem
                              onClick={() => handleReportStatus(item._id, 'resolved')}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Resolved
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsContent;