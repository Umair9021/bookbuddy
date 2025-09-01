import { Users, BookOpen, AlertTriangle, Flag, Activity } from 'lucide-react';
import AdminStatusDonutChart from '@/components/AdminStatusDonutChart';

const OverviewContent = ({ recentActivity, dashboardStats }) => {
  return (
    <div className="space-y-6 lg:space-x-4 sm:flex sm:flex-row">
      <div className="bg-white w-full rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">Recent Activity</h2>
        <div className="space-y-3 lg:space-y-4">
          {recentActivity.length > 0 ? recentActivity.slice(0, 5).map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 bg-gray-50 rounded-lg lg:rounded-xl hover:bg-gray-100 transition-colors">
              <div className={`p-2 rounded-lg ${activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'report' ? 'bg-red-100 text-red-600' :
                  activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                }`}>
                {activity.type === 'user' ? <Users className="h-4 w-4" /> :
                  activity.type === 'report' ? <Flag className="h-4 w-4" /> :
                    activity.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                      <BookOpen className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm lg:text-base truncate">{activity.action}</p>
                <p className="text-xs lg:text-sm text-gray-600 truncate">{activity.details}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {new Date(activity.timestamp).toLocaleDateString()}
              </span>
            </div>
          )) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full">
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Books Status Distribution</h3>
            <div className="p-2 rounded-lg bg-gray-50">
              <BookOpen className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <AdminStatusDonutChart dashboardStats={dashboardStats} />
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;