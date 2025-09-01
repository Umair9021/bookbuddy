import { ArrowLeft, Eye, Ban, CheckCircle, AlertTriangle, Calendar, BookOpen, DollarSign, Activity } from 'lucide-react';
import { Search, Filter } from 'lucide-react';

const UsersContent = ({
  users,
  searchQuery,
  setSearchQuery,
  fetchUsers,
  selectedUser,
  setSelectedUser,
  userBooks,
  handleUserStatusChange,
  setWarningForm,
  setWarningModal,
  books
}) => {
  const filteredUsers = users.filter(user =>
    (user.name || user.user_metadata?.full_name || '')?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
          <button
            onClick={fetchUsers}
            className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 flex-shrink-0"
            title="Refresh Users"
          >
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
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
                  {selectedUser.user_metadata?.picture ? (
                    <img
                      src={selectedUser.user_metadata.picture}
                      alt={selectedUser.name || selectedUser.user_metadata?.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-lg lg:text-2xl">
                      {(selectedUser.name || selectedUser.user_metadata?.full_name || selectedUser.email)
                        .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl lg:text-3xl font-bold text-gray-900 truncate">
                    {selectedUser.name || selectedUser.user_metadata?.full_name || 'Unknown User'}
                  </h2>
                  <p className="text-gray-600 text-sm lg:text-lg truncate">{selectedUser.email}</p>
                  <div className="flex flex-wrap items-center gap-2 lg:gap-4 mt-2 lg:mt-3">
                    <span className={`px-3 lg:px-4 py-1 lg:py-2 rounded-full text-xs lg:text-sm font-medium ${selectedUser.isSuspended === true
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                      }`}>
                      {selectedUser.isSuspended ? 'suspended' : 'active'}
                    </span>
                    <span className="text-xs lg:text-sm text-gray-500">
                      Member since {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 lg:flex-col lg:space-x-0 lg:space-y-3 xl:flex-row xl:space-y-0 xl:space-x-3">
                <button
                  onClick={() => {
                    setWarningForm({ userId: selectedUser._id || selectedUser.id });
                    setWarningModal(true);
                  }}
                  className="px-4 lg:px-6 py-2 lg:py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2 shadow-md text-sm lg:text-base"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Send Warning</span>
                </button>

                {(!selectedUser.isSuspended) ? (
                  <button
                    onClick={() => handleUserStatusChange(selectedUser._id, true)}
                    className="px-4 lg:px-6 py-2 lg:py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 shadow-md text-sm lg:text-base"
                  >
                    <Ban className="h-4 w-4" />
                    <span>Suspend</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUserStatusChange(selectedUser._id, false)}
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
                {
                  icon: Calendar,
                  label: 'Joined',
                  value: new Date(selectedUser.createdAt || selectedUser.joinDate).toLocaleDateString(),
                  color: 'text-blue-600'
                },
                {
                  icon: BookOpen,
                  label: 'Total Books',
                  value: userBooks.length,
                  color: 'text-purple-600'
                },
                {
                  icon: DollarSign,
                  label: 'Total Sales',
                  value: `${userBooks
                    .filter(book => book.status === 'Sold')
                    .reduce((total, book) => total + (book.price || 0), 0)
                    .toFixed(2)}`,
                  color: 'text-green-600'
                },
                {
                  icon: Activity,
                  label: 'Last Active',
                  value: selectedUser.last_sign_in_at || selectedUser.lastActive
                    ? new Date(selectedUser.last_sign_in_at || selectedUser.lastActive).toLocaleDateString()
                    : 'Never',
                  color: 'text-orange-600'
                }
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
                {userBooks.map((book) => {
                  const bookId = book._id || book.id;
                  const bookThumbnail = book.pictures && book.pictures.length > 0
                    ? book.pictures[book.thumbnailIndex || 0]?.url
                    : null;

                  return (
                    <div key={bookId} className="border border-gray-200 rounded-xl p-4 lg:p-6 lg:pb-4 hover:shadow-md transition-all duration-300">
                      <div className="w-full h-24 lg:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-3 lg:mb-4 flex items-center justify-center overflow-hidden">
                        {bookThumbnail ? (
                          <img
                            src={bookThumbnail}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen className="h-6 w-6 lg:h-8 lg:w-8 text-gray-400" />
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">{book.title}</h4>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg lg:text-xl font-bold text-gray-900">${book.price}</span>
                        <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${book.isHidden
                          ? 'bg-gray-100 text-gray-800'
                          : book.status === 'Available'
                            ? 'bg-green-100 text-green-800'
                            : book.status === 'Sold'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                          {book.isHidden ? 'Hidden' : book.status}
                        </span>
                      </div>
                      <p className="text-xs lg:text-sm text-gray-600 mb-1">{book.department || book.category}</p>
                      <p className="text-xs lg:text-sm text-gray-600 mb-1">by {book.seller?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500">
                        Posted: {new Date(book.createdAt || book.datePosted).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
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
          {filteredUsers.map((user) => {
            const userId = user._id || user.id;
            const userName = user.name || user.user_metadata?.full_name || 'Unknown User';

            const userBooksCount = books.filter(book => {
              const bookSellerId = book.seller?._id || book.seller || book.sellerId;
              return bookSellerId === userId;
            }).length;

            const userSales = books
              .filter(book => {
                const bookSellerId = book.seller?._id || book.seller || book.sellerId;
                return bookSellerId === userId && book.status === 'Sold';
              })
              .reduce((total, book) => total + (book.price || 0), 0);

            return (
              <div key={userId} className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 overflow-hidden">
                      {user.user_metadata?.picture ? (
                        <img
                          src={user.user_metadata.picture}
                          alt={userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-sm lg:text-lg">
                          {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm lg:text-lg truncate">{userName}</h3>
                      <p className="text-gray-600 text-xs lg:text-base truncate">{user.email}</p>
                      <div className="flex flex-wrap items-center gap-2 lg:gap-4 mt-1 lg:mt-2">
                        <span className={`px-3 lg:px-4 py-1 lg:py-2 rounded-full text-xs lg:text-sm font-medium ${user.isSuspended === true
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                          }`}>
                          {user.isSuspended ? 'suspended' : 'active'}
                        </span>
                        <span className="text-xs text-gray-500">{userBooksCount} books</span>
                        <span className="text-xs text-gray-500">${userSales} sales</span>
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

                    {(user.status || 'active') === 'active' ? (
                      <button
                        onClick={() => handleUserStatusChange(user._id, true)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Suspend User"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUserStatusChange(userId, 'active')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Activate User"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setWarningForm({ userId: userId });
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UsersContent;