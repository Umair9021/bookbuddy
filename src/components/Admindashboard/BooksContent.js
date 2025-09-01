import { BookOpen, Filter, Search, XCircle, CheckCircle, Trash2 } from 'lucide-react';

const BooksContent = ({
  books,
  bookSearchQuery,
  setBookSearchQuery,
  fetchBooks,
  users,
  setSelectedBook,
  setHideBookModal,
  handleShowBook,
  openDeleteBookModal,
  loading
}) => {
  return (
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
          <button
            onClick={fetchBooks}
            className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 flex-shrink-0"
            title="Refresh Books"
          >
            <Filter className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {books.map((book) => {
          const bookId = book._id || book.id;
          const seller = users.find(user => (user._id || user.id) === book.sellerId);
          const bookThumbnail = book.pictures && book.pictures.length > 0
            ? book.pictures[book.thumbnailIndex || 0]?.url
            : null;

          return (
            <div key={bookId} className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 lg:pb-4 hover:shadow-md transition-all duration-300">
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

              <h4 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base line-clamp-2">{book.title}</h4>

              <div className="flex justify-between items-center mb-3">
                <span className="text-lg lg:text-1xl font-bold text-gray-900">Rs. {book.price}</span>
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

              <div className="space-y-1 lg:space-y-2 mb-3 lg:mb-4">
                <p className="text-xs lg:text-sm text-gray-600">{book.department || book.category}</p>
                <p className="text-xs lg:text-sm text-gray-600">by {book.seller?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-500">
                  Posted: {new Date(book.createdAt || book.datePosted).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center justify-start">
                {!book.isHidden ? (
                  <button
                    onClick={() => {
                      setSelectedBook(book);
                      setHideBookModal(true);
                    }}
                    className="flex-1 p-2 rounded-lg transition-colors flex items-center justify-center space-x-1 text-red-600 hover:bg-red-50"
                    title="Hide Book"
                  >
                    <XCircle className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span className="text-xs lg:text-sm">Hide</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleShowBook(book)}
                    className="flex-1 p-2 rounded-lg transition-colors flex items-center justify-center space-x-1 text-green-600 hover:bg-green-50"
                    title="Show Book"
                  >
                    <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span className="text-xs lg:text-sm">Show</span>
                  </button>
                )}

                <button
                  onClick={() => openDeleteBookModal(book)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 ml-2"
                  title="Delete Book"
                >
                  <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {books.length === 0 && !loading && (
        <div className="text-center py-8 lg:py-12">
          <BookOpen className="h-12 w-12 lg:h-16 lg:w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-base lg:text-lg">No books found</p>
        </div>
      )}
    </div>
  );
};

export default BooksContent;