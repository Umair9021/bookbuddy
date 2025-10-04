'use client';
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import getImageSrc from '@/utils/getImageSrc';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from "@/components/AuthProvider";
import InfoModal from "@/components/InfoModal";

const BookDetailsModal = ({ isOpen, onClose, book }) => {

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selfChatOpen, setSelfChatOpen] = useState(false);
    // Refs for touch/swipe support on mobile
    const touchStartX = useRef(null);
    const touchCurrentX = useRef(null);
    const touchStartTime = useRef(null);
    const isSwiping = useRef(false);
    const selectedImageRef = useRef(null);
    const indicatorTimeoutRef = useRef(null);

    // Local state for UI affordances
    const [isDraggingState, setIsDraggingState] = useState(false);
    const [showIndicators, setShowIndicators] = useState(false);
    const { user } = useAuth();
    const { openChatWithUser } = useChat();

    React.useEffect(() => {
        if (isOpen && book) {
            setSelectedImageIndex(0);
        }
    }, [isOpen, book]);

    // Keyboard navigation (left/right arrows) when dialog is open
    React.useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handlePrev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleNext();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, book]);

    const handleThumbnailClick = (index) => {
        setSelectedImageIndex(index);
    };

    const handlePrev = (e) => {
        if (e) e.stopPropagation();
        const total = book?.pictures?.length || 0;
        if (total <= 1) return;
        setSelectedImageIndex((prev) => (prev - 1 + total) % total);
    };

    const handleNext = (e) => {
        if (e) e.stopPropagation();
        const total = book?.pictures?.length || 0;
        if (total <= 1) return;
        setSelectedImageIndex((prev) => (prev + 1) % total);
    };

    // Touch handlers for mobile swipe
    const onTouchStart = (e) => {
        if (!book?.pictures || book.pictures.length <= 1) return;
        // show indicators while interacting
        setShowIndicators(true);
        if (indicatorTimeoutRef.current) {
            clearTimeout(indicatorTimeoutRef.current);
            indicatorTimeoutRef.current = null;
        }

        touchStartX.current = e.touches[0].clientX;
        touchCurrentX.current = touchStartX.current;
        touchStartTime.current = Date.now();
        isSwiping.current = true;
        setIsDraggingState(true);

        // disable transition while dragging
        const el = selectedImageRef.current;
        if (el) el.style.transition = 'none';
    };

    const onTouchMove = (e) => {
        if (!isSwiping.current) return;
        touchCurrentX.current = e.touches[0].clientX;
        const dx = (touchCurrentX.current || 0) - (touchStartX.current || 0);
        const el = selectedImageRef.current;
        if (el) {
            el.style.transform = `translateX(${dx}px)`;
        }
    };

    const onTouchEnd = () => {
        if (!isSwiping.current) return;
        const dx = (touchCurrentX.current || 0) - (touchStartX.current || 0);
        const dt = Math.max(1, Date.now() - (touchStartTime.current || Date.now()));
        const velocity = Math.abs(dx) / dt; // px per ms

        const distanceThreshold = 50; // px
        const velocityThreshold = 0.35; // px/ms
        const shouldSlide = Math.abs(dx) > distanceThreshold || velocity > velocityThreshold;

        // restore transition and reset transform smoothly
        const el = selectedImageRef.current;
        if (el) el.style.transition = 'transform 200ms ease';

        if (shouldSlide) {
            if (dx > 0) {
                handlePrev();
            } else {
                handleNext();
            }
        }

        // snap back to zero (the image component will update after selectedImageIndex changes)
        if (el) el.style.transform = `translateX(0px)`;

        // cleanup after transition
        setTimeout(() => {
            if (el) {
                el.style.transition = '';
                el.style.transform = '';
            }
        }, 220);

        // hide dragging state and schedule hiding indicators
        setIsDraggingState(false);
        isSwiping.current = false;
        touchStartX.current = null;
        touchCurrentX.current = null;
        touchStartTime.current = null;

        indicatorTimeoutRef.current = setTimeout(() => {
            setShowIndicators(false);
            indicatorTimeoutRef.current = null;
        }, 900);
    };

    const handleContactSeller = (e, book) => {
        e.stopPropagation();

        if (book.seller) {
            if (user && (user.id === book.seller._id || user.email === book.seller.email)) {
                setSelfChatOpen(true);
                return;
            }
            openChatWithUser({
                _id: book.seller._id || book.seller.id,
                name: book.seller.name,
                email: book.seller.email,
                dp: book.seller.profilePicture || '',
                major: book.seller.major || '',
                collegeName: book.seller.collegeName || ''
            }, true);
        }
        onClose();
    };

    if (!book) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-3xl !w-[95vw] sm:!w-[90vw] max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="p-4 sm:p-6 sm:pb-0 pb-0">
                    <div className="flex justify-between items-start">
                        <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">Book Details</DialogTitle>
                        <DialogDescription className="sr-only">
                            View detailed information about the selected book including images, price, condition, and description.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="p-4 sm:p-6 sm:pt-0 pt-0">
                    {/* Mobile Layout */}
                    <div className="block lg:hidden space-y-4">
                        {/* Mobile Image Section */}
                        <div className="space-y-3">
                            <div
                                className="relative h-45 rounded-lg overflow-hidden"
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                                style={{ touchAction: 'pan-y' }}
                            >
                                <div className="h-53 bg-white rounded-lg overflow-hidden">
                                    <img
                                        ref={selectedImageRef}
                                        src={getImageSrc(book.pictures?.[selectedImageIndex] || book.pictures?.[0] || "")}
                                        alt={book.title}
                                        className={`max-h-full w-full object-center bg-gray-100 transition-transform ${isDraggingState ? 'cursor-grabbing' : 'cursor-grab'}`}
                                        onError={(e) => {
                                            e.target.src = '/placeholder-book.jpg';
                                        }}
                                    />
                                </div>

                                {book.pictures && book.pictures.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            aria-label="Previous image"
                                            onClick={handlePrev}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 focus:outline-none"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        <button
                                            type="button"
                                            aria-label="Next image"
                                            onClick={handleNext}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 focus:outline-none"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                                {/* Dots / indicators for current image (appear briefly when interacting) */}
                                {book.pictures && book.pictures.length > 1 && showIndicators && (
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                                        {book.pictures.map((p, i) => (
                                            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === selectedImageIndex ? 'bg-white' : 'bg-white/60'}`} />
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Mobile Book Details */}
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 mb-1 pl-1">{book.title}</h1>
                                {book.author && (
                                    <p className="text-sm text-gray-600">by {book.author}</p>
                                )}
                            </div>

                            {/* Mobile Info Grid */}
                            <div className="flex flex-row justify-between pl-1">
                                <div className="flex flex-col justify-start gap-2">
                                    <div>
                                        <p className="text-xs text-gray-500">Price:</p>
                                        <p className="text-lg font-bold text-green-600">Rs. {book.price}</p>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-gray-500">Year:</p>
                                        <p className="text-sm font-medium text-gray-">{book.department}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-start gap-2 mr-15">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Condition:</p>
                                        <p className="text-sm font-medium text-gray-900 mr-10 text-start">{book.condition}</p>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-gray-500 mt-2">Seller:</p>
                                        <p className="text-sm font-medium text-gray-900 text-start">{book.seller?.name || 'Umair'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Description */}
                            <div className='pl-1'>
                                <p className="text-sm text-gray-500 mb-1">Description:</p>
                                <div
                                    className="bg-white border p-2 pl-3 pr-3 w-77 rounded-lg text-gray-700 leading-relaxed overflow-y-auto overscroll-contain h-15 sm:h-15 md:h-20 lg:h-15"
                                    style={{
                                        WebkitOverflowScrolling: 'touch',
                                        overflowX: 'hidden',
                                        touchAction: 'auto',
                                    }}
                                >
                                    <div className="whitespace-pre-wrap break-words">
                                        {book.description}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Buttons */}
                            <div className="flex space-x-3 pt-2 pl-1">
                                <Button
                                    className="bg-gray-300 text-gray-700 px-4 py-2 text-sm hover:bg-gray-400 transition-colors"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className={`flex-1 text-white text-sm py-2 transition-all duration-200 ${book.status === 'Reserved'
                                        ? 'bg-yellow-500 hover:bg-yellow-600'
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                                        }`}
                                    onClick={(e) => handleContactSeller(e, book)}
                                >
                                    {book.status === 'Reserved'
                                        ? 'Reserved - Contact Seller'
                                        : 'Contact to Seller'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:grid lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Left Column - Images */}
                        <div className="space-y-4 order-1 lg:order-1">
                            <div className="relative h-full sm:h-full sm:max-h-90 rounded-lg overflow-hidden">
                                <div className="h-full w-full bg-white rounded-lg overflow-hidden">
                                    <img
                                        src={getImageSrc(book.pictures?.[selectedImageIndex] || book.pictures?.[0] || "")}
                                        alt={book.title}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-book.jpg';
                                        }}
                                    />
                                </div>

                                {book.pictures && book.pictures.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            aria-label="Previous image"
                                            onClick={handlePrev}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 focus:outline-none"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        <button
                                            type="button"
                                            aria-label="Next image"
                                            onClick={handleNext}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 focus:outline-none"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Book Details */}
                        <div className="space-y-4 sm:space-y-6 order-2 lg:order-2 w-full lg:w-80">
                            <div>
                                <h1 className="text-2xl sm:text-1xl font-bold text-gray-900 mb-2">{book.title}</h1>
                                {book.author && (
                                    <p className="text-lg sm:text-xl text-gray-600">by {book.author}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Price:</p>
                                    <p className="text-xl sm:text-2xl font-bold text-green-600">{book.price}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Condition:</p>
                                    <p className="font-medium text-gray-900">{book.condition}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Department:</p>
                                    <p className="font-medium text-gray-900">{book.department}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Seller:</p>
                                    <p className="font-medium text-gray-900">{book.seller?.name}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-2">Description:</p>
                                <div
                                    className="bg-white border p-1 pl-2  rounded-lg text-gray-700 leading-relaxed  overflow-y-auto overscroll-contain h-10 sm:h-20 md:h-20 lg:h-15"
                                    style={{
                                        WebkitOverflowScrolling: 'touch',
                                        overflowX: 'hidden',
                                        touchAction: 'auto',
                                    }}
                                >
                                    <div className="whitespace-pre-wrap break-words">
                                        {book.description}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-0">
                                <Button
                                    className="bg-gray-300 text-gray-700 px-4 sm:px-6 hover:bg-gray-400 transition-colors order-2 sm:order-1"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className={`flex-1 text-white transition-all duration-200 order-1 sm:order-2 ${book.status === 'Reserved'
                                        ? 'bg-yellow-500 hover:bg-yellow-600'
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                                        }`}
                                    onClick={(e) => handleContactSeller(e, book)}
                                >
                                    {book.status === 'Reserved'
                                        ? 'Reserved - Contact Seller'
                                        : 'Contact Seller'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                 <InfoModal
                        open={selfChatOpen}
                        onClose={() => setSelfChatOpen(false)}
                        title="Notice"
                        message="You cannot chat with yourself."
                      />
            </DialogContent>
        </Dialog>
    );
};

export default BookDetailsModal;