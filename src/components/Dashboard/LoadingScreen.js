
import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';

const LoadingScreen = () => {

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
                        <p className="text-gray-600">Preparing your dashboard...</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default LoadingScreen;