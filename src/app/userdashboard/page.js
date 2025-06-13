"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client'
import {
    Menu,
    Home,
    BookPlus,
    BookOpen,
    Package,
    User,
    Settings,
    LogOut,
    ChevronLeft,
    Search,
    Bell,
    Star, ImageIcon,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Eye,
    Upload,
    X,
    Edit,
    Trash2,
    CheckCircle,
    AlertCircle,
    Clock,
    LogIn,
} from 'lucide-react';

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// Shadcn UI Components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";

const Dashboard = () => {
    const { user, loading } = useAuth();

    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [user1, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()


            const currentUser = session?.user ?? null
            setUser(currentUser)

            if (currentUser?.user_metadata?.picture) {
                setAvatarUrl(currentUser.user_metadata.picture)
            }
        }

        getUser();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null
            setUser(currentUser)

            if (currentUser?.user_metadata?.picture) {
                setAvatarUrl(currentUser.user_metadata.picture)
            }
        })
        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])


    const [avatarUrl, setAvatarUrl] = useState(null)

    const StatusDonutChart = ({ books }) => {
        // Calculate statistics
        const statusCounts = books.reduce((acc, { status }) => {
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const totalBooks = books.length;
        const statusColors = {
            'Sold': 'text-indigo-600',
            'Pending': 'text-amber-500',
            'Active': 'text-emerald-500'
        };
        const statusBgColors = {
            'Sold': 'bg-indigo-600',
            'Pending': 'bg-amber-500',
            'Active': 'bg-emerald-500'
        };

        const segments = Object.entries(statusCounts)
            .map(([status, count]) => ({
                status,
                count,
                percentage: Math.round((count / totalBooks) * 100),
                color: statusColors[status],
                bgColor: statusBgColors[status]
            }))
            .sort((a, b) => b.percentage - a.percentage);

        // Animation state
        const [animatedPercentages, setAnimatedPercentages] = useState(
            segments.reduce((acc, seg) => ({ ...acc, [seg.status]: 0 }), {})
        );

        useEffect(() => {
            // Animate the percentages on mount
            const animationDuration = 1500;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);

                const newPercentages = {};
                segments.forEach(seg => {
                    newPercentages[seg.status] = Math.floor(progress * seg.percentage);
                });

                setAnimatedPercentages(newPercentages);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        }, [books]);

        return (
            <div className="flex flex-col items-center space-y-8 p-6">
                {/* Donut Chart with Animated Segments */}
                <div className="relative w-64 h-64">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#f3f4f6"
                            strokeWidth="10"
                        />

                        {/* Segments */}
                        {(() => {
                            let cumulativePercent = 0;
                            return segments.map((segment, i) => {
                                const segmentPercent = animatedPercentages[segment.status] || 0;
                                const dashArray = `${segmentPercent} ${100 - segmentPercent}`;
                                const dashOffset = 100 - cumulativePercent;
                                cumulativePercent += segmentPercent;

                                return (
                                    <circle
                                        key={i}
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="currentColor"
                                        className={segment.color}
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray={dashArray}
                                        strokeDashoffset={dashOffset}
                                        transform="rotate(-90 50 50)"
                                    />
                                );
                            });
                        })()}
                    </svg>

                    {/* Center text with counter animation */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900">
                            {totalBooks}
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                            Total Books
                        </span>
                    </div>
                </div>

                {/* Enhanced Legend */}
                <div className="w-full space-y-4">
                    {segments.map((segment, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`w-4 h-4 rounded-full ${segment.bgColor}`} />
                                <span className="text-sm font-medium text-gray-700">
                                    {segment.status}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-semibold text-gray-900">
                                    {segment.count}
                                </span>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                    {animatedPercentages[segment.status] || 0}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        );
    };

    // Form state for Add Book
    const [bookForm, setBookForm] = useState({
        title: '',
        author: '',
        price: '',
        condition: 'New',
        category: 'Select Category',
        isbn: '',
        description: '',
        images: [],
        thumbnailIndex: 0,
    });

    // Books state with search functionality
    const [books, setBooks] = useState([
        { id: 1, title: 'Calculus: Early Transcendentals', author: 'James Stewart', price: '$89', status: 'Active', views: 23, category: 'Textbook' },
        { id: 2, title: 'Introduction to Psychology', author: 'David Myers', price: '$65', status: 'Sold', views: 45, category: 'Academic' },
        { id: 3, title: 'Organic Chemistry', author: 'Paula Bruice', price: '$120', status: 'Active', views: 12, category: 'Textbook' },
        { id: 4, title: 'Linear Algebra', author: 'Gilbert Strang', price: '$75', status: 'Pending', views: 8, category: 'Academic' }
    ]);

    const [filteredBooks, setFilteredBooks] = useState(books);

    // Notifications
    const [notifications] = useState([
        { id: 1, type: 'success', title: 'Book Sold!', message: 'Your calculus book has been purchased', time: '2 min ago' },
        { id: 2, type: 'info', title: 'New Message', message: 'Buyer inquired about your psychology book', time: '1 hour ago' },
        { id: 3, type: 'warning', title: 'Price Alert', message: 'Similar books are listed for lower prices', time: '3 hours ago' }
    ]);

    // Search functionality
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredBooks(books);
        } else {
            const filtered = books.filter(book =>
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredBooks(filtered);
        }
    }, [searchQuery, books]);

    // Form handlers
    const handleFormChange = (field, value) => {
        setBookForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        setBookForm(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const setThumbnail = (index) => {
        setBookForm(prev => ({
            ...prev,
            thumbnailIndex: index
        }));
    };
    const removeImage = (index) => {
        setBookForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const updatehandle = () => {
        if (selectedBook) {
            setBooks(prev => prev.map(book =>
                book.id === selectedBook.id
                    ? {
                        ...book,
                        title: bookForm.title || selectedBook.title,
                        price: bookForm.price ? `$${bookForm.price}` : selectedBook.price
                    }
                    : book
            ));

            // Reset form
            setBookForm({
                title: '',
                author: '',
                price: '',
                condition: 'New',
                category: 'Select Category',
                isbn: '',
                description: '',
                images: [],
                thumbnailIndex: 0
            });

            // Close dialog
            setEditDialogOpen(false);
            setSelectedBook(null);

        }
    }
    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }
    const handleSubmitBook = () => {
        const newBook = {
            id: books.length + 1,
            title: bookForm.title,
            price: `$${bookForm.price}`,
            status: 'Active',
            views: 0,
            category: bookForm.category
        };
        setBooks(prev => [...prev, newBook]);
        setBookForm({
            title: '',
            author: '',
            price: '',
            condition: 'New',
            category: 'Select Category',
            isbn: '',
            description: '',
            images: []
        });
        alert('Book published successfully!');
    };

    const handleDeleteBook = (bookId) => {
        setBooks(prev => prev.filter(book => book.id !== bookId));
    };

    const handleEditBook = (book) => {
        setSelectedBook(book);
        setBookForm(prev => ({
            ...prev,
            title: book.title,
            price: book.price.replace('$', '')
        }));
        setEditDialogOpen(true);
    };

    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'addbook', label: 'Add Book', icon: BookPlus },
        { id: 'books', label: 'My Books', icon: BookOpen },
    ];

    const stats = [
        { title: 'Total Books', value: books.length.toString(), icon: BookOpen, color: 'bg-blue-500' },
        { title: 'Total Sales', value: '$1,234', icon: DollarSign, color: 'bg-green-500' },
        { title: 'Active Orders', value: '8', icon: ShoppingCart, color: 'bg-orange-500' },
        { title: 'Profile Views', value: '156', icon: Eye, color: 'bg-purple-500' }
    ];
    const handleprofile = () => {
        router.push('profile');
    }
    if (loading || (user === undefined)) {
        return (
            <div className="min-h-screen flex flex-col bg-muted">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <p>Loading...</p>
                </div>
                <Footer />
            </div>
        );
    }
    const handlemainpage = () => {
        router.push('/')
    }
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                        </div>
                                        <div className={`${stat.color} p-3 rounded-lg`}>
                                            <stat.icon className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Books */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Books</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {filteredBooks.slice(0, 4).map((book, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 text-sm">{book.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{book.price} • Views: {book.views}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${book.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                    book.status === 'Sold' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {book.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>


                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                                <div className="px-6 py-4 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Inventory Distribution</h3>
                                            <p className="text-sm text-gray-500">Current status of your listings</p>
                                        </div>
                                        <div className="p-2 rounded-lg bg-gray-50">
                                            <BookOpen className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <StatusDonutChart books={books} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'addbook':
                return (
                    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
                        <div className="max-w-4xl mx-auto">
                            <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <BookPlus className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold">List Your Book</h2>
                                            <p className="text-indigo-100 mt-2">Create an amazing listing that sells</p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-8">
                                    <div className="space-y-8">

                                        {/* Title and Price Row */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            <div className="lg:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                                    Book Title
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={bookForm.title}
                                                    onChange={(e) => handleFormChange('title', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-lg"
                                                    placeholder="What's the title of your book?"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                                    Price
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">$</span>
                                                    <input
                                                        type="number"
                                                        value={bookForm.price}
                                                        onChange={(e) => handleFormChange('price', e.target.value)}
                                                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-lg"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Condition and Category Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-800 mb-3">Condition</label>
                                                <select
                                                    value={bookForm.condition}
                                                    onChange={(e) => handleFormChange('condition', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-lg bg-white"
                                                >
                                                    <option>New</option>
                                                    <option>Like New</option>
                                                    <option>Good</option>
                                                    <option>Fair</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-800 mb-3">Category</label>
                                                <select
                                                    value={bookForm.category}
                                                    onChange={(e) => handleFormChange('category', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-lg bg-white"
                                                >
                                                    <option disabled>Select Category</option>
                                                    <option>First Year</option>
                                                    <option>Second Year</option>
                                                    <option>Third Year</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-3">Description</label>
                                            <textarea
                                                rows="4"
                                                value={bookForm.description}
                                                onChange={(e) => handleFormChange('description', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-lg resize-none"
                                                placeholder="Tell buyers about your book's condition, edition, and what makes it special..."
                                            />
                                        </div>

                                        {/* Image Upload Section */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                                                Book Images (Up to 3)
                                                <span className="text-gray-500 font-normal ml-2">- Choose your thumbnail</span>
                                            </label>

                                            {bookForm.images.length === 0 ? (
                                                <div
                                                    className="border-3 border-dashed border-indigo-200 rounded-2xl p-12 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-300 cursor-pointer group"
                                                    onClick={() => document.getElementById('file-upload').click()}
                                                >
                                                    <div className="space-y-4">
                                                        <div className="relative">
                                                            <Upload className="h-16 w-16 text-indigo-300 mx-auto group-hover:text-indigo-500 group-hover:scale-110 transition-all duration-300" />
                                                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                                                Max 3
                                                            </div>
                                                        </div>
                                                        <div className="text-gray-700">
                                                            <p className="font-semibold text-lg">Drop your images here</p>
                                                            <p className="text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                                                        </div>
                                                    </div>
                                                    <input
                                                        id="file-upload"
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleFileUpload}
                                                        className="hidden"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    {/* Image Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        {[0, 1, 2].map((index) => (
                                                            <div key={index} className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="font-semibold text-gray-700">
                                                                        {index === 0 ? 'Thumbnail' : `Image ${index + 1}`}
                                                                    </h4>
                                                                    {bookForm.images[index] && (
                                                                        <button
                                                                            onClick={() => setThumbnail(index)}
                                                                            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-all ${bookForm.thumbnailIndex === index
                                                                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                                                                : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
                                                                                }`}
                                                                        >
                                                                            <Star className={`h-3 w-3 ${bookForm.thumbnailIndex === index ? 'fill-current' : ''}`} />
                                                                            <span>{bookForm.thumbnailIndex === index ? 'Thumbnail' : 'Set as thumbnail'}</span>
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                {bookForm.images[index] ? (
                                                                    <div className="relative group">
                                                                        <img
                                                                            src={URL.createObjectURL(bookForm.images[index])}
                                                                            alt={`Upload ${index + 1}`}
                                                                            className={`w-full h-48 object-cover rounded-xl border-3 transition-all ${bookForm.thumbnailIndex === index
                                                                                ? 'border-yellow-400 shadow-lg'
                                                                                : 'border-gray-200 group-hover:border-gray-300'
                                                                                }`}
                                                                        />
                                                                        <button
                                                                            onClick={() => removeImage(index)}
                                                                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </button>
                                                                        {bookForm.thumbnailIndex === index && (
                                                                            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                                                                <Star className="h-3 w-3 fill-current" />
                                                                                <span>Thumbnail</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        className="h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-all cursor-pointer"
                                                                        onClick={() => document.getElementById('file-upload').click()}
                                                                    >
                                                                        <ImageIcon className="h-8 w-8 mb-2" />
                                                                        <span className="text-sm">Add Image</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Add More Button */}
                                                    {bookForm.images.length < 3 && (
                                                        <button
                                                            onClick={() => document.getElementById('file-upload').click()}
                                                            className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 font-medium"
                                                        >
                                                            + Add More Images ({bookForm.images.length}/3)
                                                        </button>
                                                    )}

                                                    <input
                                                        id="file-upload"
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleFileUpload}
                                                        className="hidden"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-200">

                                            <button
                                                onClick={handleSubmitBook}
                                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-xl"
                                            >
                                                <BookPlus className="h-5 w-5" />
                                                <span>Publish Book</span>
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );

            case 'books':
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">My Books</h2>
                                    <p className="text-gray-600 mt-1">Manage your book listings</p>
                                </div>
                                <button
                                    onClick={() => setActiveTab('addbook')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                    <BookPlus className="h-4 w-4" />
                                    <span>Add Book</span>
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Book</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Views</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBooks.map((book, index) => (
                                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <div className="font-medium text-gray-900">{book.title}</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="font-small text-gray-900">{book.category}</div>
                                                </td>
                                                <td className="py-4 px-4 text-gray-600">{book.price}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${book.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                        book.status === 'Sold' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {book.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-gray-600">{book.views}</td>
                                                <td className="py-4 px-4">
                                                    <div className="flex space-x-2">
                                                        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                                                            <DialogTrigger asChild>
                                                                <button
                                                                    onClick={() => handleEditBook(book)}
                                                                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                                                                >
                                                                    <Edit className="h-3 w-3" />
                                                                    <span>Edit</span>
                                                                </button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[425px]">
                                                                <DialogHeader>
                                                                    <DialogTitle>Edit Book</DialogTitle>
                                                                    <DialogDescription>
                                                                        Make changes to your book listing here.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="grid gap-4 py-4">
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <label htmlFor="edit-title" className="text-right">Title</label>
                                                                        <input
                                                                            id="edit-title"
                                                                            defaultValue={selectedBook?.title}
                                                                            onChange={(e) => handleFormChange('title', e.target.value)}
                                                                            className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg"
                                                                        />
                                                                    </div>
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <label htmlFor="edit-price" className="text-right">Price</label>
                                                                        <input
                                                                            id="edit-price"
                                                                            defaultValue={selectedBook?.price?.replace('$', '')}
                                                                            onChange={(e) => handleFormChange('price', e.target.value)}
                                                                            className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={updatehandle}>
                                                                        Save changes
                                                                    </button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <button className="text-red-600 hover:text-red-800 text-sm flex items-center space-x-1">
                                                                    <Trash2 className="h-3 w-3" />
                                                                    <span>Delete</span>
                                                                </button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete your book listing.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDeleteBook(book.id)}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            default:

                return (
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="text-gray-400 mb-4">
                                <Package className="h-16 w-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Page Not Found</h3>
                            <p className="text-gray-600">The requested page could not be found.</p>
                        </div>
                    </div>
                );
        }
    };
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col bg-muted">
                <Navbar />
                <Card className="w-[500px] m-auto shadow-lg mt-15">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            Authentication Required
                        </CardTitle>
                        <CardDescription className="text-gray-500">
                            Please login to see dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <Button
                            onClick={() => router.push('/auth/login')}
                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                        >
                            <LogIn className="h-4 w-4" />
                            Login Now
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/auth/signup')}
                        >
                            Create Account
                        </Button>
                    </CardContent>
                </Card>
                <Footer />
            </div>
        );
    }
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900 capitalize">
                                {activeTab === 'addbook' ? 'Add Book' :
                                    activeTab === 'books' ? 'My Books' :
                                        activeTab === 'orders' ? 'Orders' : 'Overview'}
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Search Bar */}
                            {(activeTab === 'books' || activeTab === 'overview') && (
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Search books..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            )}

                            {/* User Profile */}
                            <div className="w-10 h-10  rounded-full flex items-center justify-center">
                                <img
                                    className="w-10 h-10 rounded-full"
                                    src={avatarUrl || '/image.avif'}
                                    alt="User Profile"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};
export default Dashboard;