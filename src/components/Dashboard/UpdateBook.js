'use client';
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookPlus, Upload, Star, X, ImageIcon, Loader2 } from 'lucide-react';
import getImageSrc from '@/utils/getImageSrc';

const UpdateBook = ({
    bookForm,
    updatehandle,
    handleFormChange,
}) => {
    const fileInputRef = useRef(null);
    const [uploadingImages, setUploadingImages] = useState(false);

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        if (!files.length) {
            console.log('No files selected');
            return;
        }

        if (bookForm.images.length + files.length > 3) {
            alert('Maximum 3 images allowed');
            return;
        }

        setUploadingImages(true);
        const uploadedImages = [];

        try {
            for (const file of files) {
                if (!file.type.startsWith('image/')) {
                    throw new Error(`${file.name} is not an image file`);
                }

                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Upload error response:', errorText);
                    throw new Error(`Upload failed for ${file.name}: ${response.status} - ${errorText}`);
                }

                const result = await response.json();

                uploadedImages.push({
                    file: file,
                    url: result.url,
                    publicId: result.public_id
                });
            }

            const newImages = [...bookForm.images, ...uploadedImages];
            handleFormChange('images', newImages);


        } catch (error) {
            console.error('Upload error:', error);
            alert(`Error uploading images: ${error.message}`);
        } finally {
            setUploadingImages(false);
        }
    };

    const handleRemoveImage = async (index) => {
        const imageToRemove = bookForm.images[index];

        if (imageToRemove.publicId && bookForm.images.length > 1) {
            try {
                const response = await fetch(`/api/upload?publicId=${imageToRemove.publicId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    console.error('Failed to delete image from Cloudinary');
                }
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }

        const newImages = bookForm.images.filter((_, i) => i !== index);

        let newThumbnailIndex = bookForm.thumbnailIndex;
        if (index === bookForm.thumbnailIndex) {
            newThumbnailIndex = 0; 
        } else if (index < bookForm.thumbnailIndex) {
            newThumbnailIndex = bookForm.thumbnailIndex - 1;
        }

        handleFormChange('images', newImages);
       
        handleFormChange('thumbnailIndex', Math.max(0, Math.min(newThumbnailIndex, newImages.length - 1)));
    };

    const handleSetThumbnail = (index) => {
        if (bookForm.images[index]) {
            handleFormChange('thumbnailIndex', index);
        }
    };

    const isSlotDisabled = (index) => {
        if (index === 0) return false;
        if (index === 1) return false;
        if (index === 2) return !bookForm.images[1]; 
        return false;
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
            <div className="max-w-6xl mx-auto">
                <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <BookPlus className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Update Your Book</h2>
                                <p className="text-indigo-100 mt-1">Edit your book listing</p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="space-y-6">

                            {/* Title and Price Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        Book Title
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={bookForm.title}
                                        onChange={(e) => handleFormChange('title', e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200"
                                        placeholder="What's the title of your book?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        Price
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                                        <input
                                            type="number"
                                            value={bookForm.price}
                                            onChange={(e) => handleFormChange('price', e.target.value)}
                                            className="w-full pl-7 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Condition and Category Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Condition</label>
                                    <select
                                        value={bookForm.condition}
                                        onChange={(e) => handleFormChange('condition', e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 bg-white"
                                    >
                                        <option value="">Select condition</option>
                                        <option>New</option>
                                        <option>Like New</option>
                                        <option>Good</option>
                                        <option>Fair</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Status</label>
                                    <select
                                        value={bookForm.status}
                                        onChange={(e) => handleFormChange('status', e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 bg-white"
                                    >
                                        <option value="">Select Status</option>
                                        <option>Available</option>
                                        <option>Reserved</option>
                                        <option>Sold</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Category</label>
                                    <select
                                        value={bookForm.category}
                                        onChange={(e) => handleFormChange('category', e.target.value)}
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 bg-white"
                                    >
                                        <option value="">Select Category</option>
                                        <option>First Year</option>
                                        <option>Second Year</option>
                                        <option>Third Year</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
                                <textarea
                                    rows="3"
                                    value={bookForm.description}
                                    onChange={(e) => handleFormChange('description', e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 resize-none"
                                    placeholder="Tell buyers about your book's condition, edition, and what makes it special..."
                                />
                            </div>

                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Book Images (Up to 3)
                                    <span className="text-gray-500 font-normal ml-2">- Click star to set thumbnail</span>
                                </label>

                                {uploadingImages && (
                                    <div className="flex items-center space-x-2 mb-4 p-3 bg-blue-50 rounded-lg">
                                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                        <span className="text-blue-700">Uploading images...</span>
                                    </div>
                                )}

                                {bookForm?.images && bookForm.images.length === 0 ? (
                                    <div
                                        className="border-2 border-dashed border-indigo-200 rounded-lg p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-300 cursor-pointer group"
                                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                    >
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <Upload className="h-12 w-12 text-indigo-300 mx-auto group-hover:text-indigo-500 transition-all duration-300" />
                                                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                                    Max 3
                                                </div>
                                            </div>
                                            <div className="text-gray-700">
                                                <p className="font-semibold">Drop your images here</p>
                                                <p className="text-gray-500 text-sm mt-1">PNG, JPG up to 10MB each</p>
                                            </div>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploadingImages}
                                        />
                                    </div>
                                ) : bookForm?.images && bookForm.images.length > 0 && (
                                    <div className="space-y-4">
                                        {/* Image Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {[0, 1, 2].map((index) => {
                                                const isDisabled = isSlotDisabled(index);
                                                const hasImage = bookForm.images[index];
                                                return (
                                                    <div key={`image-slot-${index}`} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-semibold text-gray-700 text-sm">
                                                                {index === 0 ? 'Thumbnail' : `Image ${index + 1}`}
                                                                {bookForm.thumbnailIndex === index && hasImage && (
                                                                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                                                        Thumbnail
                                                                    </span>
                                                                )}
                                                            </h4>
                                                            {hasImage && !isDisabled && (
                                                                <button
                                                                    onClick={() => handleSetThumbnail(index)}
                                                                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all ${bookForm.thumbnailIndex === index
                                                                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                                                        : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
                                                                        }`}
                                                                >
                                                                    <Star className={`h-3 w-3 ${bookForm.thumbnailIndex === index ? 'fill-current' : ''}`} />
                                                                    <span>{bookForm.thumbnailIndex === index ? 'Active' : 'Set'}</span>
                                                                </button>
                                                            )}
                                                        </div>

                                                        {bookForm.images[index] ? (
                                                            <div className="relative group">
                                                                <img
                                                                    src={getImageSrc(bookForm.images[index])}
                                                                    alt={`Upload ${index + 1}`}
                                                                    className={`w-full h-32 object-cover rounded-lg border-2 transition-all ${bookForm.thumbnailIndex === index
                                                                        ? 'border-yellow-400 shadow-md'
                                                                        : 'border-gray-200 group-hover:border-gray-300'
                                                                        }`}
                                                                />
                                                                <button
                                                                    onClick={() => handleRemoveImage(index)}
                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                                {bookForm.thumbnailIndex === index && (
                                                                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                                                        <Star className="h-2 w-2 fill-current" />
                                                                        <span>Thumb</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className={`h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${isDisabled
                                                                        ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                                                                        : 'border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500'
                                                                    }`}
                                                                onClick={() => !isDisabled && fileInputRef.current && fileInputRef.current.click()}
                                                            >
                                                                <ImageIcon className="h-6 w-6 mb-1" />
                                                                <span className="text-xs">
                                                                    {isDisabled ? 'Fill Previous' : 'Add Image'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Add More Button */}
                                        {bookForm.images.length < 3 && (
                                            <button
                                                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                                className="w-full py-2 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 font-medium text-sm"
                                                disabled={uploadingImages}
                                            >
                                                {uploadingImages ? 'Uploading...' : `+ Add More Images (${bookForm.images.length}/3)`}
                                            </button>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploadingImages}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={updatehandle}
                                    disabled={uploadingImages}
                                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploadingImages ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <BookPlus className="h-4 w-4" />
                                            <span>Update Book</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default UpdateBook;