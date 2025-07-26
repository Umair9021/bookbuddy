
"use client";

import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Edit, Camera, GraduationCap, Building, Loader2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import getImageSrc from '@/utils/getImageSrc';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NewProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const [userInfo, setUserInfo] = useState({
    name: '',
    username: '',
    major: 'Science',
    collegeName: 'CTI College',
    address: '',
    email: '',
    about: '',
    dp: '',
    coverdp: '',
  });

  const [userBooks, setUserBooks] = useState([]);
  const [originalUserInfo, setOriginalUserInfo] = useState({
    name: '',
    username: '',
    major: 'Science',
    collegeName: 'CTI College',
    address: '',
    email: '',
    about: '',
    dp: '',
    coverdp: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Auth error:', error);
          setError("Authentication failed. Please log in again.");
          router.push('/auth/login');
          return;
        }

        if (!user) {
          setError("Please log in to view your profile.");
          router.push('/auth/login');
          return;
        }

        setUser(user);
        setUserId(user.id);
      } catch (error) {
        console.error('Error checking auth:', error);
        setError("Authentication failed. Please log in again.");
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  const safeJsonParse = async (response) => {
    const text = await response.text();
    if (!text) {
      throw new Error('Empty response from server');
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('Failed to parse JSON:', text);
      throw new Error('Invalid JSON response from server');
    }
  };

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userResponse = await fetch(`/api/users/${userId}`);

        if (userResponse.ok) {
          const userData = await safeJsonParse(userResponse);
          const mappedUserInfo = {
            name: userData.name || user?.user_metadata?.full_name || '',
            username: userData.username || '',
            major: userData.major || 'Science',
            collegeName: userData.collegeName || 'CTI College',
            address: userData.address || '',
            email: userData.email || user?.email || '',
            about: userData.about || '',
            dp: userData.dp || '',
            coverdp: userData.coverdp || '',
          };
          setUserInfo(mappedUserInfo);
          setOriginalUserInfo(mappedUserInfo);
        } else if (userResponse.status === 404) {
          const basicUserInfo = {
            name: user?.user_metadata?.full_name || 'User',
            username: '',
            major: 'Science',
            collegeName: 'CTI College',
            address: '',
            email: user?.email || '',
            about: '',
            dp: '',
            coverdp: '',
          };
          setUserInfo(basicUserInfo);
          setOriginalUserInfo(basicUserInfo);
        } else {
          let errorMessage = 'Failed to fetch user data';
          try {
            const errorData = await safeJsonParse(userResponse);
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            errorMessage = `Server error: ${userResponse.status} ${userResponse.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const booksResponse = await fetch(`/api/books?sellerId=${userId}`);
        if (booksResponse.ok) {
          const booksData = await safeJsonParse(booksResponse);
          setUserBooks(booksData);
        } else {
          console.warn('Failed to fetch user books, setting empty array');
          setUserBooks([]);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || "Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const validateForm = () => {
    const errors = {};

    if (!userInfo.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!userInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (userInfo.username && userInfo.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (userInfo.about && userInfo.about.length > 500) {
      errors.about = 'About section cannot exceed 500 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEdit = () => {
    setOriginalUserInfo(userInfo);
    setIsEditing(true);
    setValidationErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors before saving.");
      return;
    }

    
    try {
      setSaving(true);
      setError(null);
      const dataToSave = {
        _id: userId,
        name: userInfo.name.trim(),
        username: userInfo.username.trim(),
        major: userInfo.major,
        collegeName: userInfo.collegeName,
        address: userInfo.address,
        email: userInfo.email.trim(),
        about: userInfo.about,
        dp: userInfo.dp,
        coverdp: userInfo.coverdp,
      };

      let response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.status === 404) {
        response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSave),
        });
      }

      if (!response.ok) {
        let errorMessage = 'Failed to save profile';
        try {
          const errorData = await safeJsonParse(response);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const updatedUser = await safeJsonParse(response);
      setOriginalUserInfo(userInfo);
      setIsEditing(false);
      toast.success("Profile updated successfully!");

    } catch (error) {
      console.error('Error saving user data:', error);
      const errorMessage = error.message || "Failed to save profile changes.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUserInfo(originalUserInfo);
    setIsEditing(false);
    setValidationErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleImageUpload = async (type, event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image size must be less than 5MB");
    return;
  }

  if (!file.type.startsWith('image/')) {
    toast.error("Please select a valid image file");
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to upload image');
    }

    const fieldName = type === 'profileImage' ? 'dp' : 'coverdp';

    setUserInfo(prev => ({
      ...prev,
      [fieldName]: result.url
    }));

    toast.success(`${type === 'profileImage' ? 'Profile' : 'Cover'} image updated`);

  } catch (error) {
    console.error('Upload failed:', error);
    toast.error("Image upload failed");
  }
};


  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <Navbar />
        <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center space-y-6">
            {/* Circular Progress */}
            <div className="relative w-24 h-24 mx-auto">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className="text-indigo-600"
                  strokeDasharray="251.2"
                  strokeDashoffset="62.8"
                  style={{
                    animation: 'spin 2s linear infinite'
                  }}
                />
              </svg>
              {/* BookBuddy Icon in Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">BookBuddy</h3>
              <p className="text-gray-600">Loading your data...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="relative h-48 md:h-64">
        <img
          src={getImageSrc(userInfo.coverdp) || 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=2070&auto=format&fit=crop'}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        {isEditing && (
          <div className="absolute bottom-4 right-4 z-10">
            <input type="file"
              id="cover-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload('coverImage', e)}
            />
            <Button asChild variant="secondary" size="sm">
              <label htmlFor="cover-upload" className="cursor-pointer">
                <Camera className="w-4 h-4 mr-2" /> Change Cover
              </label>
            </Button>
          </div>
        )}
      </header>

      <main className="container mx-auto p-4 -mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Sidebar */}
          <aside className="lg:col-span-4 lg:sticky top-4">
            <Card className="overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900">
                    <AvatarImage
                      src={getImageSrc(userInfo.dp) || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80'}
                      alt={userInfo.name}
                    />
                    <AvatarFallback>{getInitials(userInfo.name)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute bottom-1 right-1">
                      <input
                        type="file"
                        id="profile-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('profileImage', e)}
                      />
                      <Button asChild variant="secondary" size="icon" className="w-8 h-8 rounded-full">
                        <label htmlFor="profile-upload" className="cursor-pointer">
                          <Camera className="w-4 h-4" />
                        </label>
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-4 w-full">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        name="name"
                        value={userInfo.name}
                        onChange={handleInputChange}
                        className="text-2xl font-bold text-center h-12"
                        placeholder="Your Name"
                      />
                      {validationErrors.name && (
                        <p className="text-red-500 text-sm">{validationErrors.name}</p>
                      )}
                      <Input
                        name="username"
                        value={userInfo.username}
                        onChange={handleInputChange}
                        className="text-center"
                        placeholder="Username"
                      />
                      {validationErrors.username && (
                        <p className="text-red-500 text-sm">{validationErrors.username}</p>
                      )}
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold">{userInfo.name || 'User'}</h1>
                      <p className="text-gray-500 dark:text-gray-400">@{userInfo.username || 'username'}</p>
                    </>
                  )}
                </div>
              </div>
              <Separator />
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">About Me</h3>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        name="about"
                        value={userInfo.about}
                        onChange={handleInputChange}
                        placeholder="A little about yourself..."
                        className="text-sm min-h-[100px]"
                        maxLength={500}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{validationErrors.about && <span className="text-red-500">{validationErrors.about}</span>}</span>
                        <span>{userInfo.about.length}/500</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
                      {userInfo.about || 'No bio provided yet.'}
                    </p>
                  )}
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-semibold">Education</h3>
                  {isEditing ? (
                    <div className="space-y-2">
                      <select
                        name="major"
                        value={userInfo.major}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        <option value="Science">Science</option>
                        <option value="Engineering">Engineering</option>
                      </select>
                      <Input
                        name="collegeName"
                        value={userInfo.collegeName}
                        onChange={handleInputChange}
                        placeholder="College/University"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <GraduationCap className="w-4 h-4" />
                        {userInfo.major}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Building className="w-4 h-4" />
                        {userInfo.collegeName}
                      </div>
                    </>
                  )}
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-semibold">Contact</h3>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        name="address"
                        value={userInfo.address}
                        onChange={handleInputChange}
                        placeholder="Location"
                      />
                      <div className="space-y-1">
                        <Input
                          type="email"
                          name="email"
                          value={userInfo.email}
                          onChange={handleInputChange}
                          placeholder="Email"
                        />
                        {validationErrors.email && (
                          <p className="text-red-500 text-sm">{validationErrors.email}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <MapPin className="w-4 h-4" />
                        {userInfo.address || 'No location provided'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Mail className="w-4 h-4" />
                        {userInfo.email}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              {isEditing && (
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleCancel} disabled={saving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </CardFooter>
              )}
              {!isEditing && (
                <CardFooter>
                  <Button onClick={handleEdit} className="w-full">
                    <Edit className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                </CardFooter>
              )}
            </Card>
          </aside>

          {/* Right Content */}
          <div className="lg:col-span-8 lg:mt-24">
            <Card>
              <CardHeader>
                <CardTitle>Books for Sale</CardTitle>
                <CardDescription>Books you have listed on the marketplace.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                {userBooks.length > 0 ? (
                  userBooks.map(book => (
                    <Card key={book._id} className="overflow-hidden group p-0">
                      <img
                        src={getImageSrc(book.pictures?.[0]) || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                        alt={book.title}
                        className="h-60 w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate">{book.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{book.category}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${book.status === 'Available' || !book.isSold ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            book.status === 'sold' || book.isSold ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}>
                            {book.isSold ? 'Sold' : book.status || 'Available'}
                          </span>
                          <span className="text-xs text-gray-500">{book.condition}</span>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="font-bold text-lg">${book.price}</span>
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button variant="outline" size="sm">Details</Button>
                            </HoverCardTrigger>
                          </HoverCard>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No books listed yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewProfilePage;