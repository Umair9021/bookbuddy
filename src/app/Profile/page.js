'use client';

import React, { useState } from 'react';

const initialUser = {
  name: 'Jane Doe',
  college: 'State University',
  email: 'jane.doe@example.com',
  profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
  stats: {
    booksSold: 12,
    booksBought: 8,
    rating: 4.7,
    reviews: 23,
  },
  booksForSale: [
    {
      id: 1,
      title: 'Introduction to Algorithms',
      price: 45,
      cover:
        'https://images-na.ssl-images-amazon.com/images/I/41Uj8b+FJHL._SX258_BO1,204,203,200_.jpg',
    },
    {
      id: 2,
      title: 'Discrete Mathematics',
      price: 30,
      cover:
        'https://images-na.ssl-images-amazon.com/images/I/51sXUbAc3FL._SX379_BO1,204,203,200_.jpg',
    },
  ],
  booksBought: [
    {
      id: 10,
      title: 'Linear Algebra Done Right',
      price: 40,
      cover:
        'https://images-na.ssl-images-amazon.com/images/I/51qPw6W62PL._SX376_BO1,204,203,200_.jpg',
      seller: 'John Smith',
      date: '2024-04-10',
    },
    {
      id: 11,
      title: 'Operating System Concepts',
      price: 50,
      cover:
        'https://images-na.ssl-images-amazon.com/images/I/41TeYJpTSSL._SX396_BO1,204,203,200_.jpg',
      seller: 'Anna Lee',
      date: '2024-03-25',
    },
  ],
  reviews: [
    {
      id: 1,
      reviewer: 'Mike Johnson',
      rating: 5,
      comment: 'Great seller! Fast shipping and the book was in perfect condition.',
    },
    {
      id: 2,
      reviewer: 'Lisa Wong',
      rating: 4,
      comment: 'Good communication, recommended.',
    },
  ],
};

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={'full-' + i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.49 7.91l6.562-.955L10 1l2.947 5.955 6.562.955-4.755 4.635 1.123 6.545z" />
        </svg>
      ))}
      {halfStar && (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-grad)"
            d="M10 15l-5.878 3.09 1.123-6.545L.49 7.91l6.562-.955L10 1l2.947 5.955 6.562.955-4.755 4.635 1.123 6.545z"
          />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={'empty-' + i}
          className="w-5 h-5 text-gray-300 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.49 7.91l6.562-.955L10 1l2.947 5.955 6.562.955-4.755 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(initialUser);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const [newBook, setNewBook] = useState({
    title: '',
    price: '',
    cover: '',
  });

  const [editProfileData, setEditProfileData] = useState({
    name: user.name,
    college: user.college,
    email: user.email,
    profilePic: user.profilePic,
  });

  function handleAddBook() {
    if (!newBook.title || !newBook.price || !newBook.cover) {
      alert('Please fill all fields');
      return;
    }
    const newBookEntry = {
      id: Date.now(),
      title: newBook.title,
      price: Number(newBook.price),
      cover: newBook.cover,
    };
    setUser({
      ...user,
      booksForSale: [newBookEntry, ...user.booksForSale],
    });
    setNewBook({ title: '', price: '', cover: '' });
    setShowAddModal(false);
  }

  function handleDeleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
      setUser({
        ...user,
        booksForSale: user.booksForSale.filter((b) => b.id !== id),
      });
    }
  }

  function openEditProfile() {
    setEditProfileData({
      name: user.name,
      college: user.college,
      email: user.email,
      profilePic: user.profilePic,
    });
    setShowEditProfileModal(true);
  }

  function saveProfile() {
    const { name, college, email, profilePic } = editProfileData;
    if (!name || !college || !email || !profilePic) {
      alert('All fields are required!');
      return;
    }
    setUser((prev) => ({
      ...prev,
      name,
      college,
      email,
      profilePic,
    }));
    setShowEditProfileModal(false);
  }

  return (
 <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Profile */}
          <div className="md:w-1/3 bg-gradient-to-b from-blue-600 to-blue-400 text-white p-8 flex flex-col items-center">
            <img
              src={user.profilePic}
              alt="Profile Pic"
              className="w-36 h-36 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <h1 className="mt-6 text-3xl font-bold">{user.name}</h1>
            <p className="mt-1 text-sm">{user.college}</p>
            <p className="mt-1 text-xs opacity-80">{user.email}</p>

            <button
              className="mt-6 bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition"
              onClick={openEditProfile}
            >
              Edit Profile
            </button>

            <div className="mt-10 w-full">
              <h3 className="text-lg font-semibold mb-4">Stats</h3>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-4xl font-extrabold">{user.stats.booksSold}</p>
                  <p className="opacity-70">Books Sold</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold">{user.stats.booksBought}</p>
                  <p className="opacity-70">Books Bought</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold">{user.stats.rating.toFixed(1)}</p>
                  <StarRating rating={user.stats.rating} />
                  <p className="opacity-70">{user.stats.reviews} Reviews</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold">{user.reviews.length}</p>
                  <p className="opacity-70">User Reviews</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="md:w-2/3 p-8 space-y-12">
            {/* Books for Sale */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Books for Sale</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  + Add New Book
                </button>
              </div>
              {user.booksForSale.length === 0 && (
                <p className="text-gray-600">You have no books listed for sale.</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {user.booksForSale.map((book) => (
                  <div
                    key={book.id}
                    className="flex bg-gray-50 rounded-xl shadow hover:shadow-lg transition p-4 items-center"
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-24 h-32 rounded-lg object-cover"
                    />
                    <div className="ml-6 flex-grow">
                      <h3 className="text-xl font-semibold">{book.title}</h3>
                      <p className="text-blue-600 font-bold text-lg">${book.price}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => alert('Edit book feature coming soon!')}
                        className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Books Bought */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Books Bought</h2>
              {user.booksBought.length === 0 && (
                <p className="text-gray-600">You haven't bought any books yet.</p>
              )}
              <div className="space-y-6">
                {user.booksBought.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center bg-gray-50 rounded-xl shadow p-4"
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-20 h-28 rounded-lg object-cover"
                    />
                    <div className="ml-6 flex-grow">
                      <h3 className="text-lg font-semibold">{book.title}</h3>
                      <p className="text-blue-600 font-bold">${book.price}</p>
                      <p className="text-sm text-gray-600">
                        Seller: <span className="font-semibold">{book.seller}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Purchased on: {new Date(book.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
              {user.reviews.length === 0 && (
                <p className="text-gray-600">No reviews yet.</p>
              )}
              <div className="space-y-6">
                {user.reviews.map((rev) => (
                  <div key={rev.id} className="bg-gray-50 rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{rev.reviewer}</h3>
                      <StarRating rating={rev.rating} />
                    </div>
                    <p className="text-gray-700">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add New Book</h3>
            <input
              type="text"
              placeholder="Book Title"
              className="w-full mb-3 border border-gray-300 rounded px-3 py-2"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price in $"
              className="w-full mb-3 border border-gray-300 rounded px-3 py-2"
              value={newBook.price}
              onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
            />
            <input
              type="text"
              placeholder="Cover Image URL"
              className="w-full mb-6 border border-gray-300 rounded px-3 py-2"
              value={newBook.cover}
              onChange={(e) => setNewBook({ ...newBook, cover: e.target.value })}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBook}
                className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {/* Edit Profile Modal */}
{showEditProfileModal && (
  <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-none">
    {/* modal container */}
    <div
      className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 pointer-events-auto"
      style={{ maxHeight: '90vh', overflowY: 'auto' }}
    >
      <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
      <input
        type="text"
        placeholder="Full Name"
        className="w-full mb-3 border border-gray-300 rounded px-3 py-2"
        value={editProfileData.name}
        onChange={(e) =>
          setEditProfileData({ ...editProfileData, name: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="College"
        className="w-full mb-3 border border-gray-300 rounded px-3 py-2"
        value={editProfileData.college}
        onChange={(e) =>
          setEditProfileData({ ...editProfileData, college: e.target.value })
        }
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full mb-3 border border-gray-300 rounded px-3 py-2"
        value={editProfileData.email}
        onChange={(e) =>
          setEditProfileData({ ...editProfileData, email: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Profile Picture URL"
        className="w-full mb-6 border border-gray-300 rounded px-3 py-2"
        value={editProfileData.profilePic}
        onChange={(e) =>
          setEditProfileData({ ...editProfileData, profilePic: e.target.value })
        }
      />
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setShowEditProfileModal(false)}
          className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={saveProfile}
          className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
