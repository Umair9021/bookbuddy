
import React from 'react';
import { BookPlus,Edit,Trash2 } from 'lucide-react';
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


const MyBook = ({
    filteredBooks, 
    setActiveTab, 
    handleEditBook, 
    handleDeleteBook,
    editDialogOpen,
    setEditDialogOpen,
    bookForm,
    updatehandle,
    handleFormChange
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
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
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
                                        <div className="font-small text-gray-900">{book.category}</div>
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
                                                                value={bookForm.title}
                                                                onChange={(e) => handleFormChange('title', e.target.value)}
                                                                className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <label htmlFor="edit-price" className="text-right">Price</label>
                                                            <input
                                                                id="edit-price"
                                                                value={bookForm.price}
                                                                onChange={(e) => handleFormChange('price', e.target.value)}
                                                                className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <label htmlFor="edit-price" className="text-right">Status</label>
                                                            <select
                                                                id="edit-status"
                                                                value={bookForm.status}
                                                                onChange={(e) => handleFormChange('status', e.target.value)}
                                                                className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg"
                                                            >
                                                            <option value="Available">Available</option>
                                                            <option value="Reserved">Reserved</option>
                                                            <option value="Sold">Sold</option>
                                                            </select>
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