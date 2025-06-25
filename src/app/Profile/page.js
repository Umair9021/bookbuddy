"use client";

import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Mail, Phone, Camera, Edit3, Heart, MessageCircle, Share2, BookOpen, ShoppingCart, DollarSign, Star, GraduationCap, Clock, Settings, Plus, Award, Trophy, Target, Book } from 'lucide-react';

const ModernUserProfile = () => {
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);


  const [userInfo, setUserInfo] = useState({
    name: '',
    major: '',
    post: '',
    university: '',
    location: '',
    email: '',
    phone: '',
    bio: '',
    profileImage: null,
    coverImage: null,
    
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const stats = [
    { label: 'Books Sold', value: '23', icon: DollarSign, color: 'from-emerald-500 to-teal-600' },
    { label: 'Books Bought', value: '31', icon: ShoppingCart, color: 'from-blue-500 to-cyan-600' },
    { label: 'Rating', value: '4.9', icon: Star, color: 'from-yellow-500 to-orange-600' },
    { label: 'Active Days', value: '127', icon: Clock, color: 'from-purple-500 to-pink-600' }
  ];

  const recentBooks = [
    { 
      id: 1, 
      title: 'Introduction to Algorithms', 
      author: 'Cormen, Leiserson', 
      price: '$45', 
      condition: 'Good', 
      type: 'Selling',
      course: 'CS 161',
      status: 'available'
    },
    { 
      id: 2, 
      title: 'Calculus: Early Transcendentals', 
      author: 'James Stewart', 
      price: '$35', 
      condition: 'Like New', 
      type: 'Sold',
      course: 'MATH 41',
      status: 'sold'
    },
    { 
      id: 3, 
      title: 'Physics for Scientists', 
      author: 'Serway & Jewett', 
      price: '$50', 
      condition: 'Fair', 
      type: 'Looking for',
      course: 'PHYS 41',
      status: 'wanted'
    }
  ];

  const reviews = [
    { id: 1, reviewer: 'Mike Chen', rating: 5, comment: 'Great seller! Book was exactly as described, fast transaction.', date: '2 days ago', avatar: 'MC' },
    { id: 2, reviewer: 'Emma Davis', rating: 5, comment: 'Very responsive and helpful. Would definitely buy from again!', date: '1 week ago', avatar: 'ED' },
    { id: 3, reviewer: 'Alex Kumar', rating: 4, comment: 'Good condition book, fair price. Smooth transaction overall.', date: '2 weeks ago', avatar: 'AK' }
  ];

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserInfo(prev => ({ ...prev, [type]: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch(status) {
      case 'available':
        return <span className={`${baseClasses} bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200`}>Available</span>;
      case 'sold':
        return <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`}>Sold</span>;
      case 'wanted':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>Wanted</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-6">
        {/* Header Profile Section */}
        <div className={`bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden rounded-3xl transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
          {/* Cover Image */}
          <div className="h-48 relative">
            {userInfo.coverImage ? (
              <img src={userInfo.coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            {isEditing && (
              <div className="absolute top-4 right-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('coverImage', e)}
                  className="hidden"
                  id="cover-upload"
                />
                <label htmlFor="cover-upload" className="inline-flex items-center px-3 py-2 bg-black/50 backdrop-blur border border-white/20 rounded-lg text-white text-sm hover:bg-black/70 transition-colors cursor-pointer">
                  <Camera className="w-4 h-4 mr-2" />
                  Cover
                </label>
              </div>
            )}
          </div>

          <div className="p-8 -mt-16 relative">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Profile Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl ring-4 ring-purple-500/20 overflow-hidden">
                  {userInfo.profileImage ? (
                    <img src={userInfo.profileImage} alt={userInfo.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                      {userInfo.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('profileImage', e)}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label htmlFor="profile-upload" className="inline-flex items-center justify-center w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg cursor-pointer transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </label>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      value={userInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-2xl font-bold bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-lg px-3 py-2 w-full"
                      placeholder="Full Name"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        value={userInfo.major}
                        onChange={(e) => handleInputChange('major', e.target.value)}
                        className="bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-lg px-3 py-2"
                        placeholder="Major"
                      />
                      <input
                        value={userInfo.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        className="bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-lg px-3 py-2"
                        placeholder="Year"
                      />
                    </div>
                    <input
                      value={userInfo.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      className="bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-lg px-3 py-2 w-full"
                      placeholder="University"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                        {userInfo.name}
                      </h1>
                      <div className="flex items-center gap-2 mt-2">
                        <GraduationCap className="w-5 h-5 text-purple-400" />
                        <span className="text-white/80 text-lg">{userInfo.major} • {userInfo.year}</span>
                      </div>
                      <p className="text-white/60 mt-1">{userInfo.university}</p>
                    </div>
                  </>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        value={userInfo.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="bg-transparent border-b border-white/30 text-white text-sm px-1 py-0"
                        placeholder="Location"
                      />
                    ) : (
                      userInfo.location
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-transparent border-b border-white/30 text-white text-sm px-1 py-0 w-48"
                        placeholder="Email"
                      />
                    ) : (
                      userInfo.email
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                {isEditing ? (
                  <>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 mt-40 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg font-medium shadow-lg transition-all duration-200"
                    >
                      Save Changes
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 mt-40 border border-white/20 text-white hover:bg-white/10 rounded-lg font-medium transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 mt-30 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {stats.map((stat, index) => (
            <div key={stat.label} className="bg-black/20 backdrop-blur-xl border border-white/10 hover:bg-black/30 transition-all duration-300 hover:scale-105 group rounded-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <div className={`bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl transform transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Tab Navigation */}
          <div className="flex border-b border-white/10">
            {['About', 'Books', 'Reviews'].map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                  activeTab === tab.toLowerCase()
                    ? 'text-white bg-white/10 border-b-2 border-purple-400'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'about' && (
              <div className="space-y-8">
                {/* Bio Section */}
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
                  <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        About Me
                      </h3>
                    </div>
                    {isEditing ? (
                      <textarea
                        value={userInfo.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="w-full h-32 bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        placeholder="Tell other students about yourself..."
                      />
                    ) : (
                      <p className="text-white/80 leading-relaxed text-lg">{userInfo.bio}</p>
                    )}
                  </div>
                </div>


              </div>
            )}

            {activeTab === 'books' && ( 
                <div className="space-y-6">
                  {recentBooks.map((book) => (
                    <div key={book.id} className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 rounded-2xl">
                      <div className="p-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 space-y-2">
                            <h4 className="text-lg font-semibold text-white">{book.title}</h4>
                            <p className="text-white/70">by {book.author}</p>
                            <div className="flex items-center gap-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                                {book.course}
                              </span>
                              <span className="text-white/60 text-sm">Condition: {book.condition}</span>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="text-2xl font-bold text-white">{book.price}</div>
                            {getStatusBadge(book.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Student Reviews</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <span className="text-white/80 ml-2 font-semibold">4.9/5</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 rounded-2xl">
                      <div className="p-6">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-full ring-2 ring-purple-500/30 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                            {review.avatar}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-white">{review.reviewer}</h4>
                              <span className="text-white/50 text-sm">{review.date}</span>
                            </div>
                            <div className="flex text-yellow-400">
                              {[1,2,3,4,5].map(star => (
                                <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : ''}`} />
                              ))}
                            </div>
                            <p className="text-white/80 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernUserProfile;