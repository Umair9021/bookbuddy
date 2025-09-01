import {
  Home,
  Users,
  BookOpen,
  Flag,
  Settings,
  Shield,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({
  activeTab,
  setActiveTab,
  sidebarExpanded,
  setSidebarExpanded,
  mobileMenuOpen,
  setMobileMenuOpen,
  isMobile,
  users,
  books,
  dashboardStats,
  setSelectedUser
}) => {
  const navigationItems = [
    { id: 'overview', icon: Home, label: 'Overview', badge: null },
    { id: 'users', icon: Users, label: 'Users', badge: users.length },
    { id: 'books', icon: BookOpen, label: 'Books', badge: books.length },
    { id: 'reports', icon: Flag, label: 'Reports', badge: dashboardStats.openReports },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null }
  ];

  return (
    <>
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`${isMobile
        ? `fixed left-0 top-0 h-full w-64 z-50 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`
        : `${sidebarExpanded ? 'w-64' : 'w-16'} transition-all duration-300`
        } bg-white shadow-xl border-r border-gray-200 flex flex-col`}>

        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {(sidebarExpanded || isMobile) && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-xs text-gray-600">Management Dashboard</p>
                </div>
              </div>
            )}

            {!isMobile && (
              <button
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarExpanded ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}

            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 sm:p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSelectedUser(null);
              }}
              className={`relative w-full flex items-center sm:space-x-3 px-2 sm:px-3 py-2 sm:py-3 rounded-xl text-left font-medium transition-all duration-200 group 
        ${activeTab === item.id
                  ? "text-blue-700 sm:bg-blue-50 sm:border sm:border-blue-200"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
            >
              {/* Icon */}
              <item.icon
                className={`h-5 w-5 shrink-0 ${activeTab === item.id
                  ? "text-blue-700"
                  : "text-gray-500 group-hover:text-gray-700"
                  }`}
              />

              {/* Label + Badge (shown only if sidebarExpanded or on mobile) */}
              {(sidebarExpanded || isMobile) && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate text-sm sm:text-base">{item.label}</span>
                  {item.badge !== null && item.badge > 0 && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${activeTab === item.id
                        ? "text-blue-800"
                        : "text-gray-600"
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Badge dot when sidebar collapsed on desktop */}
              {!sidebarExpanded && !isMobile && item.badge > 0 && (
                <div className="absolute left-6 top-2 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

      </div>
    </>
  );
};

export default Sidebar;