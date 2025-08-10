"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  AlertTriangle, 
  Search, 
  Eye, 
  Ban, 
  CheckCircle, 
  XCircle, 
  Flag,
  ArrowLeft,
  Calendar,
  DollarSign,
  UserCheck,
  Send,
  Menu,
  X,
  Settings,
  Bell,
  TrendingUp,
  Activity,
  Shield,
  Filter,
  Home,
  ChevronLeft,
  Edit,
  Trash2,
  Save
} from 'lucide-react';

// Mock data - replace with actual API calls
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: '2024-01-15',
    status: 'active',
    totalBooks: 12,
    totalSales: 850,
    avatar: '/api/placeholder/100/100',
    lastActive: '2024-08-01'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    joinDate: '2024-02-20',
    status: 'active',
    totalBooks: 8,
    totalSales: 620,
    avatar: '/api/placeholder/100/100',
    lastActive: '2024-07-30'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    joinDate: '2024-03-10',
    status: 'suspended',
    totalBooks: 5,
    totalSales: 200,
    avatar: '/api/placeholder/100/100',
    lastActive: '2024-07-25'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    joinDate: '2024-04-05',
    status: 'active',
    totalBooks: 15,
    totalSales: 1200,
    avatar: '/api/placeholder/100/100',
    lastActive: '2024-08-02'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    joinDate: '2024-05-12',
    status: 'active',
    totalBooks: 6,
    totalSales: 450,
    avatar: '/api/placeholder/100/100',
    lastActive: '2024-07-28'
  }
];

const mockBooks = [
  {
    id: '1',
    title: 'Introduction to Physics',
    price: 45,
    status: 'Available',
    category: 'First Year',
    sellerId: '1',
    datePosted: '2024-07-15',
    image: '/api/placeholder/200/300',
    description: 'Comprehensive physics textbook for first-year students.',
    condition: 'Good',
    isbn: '978-0123456789'
  },
  {
    id: '2',
    title: 'Advanced Mathematics',
    price: 60,
    status: 'Sold',
    category: 'Second Year',
    sellerId: '1',
    datePosted: '2024-07-10',
    image: '/api/placeholder/200/300',
    description: 'Advanced mathematical concepts and problem-solving.',
    condition: 'Excellent',
    isbn: '978-0987654321'
  },
  {
    id: '3',
    title: 'Chemistry Basics',
    price: 35,
    status: 'Available',
    category: 'First Year',
    sellerId: '2',
    datePosted: '2024-07-20',
    image: '/api/placeholder/200/300',
    description: 'Fundamental chemistry principles and lab work.',
    condition: 'Fair',
    isbn: '978-0456789012'
  },
  {
    id: '4',
    title: 'Biology Fundamentals',
    price: 40,
    status: 'Available',
    category: 'First Year',
    sellerId: '4',
    datePosted: '2024-07-18',
    image: '/api/placeholder/200/300',
    description: 'Complete guide to biological sciences.',
    condition: 'Good',
    isbn: '978-0234567890'
  },
  {
    id: '5',
    title: 'Computer Science Principles',
    price: 55,
    status: 'Available',
    category: 'Third Year',
    sellerId: '5',
    datePosted: '2024-07-22',
    image: '/api/placeholder/200/300',
    description: 'Programming fundamentals and algorithms.',
    condition: 'Excellent',
    isbn: '978-0345678901'
  }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState(mockUsers);
  const [books, setBooks] = useState(mockBooks);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [userBooks, setUserBooks] = useState([]);
  const [warningModal, setWarningModal] = useState(false);
  const [editBookModal, setEditBookModal] = useState(false);
  const [deleteBookModal, setDeleteBookModal] = useState(false);
  const [warningForm, setWarningForm] = useState({ userId: '', message: '', severity: 'low' });
  const [editBookForm, setEditBookForm] = useState({});
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications] = useState(5);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarExpanded(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu when tab changes
  useEffect(() => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  }, [activeTab]);
  
  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter books based on search
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
    book.category.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
    book.status.toLowerCase().includes(bookSearchQuery.toLowerCase())
  );

  // Get user's books when a user is selected
  useEffect(() => {
    if (selectedUser) {
      const userBooksList = books.filter(book => book.sellerId === selectedUser.id);
      setUserBooks(userBooksList);
    }
  }, [selectedUser, books]);

  const handleUserStatusChange = (userId, newStatus) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleBookStatusChange = (bookId, newStatus) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId ? { ...book, status: newStatus } : book
    ));
  };

  const handleDeleteBook = (bookId) => {
    setBooks(prev => prev.filter(book => book.id !== bookId));
    setDeleteBookModal(false);
    setSelectedBook(null);
    alert('Book deleted successfully!');
  };

  const handleEditBook = () => {
    setBooks(prev => prev.map(book => 
      book.id === editBookForm.id ? { ...book, ...editBookForm } : book
    ));
    setEditBookModal(false);
    setEditBookForm({});
    alert('Book updated successfully!');
  };

  const handleSendWarning = () => {
    console.log('Sending warning:', warningForm);
    setWarningModal(false);
    setWarningForm({ userId: '', message: '', severity: 'low' });
    alert('Warning sent successfully!');
  };

  const openEditBookModal = (book) => {
    setEditBookForm(book);
    setEditBookModal(true);
  };

  const openDeleteBookModal = (book) => {
    setSelectedBook(book);
    setDeleteBookModal(true);
  };

  const AdminStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl lg:rounded-2xl shadow-sm border border-blue-200 p-4 lg:p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700 mb-1">Total Users</p>
            <p className="text-2xl lg:text-3xl font-bold text-blue-900">{users.length}</p>
            <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
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
            <p className="text-2xl lg:text-3xl font-bold text-emerald-900">
              {users.filter(u => u.status === 'active').length}
            </p>
            <p className="text-xs text-emerald-600 mt-1">+5% from last month</p>
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
            <p className="text-2xl lg:text-3xl font-bold text-purple-900">{books.length}</p>
            <p className="text-xs text-purple-600 mt-1">+8% from last month</p>
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
            <p className="text-2xl lg:text-3xl font-bold text-red-900">3</p>
            <p className="text-xs text-red-600 mt-1">2 new this week</p>
          </div>
          <div className="bg-red-500 p-2 lg:p-3 rounded-lg lg:rounded-xl shadow-lg">
            <Flag className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  const OverviewContent = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">Recent Activity</h2>
        <div className="space-y-3 lg:space-y-4">
          {[
            { action: 'New user registration', user: 'sarah@example.com', time: '2 minutes ago', type: 'user' },
            { action: 'Book reported', user: 'Advanced Chemistry', time: '15 minutes ago', type: 'report' },
            { action: 'User suspended', user: 'mike@example.com', time: '1 hour ago', type: 'warning' },
            { action: 'New book posted', user: 'Introduction to Biology', time: '2 hours ago', type: 'book' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 bg-gray-50 rounded-lg lg:rounded-xl hover:bg-gray-100 transition-colors">
              <div className={`p-2 rounded-lg ${
                activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
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
                <p className="text-xs lg:text-sm text-gray-600 truncate">{activity.user}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="h-48 lg:h-64 bg-gradient-to-t from-blue-50 to-transparent rounded-xl flex items-end justify-center">
            <TrendingUp className="h-12 w-12 lg:h-16 lg:w-16 text-blue-400" />
          </div>
        </div>  
      </div>
    </div>
  );

  const BooksContent = () => (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Books Management</h2>
          <p className="text-gray-600 text-sm lg:text-base">Manage all books in the marketplace</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search books..."
              value={bookSearchQuery}
              onChange={(e) => setBookSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full lg:w-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm lg:text-base"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 flex-shrink-0">
            <Filter className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {filteredBooks.map((book) => {
          const seller = users.find(user => user.id === book.sellerId);
          return (
            <div key={book.id} className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-all duration-300">
              <div className="w-full h-24 lg:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-3 lg:mb-4 flex items-center justify-center">
                <BookOpen className="h-6 w-6 lg:h-8 lg:w-8 text-gray-400" />
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base line-clamp-2">{book.title}</h4>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg lg:text-xl font-bold text-gray-900">${book.price}</span>
                <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${
                  book.status === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {book.status}
                </span>
              </div>
              
              <div className="space-y-1 lg:space-y-2 mb-3 lg:mb-4">
                <p className="text-xs lg:text-sm text-gray-600">{book.category}</p>
                <p className="text-xs lg:text-sm text-gray-600">by {seller?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-500">Posted: {book.datePosted}</p>
              </div>
              
              <div className="flex items-center space-x-1 lg:space-x-2">
                <button
                  onClick={() => openEditBookModal(book)}
                  className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
                  title="Edit Book"
                >
                  <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="text-xs lg:text-sm">Edit</span>
                </button>
                
                <button
                  onClick={() => handleBookStatusChange(book.id, book.status === 'Available' ? 'Hidden' : 'Available')}
                  className={`flex-1 p-2 rounded-lg transition-colors flex items-center justify-center space-x-1 ${
                    book.status === 'Available' 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                  title={book.status === 'Available' ? 'Hide Book' : 'Show Book'}
                >
                  {book.status === 'Available' ? <XCircle className="h-3 w-3 lg:h-4 lg:w-4" /> : <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4" />}
                  <span className="text-xs lg:text-sm">{book.status === 'Available' ? 'Hide' : 'Show'}</span>
                </button>
                
                <button
                  onClick={() => openDeleteBookModal(book)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  title="Delete Book"
                >
                  <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredBooks.length === 0 && (
        <div className="text-center py-8 lg:py-12">
          <BookOpen className="h-12 w-12 lg:h-16 lg:w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-base lg:text-lg">No books found</p>
        </div>
      )}
    </div>
  );

  const UsersContent = () => (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Users Management</h2>
          <p className="text-gray-600 text-sm lg:text-base">Manage user accounts and permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full lg:w-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm lg:text-base"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 flex-shrink-0">
            <Filter className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      {selectedUser ? (
        <div className="space-y-4 lg:space-y-6">
          <div className="flex items-center space-x-4 mb-4 lg:mb-6">
            <button
              onClick={() => setSelectedUser(null)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 lg:px-4 py-2 rounded-xl transition-colors text-sm lg:text-base"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Users</span>
            </button>
          </div>

          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-8">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
              <div className="flex items-center space-x-4 lg:space-x-6">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-lg lg:text-2xl">
                    {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl lg:text-3xl font-bold text-gray-900 truncate">{selectedUser.name}</h2>
                  <p className="text-gray-600 text-sm lg:text-lg truncate">{selectedUser.email}</p>
                  <div className="flex flex-wrap items-center gap-2 lg:gap-4 mt-2 lg:mt-3">
                    <span className={`px-3 lg:px-4 py-1 lg:py-2 rounded-full text-xs lg:text-sm font-medium ${
                      selectedUser.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser.status}
                    </span>
                    <span className="text-xs lg:text-sm text-gray-500">Member since {selectedUser.joinDate}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 lg:flex-col lg:space-x-0 lg:space-y-3 xl:flex-row xl:space-y-0 xl:space-x-3">
                <button
                  onClick={() => {
                    setWarningForm({ ...warningForm, userId: selectedUser.id });
                    setWarningModal(true);
                  }}
                  className="px-4 lg:px-6 py-2 lg:py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2 shadow-md text-sm lg:text-base"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Send Warning</span>
                </button>
                
                {selectedUser.status === 'active' ? (
                  <button
                    onClick={() => handleUserStatusChange(selectedUser.id, 'suspended')}
                    className="px-4 lg:px-6 py-2 lg:py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 shadow-md text-sm lg:text-base"
                  >
                    <Ban className="h-4 w-4" />
                    <span>Suspend</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUserStatusChange(selectedUser.id, 'active')}
                    className="px-4 lg:px-6 py-2 lg:py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 shadow-md text-sm lg:text-base"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Activate</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6 lg:mt-8">
              {[
                { icon: Calendar, label: 'Joined', value: selectedUser.joinDate, color: 'text-blue-600' },
                { icon: BookOpen, label: 'Total Books', value: selectedUser.totalBooks, color: 'text-purple-600' },
                { icon: DollarSign, label: 'Total Sales', value: `${selectedUser.totalSales}`, color: 'text-green-600' },
                { icon: Activity, label: 'Last Active', value: selectedUser.lastActive, color: 'text-orange-600' }
              ].map((stat, index) => (
                <div key={index} className="text-center p-3 lg:p-4 bg-gray-50 rounded-xl">
                  <stat.icon className={`h-5 w-5 lg:h-6 lg:w-6 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
                  <p className="font-semibold text-sm lg:text-lg">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-8">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">User's Books ({userBooks.length})</h3>
            {userBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {userBooks.map((book) => (
                  <div key={book.id} className="border border-gray-200 rounded-xl p-4 lg:p-6 hover:shadow-md transition-all duration-300">
                    <div className="w-full h-24 lg:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-3 lg:mb-4 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 lg:h-8 lg:w-8 text-gray-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">{book.title}</h4>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg lg:text-xl font-bold text-gray-900">${book.price}</span>
                      <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${
                        book.status === 'Available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {book.status}
                      </span>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-600 mb-1">{book.category}</p>
                    <p className="text-xs text-gray-500">Posted: {book.datePosted}</p>
                    
                    <div className="flex items-center space-x-2 mt-3 lg:mt-4">
                      <button
                        onClick={() => openEditBookModal(book)}
                        className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                        <span className="text-xs lg:text-sm">Edit</span>
                      </button>
                      
                      <button
                        onClick={() => openDeleteBookModal(book)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 lg:py-12">
                <BookOpen className="h-12 w-12 lg:h-16 lg:w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-base lg:text-lg">No books found for this user</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-3 lg:gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-white font-bold text-sm lg:text-lg">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-lg truncate">{user.name}</h3>
                    <p className="text-gray-600 text-xs lg:text-base truncate">{user.email}</p>
                    <div className="flex flex-wrap items-center gap-2 lg:gap-4 mt-1 lg:mt-2">
                      <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                      <span className="text-xs text-gray-500">{user.totalBooks} books</span>
                      <span className="text-xs text-gray-500">${user.totalSales} sales</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 lg:space-x-2 flex-shrink-0">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {user.status === 'active' ? (
                    <button
                      onClick={() => handleUserStatusChange(user.id, 'suspended')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Suspend User"
                    >
                      <Ban className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUserStatusChange(user.id, 'active')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Activate User"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setWarningForm({ ...warningForm, userId: user.id });
                      setWarningModal(true);
                    }}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    title="Send Warning"
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ReportsContent = () => (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Reports & Warnings</h2>
        <p className="text-gray-600 text-sm lg:text-base">Monitor and manage user reports and system alerts</p>
      </div>
      
      <div className="space-y-3 lg:space-y-4">
        {[
          {
            type: 'report',
            title: 'Inappropriate Content Report',
            description: 'User reported book "Advanced Chemistry" for inappropriate images',
            reporter: 'user@example.com',
            time: '2 hours ago',
            severity: 'high',
            status: 'pending'
          },
          {
            type: 'warning',
            title: 'Spam Warning Issued',
            description: 'Warning sent to john@example.com for posting duplicate listings',
            reporter: 'Admin',
            time: '1 day ago',
            severity: 'medium',
            status: 'resolved'
          },
          {
            type: 'suspension',
            title: 'Account Suspended',
            description: 'User mike@example.com suspended for violation of terms',
            reporter: 'Admin',
            time: '3 days ago',
            severity: 'high',
            status: 'active'
          },
          {
            type: 'report',
            title: 'Fake Book Listing',
            description: 'Multiple users reported fake textbook listings from seller',
            reporter: 'multiple users',
            time: '4 hours ago',
            severity: 'high',
            status: 'pending'
          },
          {
            type: 'warning',
            title: 'Price Manipulation Warning',
            description: 'Warning sent for artificially inflating book prices',
            reporter: 'System',
            time: '2 days ago',
            severity: 'medium',
            status: 'resolved'
          }
        ].map((report, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-3 lg:space-y-0">
              <div className="flex items-start space-x-3 lg:space-x-4 flex-1 min-w-0">
                <div className={`p-2 lg:p-3 rounded-xl flex-shrink-0 ${
                  report.type === 'report' ? 'bg-red-100' :
                  report.type === 'warning' ? 'bg-yellow-100' :
                  'bg-gray-100'
                }`}>
                  {report.type === 'report' ? <Flag className="h-4 w-4 lg:h-5 lg:w-5 text-red-600" /> :
                   report.type === 'warning' ? <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-600" /> :
                   <XCircle className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm lg:text-lg">{report.title}</h4>
                  <p className="text-gray-600 mt-1 text-xs lg:text-base">{report.description}</p>
                  <div className="flex flex-wrap items-center gap-2 lg:gap-4 mt-2 lg:mt-3">
                    <span className="text-xs lg:text-sm text-gray-500">By: {report.reporter}</span>
                    <span className="text-xs lg:text-sm text-gray-500">•</span>
                    <span className="text-xs lg:text-sm text-gray-500">{report.time}</span>
                    <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${
                      report.severity === 'high' ? 'bg-red-100 text-red-800' :
                      report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.severity} priority
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 flex-shrink-0">
                {report.status === 'pending' ? (
                  <>
                    <button className="px-3 lg:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs lg:text-sm">
                      Resolve
                    </button>
                    <button className="px-3 lg:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs lg:text-sm">
                      Take Action
                    </button>
                  </>
                ) : (
                  <span className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium ${
                    report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


  const SettingsContent = () => (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 text-sm lg:text-base">Configure system preferences and security settings</p>
      </div>
      
      <div className="grid gap-4 lg:gap-6">

        <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
          <div className="space-y-3 lg:space-y-4">
            <button className="w-full text-left p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-medium text-gray-900 text-sm lg:text-base">Change Password</h4>
              <p className="text-xs lg:text-sm text-gray-600 mt-1">Update your admin password</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent />;
      case 'users':
        return <UsersContent />;
      case 'books':
        return <BooksContent />;
      case 'reports':
        return <ReportsContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isMobile 
          ? `fixed left-0 top-0 h-full w-64 z-50 transform transition-transform duration-300 ${
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
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
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'overview', icon: Home, label: 'Overview', badge: null },
            { id: 'users', icon: Users, label: 'Users', badge: users.length },
            { id: 'books', icon: BookOpen, label: 'Books', badge: books.length },
            { id: 'reports', icon: Flag, label: 'Reports', badge: 3 },
            { id: 'settings', icon: Settings, label: 'Settings', badge: null }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSelectedUser(null);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left font-medium transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-blue-700' : 'text-gray-500 group-hover:text-gray-700'}`} />
              
              {(sidebarExpanded || isMobile) && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              
              {!sidebarExpanded && !isMobile && item.badge && (
                <div className="absolute left-8 top-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center ${(sidebarExpanded || isMobile) ? 'space-x-3' : 'justify-center'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AD</span>
            </div>
            {(sidebarExpanded || isMobile) && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-600">admin@example.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isMobile && (
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}
              
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
                <p className="text-gray-600 text-xs lg:text-sm hidden sm:block">
                  {activeTab === 'overview' && 'System overview and analytics'}
                  {activeTab === 'users' && 'Manage user accounts and permissions'}
                  {activeTab === 'books' && 'Manage all books in the marketplace'}
                  {activeTab === 'reports' && 'Monitor user reports and violations'}
                  {activeTab === 'notifications' && 'System alerts and updates'}
                  {activeTab === 'settings' && 'Configure system preferences'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-3">
              <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {activeTab === 'overview' && <AdminStats />}
          {renderMainContent()}
        </main>
      </div>

      {/* Edit Book Modal */}
      {editBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 lg:p-8 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Edit className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Edit Book</h3>
              </div>
              <button
                onClick={() => setEditBookModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4 lg:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">Book Title</label>
                  <input
                    type="text"
                    value={editBookForm.title || ''}
                    onChange={(e) => setEditBookForm({ ...editBookForm, title: e.target.value })}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm lg:text-base"
                    placeholder="Enter book title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">Price ($)</label>
                  <input
                    type="number"
                    value={editBookForm.price || ''}
                    onChange={(e) => setEditBookForm({ ...editBookForm, price: parseFloat(e.target.value) })}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm lg:text-base"
                    placeholder="Enter price"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">Category</label>
                  <select
                    value={editBookForm.category || ''}
                    onChange={(e) => setEditBookForm({ ...editBookForm, category: e.target.value })}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm lg:text-base"
                  >
                    <option value="">Select category</option>
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Fourth Year">Fourth Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">Status</label>
                  <select
                    value={editBookForm.status || ''}
                    onChange={(e) => setEditBookForm({ ...editBookForm, status: e.target.value })}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm lg:text-base"
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">Condition</label>
                  <select
                    value={editBookForm.condition || ''}
                    onChange={(e) => setEditBookForm({ ...editBookForm, condition: e.target.value })}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm lg:text-base"
                  >
                    <option value="">Select condition</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">ISBN</label>
                  <input
                    type="text"
                    value={editBookForm.isbn || ''}
                    onChange={(e) => setEditBookForm({ ...editBookForm, isbn: e.target.value })}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm lg:text-base"
                    placeholder="Enter ISBN"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">Description</label>
                <textarea
                  value={editBookForm.description || ''}
                  onChange={(e) => setEditBookForm({ ...editBookForm, description: e.target.value })}
                  rows="4"
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm resize-none text-sm lg:text-base"
                  placeholder="Enter book description"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6 lg:mt-8">
              <button
                onClick={() => setEditBookModal(false)}
                className="flex-1 px-4 lg:px-6 py-2 lg:py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors text-sm lg:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleEditBook}
                className="flex-1 px-4 lg:px-6 py-2 lg:py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium transition-colors flex items-center justify-center space-x-2 shadow-md text-sm lg:text-base"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Book Modal */}
      {deleteBookModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 lg:p-8 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Trash2 className="h-4 w-4 lg:h-5 lg:w-5 text-red-600" />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Delete Book</h3>
              </div>
              <button
                onClick={() => setDeleteBookModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4 lg:mb-6">
              <p className="text-gray-600 mb-4 text-sm lg:text-base">
                Are you sure you want to delete "<span className="font-semibold text-gray-900">{selectedBook.title}</span>"? 
                This action cannot be undone.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 lg:p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5 text-red-600 flex-shrink-0" />
                  <span className="text-red-800 font-medium text-sm lg:text-base">Warning</span>
                </div>
                <p className="text-red-700 text-xs lg:text-sm mt-1">
                  This will permanently remove the book from the marketplace and all associated data.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setDeleteBookModal(false)}
                className="flex-1 px-4 lg:px-6 py-2 lg:py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors text-sm lg:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBook(selectedBook.id)}
                className="flex-1 px-4 lg:px-6 py-2 lg:py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium transition-colors flex items-center justify-center space-x-2 shadow-md text-sm lg:text-base"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Book</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {warningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 lg:p-8 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-600" />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Send Warning</h3>
              </div>
              <button
                onClick={() => setWarningModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4 lg:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">Warning Severity</label>
                <select
                  value={warningForm.severity}
                  onChange={(e) => setWarningForm({ ...warningForm, severity: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent shadow-sm text-sm lg:text-base"
                >
                  <option value="low">🟢 Low - General reminder</option>
                  <option value="medium">🟡 Medium - Violation warning</option>
                  <option value="high">🔴 High - Final warning</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 lg:mb-3">Warning Message</label>
                <textarea
                  value={warningForm.message}
                  onChange={(e) => setWarningForm({ ...warningForm, message: e.target.value })}
                  rows="4"
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent shadow-sm resize-none text-sm lg:text-base"
                  placeholder="Please explain the reason for this warning..."
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6 lg:mt-8">
              <button
                onClick={() => setWarningModal(false)}
                className="flex-1 px-4 lg:px-6 py-2 lg:py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors text-sm lg:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSendWarning}
                className="flex-1 px-4 lg:px-6 py-2 lg:py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 font-medium transition-colors flex items-center justify-center space-x-2 shadow-md text-sm lg:text-base"
              >
                <Send className="h-4 w-4" />
                <span>Send Warning</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;