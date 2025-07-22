
import dbConnect from '@/lib/db';
import Book from '@/models/books';

export async function GET(request, { params }) {
  await dbConnect();
  
  try {
    const { userId } = params;
    
    // Find all books where seller matches the userId
    const books = await Book.find({ seller: userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean(); // Use lean() for better performance
    
    return Response.json(books);
  } catch (error) {
    console.error('Error fetching user books:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Optional: Add POST method to create a new book for the user
export async function POST(request, { params }) {
  await dbConnect();
  
  try {
    const { userId } = params;
    const bookData = await request.json();
    
    // Create new book with the userId as seller
    const newBook = {
      ...bookData,
      seller: userId,
    };
    
    const book = await Book.create(newBook);
    return Response.json(book, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}