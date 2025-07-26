
import dbConnect from '@/lib/db';
import Book from '@/models/books';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const filter = searchParams.get('filter');

    const query = {};

    if (sellerId) query.seller = sellerId;
    if (filter) query.category = filter;

    const books = await Book.find(query).sort({ createdAt: -1 });

    return Response.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    if (!data.title || !data.price || !data.sellerId) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newBook = await Book.create({
      title: data.title,
      price: parseFloat(data.price),
      description: data.description || '',
      category: data.category || 'First Year',
      condition: data.condition || 'New',
      pictures: data.pictures || [],
      seller: data.sellerId,
      isSold: false
    });

    return Response.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');
    const data = await request.json();

    if (!bookId) {
      return Response.json(
        { error: 'bookId parameter is required' },
        { status: 400 }
      );
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, data, { new: true });

    if (!updatedBook) {
      return Response.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return Response.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');

    if (!bookId) {
      return Response.json(
        { error: 'bookId parameter is required' },
        { status: 400 }
      );
    }

    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return Response.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return Response.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}