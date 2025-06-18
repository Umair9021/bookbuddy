
import React from 'react';
import {
    BookOpen,
    BookPlus,
    Home,
    Menu,
    ChevronLeft,
    User,
    Settings,
    LogOut,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Sidebar = ({
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    setActiveTab,
    userDropdownOpen,
    setUserDropdownOpen,
    avatarUrl,
    handleSignOut,
    handleprofile,
    handlemainpage
})=>{

      const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'addbook', label: 'Add Book', icon: BookPlus },
        { id: 'books', label: 'My Books', icon: BookOpen },
    ];
    return (
         <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
                {/* Sidebar Header */}
                <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <BookOpen className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-bold text-xl text-gray-900 cursor-pointer" onClick={handlemainpage}>Bookbuddy</span>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {sidebarOpen ? (
                                <ChevronLeft className="h-5 w-5 text-gray-600" />
                            ) : (
                                <Menu className="h-5 w-5 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {sidebarItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === item.id
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>


                <DropdownMenu open={userDropdownOpen} onOpenChange={setUserDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        {sidebarOpen ? (
                            <button className="flex items-center space-x-3 pl-5 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="w-10 h-10  rounded-full flex items-center justify-center">
                                    <img
                                        className="w-10 h-10 rounded-full"
                                        src={avatarUrl || '/image.avif'}
                                        alt="User Profile"
                                    />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-sm text-gray-900">John Doe</p>
                                    <p className="text-xs text-gray-600">Student</p>
                                </div>
                            </button>
                        ) : (
                            <button className="flex items-center space-x-3 pl-5 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="w-10 h-10  rounded-full flex items-center justify-center">
                                    <img
                                        className="w-10 h-10 rounded-full"
                                        src={avatarUrl || '/image.avif'}
                                        alt="User Profile"
                                    />
                                </div>
                            </button>
                        )}

                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="mr-20 p-4 mb-2">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center space-x-2" onClick={handleprofile}>
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center space-x-2">
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center space-x-2 text-red-600" onClick={handleSignOut}>
                            <LogOut className="h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
    )
}

export default Sidebar;