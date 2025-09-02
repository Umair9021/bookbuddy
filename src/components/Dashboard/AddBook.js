// 'use client';
// import React, { useState } from 'react';

// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { BookPlus, Upload, Star, X, ImageIcon, Loader2 } from 'lucide-react';
// import getImageSrc from '@/utils/getImageSrc';
// const AddBook = ({
//     bookForm, handleFormChange, handleFileUpload, setThumbnail, removeImage, handleSubmitBook, uploadingImages
// }) => {

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
//             <div className="max-w-4xl mx-auto">
//                 <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
//                     <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
//                         <div className="flex items-center space-x-3">
//                             <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
//                                 <BookPlus className="h-8 w-8" />
//                             </div>
//                             <div>
//                                 <h2 className="text-3xl font-bold">List Your Book</h2>
//                                 <p className="text-indigo-100 mt-2">Create an amazing listing that sells</p>
//                             </div>
//                         </div>
//                     </CardHeader>

//                     <CardContent className="p-8">
//                         <div className="space-y-8">

//                             {/* Title and Price Row */}
//                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                                 <div className="lg:col-span-2">
//                                     <label className="block text-sm font-semibold text-gray-800 mb-3">
//                                         Book Title
//                                         <span className="text-red-500 ml-1">*</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={bookForm.title}
//                                         onChange={(e) => handleFormChange('title', e.target.value)}
//                                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-lg"
//                                         placeholder="What's the title of your book?"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-800 mb-3">
//                                         Price
//                                         <span className="text-red-500 ml-1">*</span>
//                                     </label>
//                                     <div className="relative">
//                                         <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">$</span>
//                                         <input
//                                             type="number"
//                                             value={bookForm.price}
//                                             onChange={(e) => handleFormChange('price', e.target.value)}
//                                             className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-lg"
//                                             placeholder="0.00"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Condition and department Row */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-800 mb-3">Condition</label>
//                                     <select
//                                         value={bookForm.condition}
//                                         onChange={(e) => handleFormChange('condition', e.target.value)}
//                                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-lg bg-white"
//                                     >
//                                         <option value="">Select condition</option>
//                                         <option>New</option>
//                                         <option>Like New</option>
//                                         <option>Good</option>
//                                         <option>Fair</option>
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-800 mb-3">Department</label>
//                                     <select
//                                         value={bookForm.department}
//                                         onChange={(e) => handleFormChange('department', e.target.value)}
//                                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-lg bg-white"
//                                     >
//                                         <option value="">Select department</option>
//                                         <option>First Year</option>
//                                         <option>Second Year</option>
//                                         <option>Third Year</option>
//                                     </select>
//                                 </div>
//                             </div>

//                             {/* Description */}
//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-800 mb-3">Description</label>
//                                 <textarea
//                                     rows="4"
//                                     value={bookForm.description}
//                                     onChange={(e) => handleFormChange('description', e.target.value)}
//                                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-lg resize-none"
//                                     placeholder="Tell buyers about your book's condition, edition, and what makes it special..."
//                                 />
//                             </div>

//                             {/* Image Upload Section */}
//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-800 mb-3">
//                                     Book Images (Up to 3)
//                                     <span className="text-gray-500 font-normal ml-2">- Choose your thumbnail</span>
//                                 </label>
//                                 {uploadingImages && (
//                                     <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
//                                         <div className="flex items-center space-x-3">
//                                             <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
//                                             <span className="text-blue-800 font-medium">Uploading images...</span>
//                                         </div>
//                                     </div>
//                                 )}
//                                 {bookForm.images.length === 0 ? (
//                                     <div
//                                         className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${uploadingImages
//                                                 ? 'border-blue-300 bg-blue-50/50 cursor-not-allowed'
//                                                 : 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50'
//                                             }`}
//                                         onClick={() => !uploadingImages && document.getElementById('file-upload').click()}
//                                     >
//                                         <div className="space-y-4">
//                                             <div className="relative">
//                                                 {uploadingImages ? (
//                                                     <Loader2 className="h-16 w-16 text-blue-400 mx-auto animate-spin" />
//                                                 ) : (
//                                                     <>
//                                                         <Upload className="h-16 w-16 text-indigo-300 mx-auto group-hover:text-indigo-500 group-hover:scale-110 transition-all duration-300" />
//                                                         <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
//                                                             Max 3
//                                                         </div>
//                                                     </>
//                                                 )}
//                                             </div>
//                                             <div className="text-gray-700">
//                                                 <p className="font-semibold text-lg">
//                                                     {uploadingImages ? 'Uploading images...' : 'Drop your images here'}
//                                                 </p>
//                                                 <p className="text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
//                                             </div>
//                                         </div>
//                                         <input
//                                             id="file-upload"
//                                             type="file"
//                                             multiple
//                                             accept="image/*"
//                                             onChange={handleFileUpload}
//                                             className="hidden"
//                                             disabled={uploadingImages}
//                                         />
//                                     </div>
//                                 ) : (
//                                     <div className="space-y-6">
//                                         {/* Image Grid */}
//                                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                             {[0, 1, 2].map((index) => (
//                                                 <div key={`image-slot-${index}`} className="space-y-3">
//                                                     <div className="flex items-center justify-between">
//                                                         <h4 className="font-semibold text-gray-700">
//                                                             {index === 0 ? 'Thumbnail' : `Image ${index + 1}`}
//                                                         </h4>
//                                                         {bookForm.images[index] && (
//                                                             <button
//                                                                 onClick={() => setThumbnail(index)}
//                                                                 className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-all ${bookForm.thumbnailIndex === index
//                                                                     ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
//                                                                     : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
//                                                                     }`}
//                                                             >
//                                                                 <Star className={`h-3 w-3 ${bookForm.thumbnailIndex === index ? 'fill-current' : ''}`} />
//                                                                 <span>{bookForm.thumbnailIndex === index ? 'Thumbnail' : 'Set as thumbnail'}</span>
//                                                             </button>
//                                                         )}
//                                                     </div>

//                                                     {bookForm.images[index] ? (
//                                                         <div className="relative group">
//                                                             <img
//                                                                 src={getImageSrc(bookForm.images[index])}
//                                                                 alt={`Upload ${index + 1}`}
//                                                                 className={`w-full h-48 object-cover rounded-xl border-3 transition-all ${bookForm.thumbnailIndex === index
//                                                                     ? 'border-yellow-400 shadow-lg'
//                                                                     : 'border-gray-200 group-hover:border-gray-300'
//                                                                     }`}
//                                                             />
//                                                             <button
//                                                                 onClick={() => removeImage(index)}
//                                                                 className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
//                                                             >
//                                                                 <X className="h-4 w-4" />
//                                                             </button>
//                                                             {bookForm.thumbnailIndex === index && (
//                                                                 <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
//                                                                     <Star className="h-3 w-3 fill-current" />
//                                                                     <span>Thumbnail</span>
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     ) : (
//                                                         <div className={`h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${uploadingImages
//                                                                 ? 'border-blue-300 text-blue-400 bg-blue-50/30 cursor-not-allowed'
//                                                                 : 'border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500'
//                                                             }`}
//                                                             onClick={() => !uploadingImages && document.getElementById('file-upload').click()}
//                                                         >
//                                                             {uploadingImages ? (
//                                                                 <>
//                                                                     <Loader2 className="h-8 w-8 mb-2 animate-spin" />
//                                                                     <span className="text-sm">Uploading...</span>
//                                                                 </>
//                                                             ) : (
//                                                                 <>
//                                                                     <ImageIcon className="h-8 w-8 mb-2" />
//                                                                     <span className="text-sm">Add Image</span>
//                                                                 </>
//                                                             )}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         {/* Add More Button */}
//                                         {bookForm.images.length < 3 && (
//                                             <button
//                                                 onClick={() => document.getElementById('file-upload').click()}
//                                                 className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 font-medium"
//                                             >
//                                                 + Add More Images ({bookForm.images.length}/3)
//                                             </button>
//                                         )}

//                                         <input
//                                             id="file-upload"
//                                             type="file"
//                                             multiple
//                                             accept="image/*"
//                                             onChange={handleFileUpload}
//                                             className="hidden"
//                                         />
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-200">

//                                 <button
//                                     onClick={handleSubmitBook}
//                                     className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-xl"
//                                 >
//                                     <BookPlus className="h-5 w-5" />
//                                     <span>Publish Book</span>
//                                 </button>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// }

// export default AddBook;
'use client';
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookPlus, Upload, Star, X, ImageIcon, Loader2 } from 'lucide-react';
import getImageSrc from '@/utils/getImageSrc';

const AddBook = ({
  bookForm,
  handleFormChange,
  handleFileUpload,
  setThumbnail,
  removeImage,
  handleSubmitBook,
  uploadingImages
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 sm:p-4 lg:p-6">
      <div className="w-full max-w-5xl mx-auto">
        <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sm:p-6 lg:p-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookPlus className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">List Your Book</h2>
                <p className="text-indigo-100 mt-1 sm:mt-2 text-sm sm:text-base">
                  Create an amazing listing that sells
                </p>
              </div>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-8">

              {/* Title + Price */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Book Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bookForm.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-base sm:text-lg"
                    placeholder="What's the title of your book?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base sm:text-lg font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      value={bookForm.price}
                      onChange={(e) => handleFormChange('price', e.target.value)}
                      className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-base sm:text-lg"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Condition + Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Condition</label>
                  <select
                    value={bookForm.condition}
                    onChange={(e) => handleFormChange('condition', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-base sm:text-lg bg-white"
                  >
                    <option value="">Select condition</option>
                    <option>New</option>
                    <option>Like New</option>
                    <option>Good</option>
                    <option>Fair</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Department</label>
                  <select
                    value={bookForm.department}
                    onChange={(e) => handleFormChange('department', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-base sm:text-lg bg-white"
                  >
                    <option value="">Select department</option>
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
                  rows="4"
                  value={bookForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-base sm:text-lg resize-none"
                  placeholder="Tell buyers about your book's condition, edition, and what makes it special..."
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3">
                  Book Images (Up to 3)
                  <span className="text-gray-500 font-normal ml-1 sm:ml-2">- Choose your thumbnail</span>
                </label>

                {/* Uploading state */}
                {uploadingImages && (
                  <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 animate-spin" />
                      <span className="text-blue-800 font-medium text-sm sm:text-base">
                        Uploading images...
                      </span>
                    </div>
                  </div>
                )}

                {/* Upload Box / Image Grid */}
                {bookForm.images.length === 0 ? (
                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer group ${uploadingImages
                      ? 'border-blue-300 bg-blue-50/50 cursor-not-allowed'
                      : 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50'
                      }`}
                    onClick={() => !uploadingImages && document.getElementById('file-upload').click()}
                  >
                    <div className="space-y-3 sm:space-y-4">
                      {uploadingImages ? (
                        <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 text-blue-400 mx-auto animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-12 w-12 sm:h-16 sm:w-16 text-indigo-300 mx-auto group-hover:text-indigo-500 transition-all" />
                          <p className="font-semibold text-gray-700 text-sm sm:text-lg">Drop your images here</p>
                          <p className="text-gray-500 text-xs sm:text-sm">PNG, JPG up to 10MB each</p>
                        </>
                      )}
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingImages}
                    />
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="space-y-2 sm:space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-700 text-sm sm:text-base">
                              {index === 0 ? 'Thumbnail' : `Image ${index + 1}`}
                            </h4>
                            {bookForm.images[index] && (
                              <button
                                onClick={() => setThumbnail(index)}
                                className={`flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-all ${bookForm.thumbnailIndex === index
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
                                src={getImageSrc(bookForm.images[index])}
                                alt={`Upload ${index + 1}`}
                                className={`w-full h-40 sm:h-48 object-cover rounded-xl border-2 transition-all ${bookForm.thumbnailIndex === index
                                  ? 'border-yellow-400 shadow-lg'
                                  : 'border-gray-200 group-hover:border-gray-300'
                                  }`}
                              />
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-red-500 text-white rounded-full p-1.5 sm:p-2 hover:bg-red-600 shadow-lg"
                              >
                                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          ) : (
                            <div
                              className={`h-40 sm:h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer ${uploadingImages
                                ? 'border-blue-300 text-blue-400 bg-blue-50/30 cursor-not-allowed'
                                : 'border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500'
                                }`}
                              onClick={() => !uploadingImages && document.getElementById('file-upload').click()}
                            >
                              {uploadingImages ? (
                                <>
                                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 mb-1 animate-spin" />
                                  <span className="text-xs sm:text-sm">Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 mb-1" />
                                  <span className="text-xs sm:text-sm">Add Image</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {bookForm.images.length < 3 && (
                      <button
                        onClick={() => document.getElementById('file-upload').click()}
                        className="w-full py-2 sm:py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all font-medium text-sm sm:text-base"
                      >
                        + Add More Images ({bookForm.images.length}/3)
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 sm:pt-8 border-t border-gray-200">
                <button
                  onClick={handleSubmitBook}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 font-semibold shadow-lg"
                >
                  <BookPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Publish Book</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddBook;
