import React from 'react';
import { BookOpen, DollarSign, ShoppingCart, Eye } from 'lucide-react';
import StatusDonutChart from './StatusDonutChart';

const OverviewPage =({ books, filteredBooks, dashboardStats })=> {

     const stats = dashboardStats ? [
            { title: 'Total Books', value: dashboardStats.totalBooks.toString(), icon: BookOpen, color: 'bg-blue-500' },
            { title: 'Total Sales', value: `$${books.filter(book=> book.status=='Sold').reduce((total,book)=> total + book.price,0).toFixed(2)}`, icon: DollarSign, color: 'bg-green-500' },
            { title: 'Available Books', value:books.filter(book=>book.status=='Available').length.toString(), icon: ShoppingCart, color: 'bg-orange-500' },
            { title: 'Profile Views', value: dashboardStats.profileViews.toString(), icon: Eye, color: 'bg-purple-500' }
        ] : [];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={`${stat.title}-${index}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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
                            {filteredBooks.slice(0, 4).map((book) => (
                                <div key={`${book._id}-${book.title}`} className="flex gap-4 items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <BookOpen className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 text-sm">{book.title}</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 mt-1 pb-1 mr-5">{`$${book.price}`}</p>
                                        <p className={`px-2 py-1 rounded-full text-xs font-medium ${book.status === 'Available' ? 'bg-green-100 text-green-800' :
                                            book.status === 'Sold' ? 'bg-blue-100 text-blue-800 mr-3' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {book.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {filteredBooks.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>No books found</p>
                                </div>
                            )}
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
}

export default OverviewPage;