
import React from 'react';
import {
    BookOpen,
    BookPlus,
    Home,
    Menu,
    ChevronLeft,
    AlertTriangle,
} from 'lucide-react';

const Sidebar = ({
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    setActiveTab,
    handlemainpage,
    warningsCount,
}) => {


    const navigation = [
        { name: 'Overview', icon: Home, href: 'overview' },
        { name: 'Add Book', icon: BookPlus, href: 'addbook' },
        { name: 'My Books', icon: BookOpen, href: 'books' },
        {
            name: 'Warnings & Notices',
            icon: AlertTriangle,
            href: 'warnings',
            badge: warningsCount 
        },
    ];


    return (
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg h-full transition-all duration-300 flex flex-col`}>
            {/* Sidebar Header */}
            <div className="hidden md:block p-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {sidebarOpen && (<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        )}
                        {sidebarOpen && (
                            <span className="font-bold text-xl text-gray-900 cursor-pointer" onClick={handlemainpage}>Bookbuddy</span>
                        )}
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        {sidebarOpen ? (
                            <ChevronLeft className="h-5 w-5 text-gray-600" />
                        ) : (
                            <Menu className="h-5 w-5 text-gray-600" />
                        )}
                    </button>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <a
                                href="#"
                                title={item.name}
                                aria-label={item.name}
                                onClick={() => setActiveTab(item.href)}
                                className={
                                    (sidebarOpen ? 'flex items-center px-4 py-3' : 'flex items-center justify-center py-3') +
                                    ' text-sm font-medium rounded-lg transition-colors w-full ' +
                                    (activeTab === item.href
                                        ? (sidebarOpen ? 'bg-blue-100 text-blue-700' : 'bg-blue-100/20 text-blue-700')
                                        : 'text-gray-700 hover:bg-gray-100')
                                }
                            >
                                <div className="relative flex items-center justify-center">
                                    <item.icon className={`${sidebarOpen ? 'h-5 w-5 mr-3' : 'h-5 w-5'}`} />
                                    {/* Small badge dot when collapsed */}
                                    {item.badge > 0 && !sidebarOpen && (
                                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                                    )}
                                </div>
                                {sidebarOpen && <span className="flex-1">{item.name}</span>}
                                {item.badge > 0 && sidebarOpen && (
                                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>


        </div>
    )
}

export default Sidebar;