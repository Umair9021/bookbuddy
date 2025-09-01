
import React from 'react';
import { BookPlus, Edit, Trash2 } from 'lucide-react';
import UpdateBook from './UpdateBook';
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
    DialogTrigger,
    DialogDescription,
    DialogTitle,
    DialogHeader
} from '@/components/ui/dialog';


const MyBook = ({
    filteredBooks,
    setActiveTab,
    handleEditBook,
    handleDeleteBook,
    editDialogOpen,
    setEditDialogOpen,
    bookForm,
    updatehandle,
    handleFormChange,
    handleFileUpload,
    setThumbnail,
    removeImage,
}) => {

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
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map((book) => (
                                <tr key={book._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                        <div className="font-medium text-gray-900">{book.title}</div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="font-small text-gray-900">{book.department}</div>
                                    </td>
                                    <td className="py-4 px-4 text-gray-600">{book.price}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${book.status === 'Available' ? 'bg-green-100 text-green-800' :
                                            book.status === 'Sold' ? 'bg-blue-100 text-blue-800 md:ml-2 md:px-3' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {book.status}
                                        </span>
                                    </td>
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
                                                <DialogContent className="w-full sm:max-w-4xl h-full overflow-y-auto">
                                                    <DialogHeader className="sr-only">
                                                        <DialogTitle>Edit Book</DialogTitle>
                                                        <DialogDescription>
                                                            Update your book listing information
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <UpdateBook
                                                        bookForm={bookForm}
                                                        updatehandle={updatehandle}
                                                        handleFormChange={handleFormChange}
                                                        handleFileUpload={handleFileUpload}
                                                        setThumbnail={setThumbnail}
                                                        removeImage={removeImage}
                                                    />
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
                                                            onClick={() => handleDeleteBook(book._id)}
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
}

export default MyBook;