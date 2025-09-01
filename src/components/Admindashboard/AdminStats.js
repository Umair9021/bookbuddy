import { Users, UserCheck, BookOpen, Flag } from 'lucide-react';

const AdminStats = ({ dashboardStats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl lg:rounded-2xl shadow-sm border border-blue-200 p-4 lg:p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700 mb-1">Total Users</p>
            <p className="text-2xl lg:text-3xl font-bold text-blue-900">{dashboardStats.totalUsers}</p>
            <p className="text-xs text-blue-600 mt-1">Registered users</p>
          </div>
          <div className="bg-blue-500 p-2 lg:p-3 rounded-lg lg:rounded-xl shadow-lg">
            <Users className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl lg:rounded-2xl shadow-sm border border-emerald-200 p-4 lg:p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700 mb-1">Active Users</p>
            <p className="text-2xl lg:text-3xl font-bold text-emerald-900"> {dashboardStats.activeUsers}</p>
            <p className="text-xs text-emerald-600 mt-1">Currently active</p>
          </div>
          <div className="bg-emerald-500 p-2 lg:p-3 rounded-lg lg:rounded-xl shadow-lg">
            <UserCheck className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl lg:rounded-2xl shadow-sm border border-purple-200 p-4 lg:p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-700 mb-1">Total Books</p>
            <p className="text-2xl lg:text-3xl font-bold text-purple-900">{dashboardStats.totalBooks}</p>
            <p className="text-xs text-purple-600 mt-1">Listed books</p>
          </div>
          <div className="bg-purple-500 p-2 lg:p-3 rounded-lg lg:rounded-xl shadow-lg">
            <BookOpen className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl lg:rounded-2xl shadow-sm border border-red-200 p-4 lg:p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-700 mb-1">Open Reports</p>
            <p className="text-2xl lg:text-3xl font-bold text-red-900">{dashboardStats.openReports}</p>
            <p className="text-xs text-red-600 mt-1">Pending reports</p>
          </div>
          <div className="bg-red-500 p-2 lg:p-3 rounded-lg lg:rounded-xl shadow-lg">
            <Flag className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;