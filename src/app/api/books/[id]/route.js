// /api/books/[id]/route.js
import dbConnect from '@/lib/db';
import Book from '@/models/books';
import cloudinary from '@/lib/cloudinary';

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const bookId = params.id;
    const body = await request.json();

    if (!bookId) {
      return Response.json({ error: 'Book ID is required' }, { status: 400 });
    }

    // 1. Find the existing book
    const oldBook = await Book.findById(bookId);
    if (!oldBook) {
      return Response.json({ error: 'Book not found' }, { status: 404 });
    }

    // 2. Ensure pictures array exists in body
    const newPictures = body.pictures || [];

    // 3. Find images removed from the update
    const removedImages = oldBook.pictures.filter(
      oldPic =>
        !newPictures.some(newPic => newPic.public_id === oldPic.public_id)
    );

    // 4. Delete removed images from Cloudinary
    if (removedImages.length) {
      await Promise.all(
        removedImages.map(async pic => {
          try {
            await cloudinary.uploader.destroy(pic.public_id);
            console.log(`🗑 Deleted from Cloudinary: ${pic.public_id}`);
          } catch (err) {
            console.error(`❌ Failed to delete ${pic.public_id}:`, err);
          }
        })
      );
    }

    // 5. Update book in DB
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { ...body, pictures: newPictures },
      { new: true }
    );

    return Response.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function GET(req, { params }) {
  try {
    await dbConnect();
    const book = await Book.findById(params.id);

    if (!book) {
      return Response.json({ error: "Book not found" }, { status: 404 });
    }
    return Response.json(book);
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
