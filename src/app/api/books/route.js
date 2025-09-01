
import dbConnect from '@/lib/db';
import Book from '@/models/books';
import cloudinary from '@/lib/cloudinary';
import User from '@/models/User';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const filter = searchParams.get('filter');

    const query = {};

    if (sellerId) query.seller = sellerId;
    if (filter) query.department = filter;

    const books = await Book.find(query)
      .select('+price') 
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return Response.json({ error: "Book ID is required" }, { status: 400 });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return Response.json({ error: "Book not found" }, { status: 404 });
    }

    // Delete all associated Cloudinary images
    if (book.pictures?.length) {
      await Promise.all(
        book.pictures.map(async (pic) => {
          try {
            await cloudinary.uploader.destroy(pic.public_id);
            console.log(`🗑 Deleted from Cloudinary: ${pic.public_id}`);
          } catch (err) {
            console.error(`❌ Failed to delete ${pic.public_id}:`, err);
          }
        })
      );
    }

    await book.deleteOne();

    return Response.json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
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
      department: data.category || 'First Year',
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

function extractPublicId(url) {
  try {
    const parts = url.split('/');
    const file = parts[parts.length - 1];
    return file.split('.')[0]; 
  } catch {
    return null;
  }
}

export async function PUT(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");
    const body = await request.json();

    if (!bookId) {
      return Response.json({ error: "Book ID is required" }, { status: 400 });
    }

    // 1. Find the existing book
    const oldBook = await Book.findById(bookId);
    if (!oldBook) {
      return Response.json({ error: "Book not found" }, { status: 404 });
    }

    // 2. Normalize pictures (convert strings → objects)
    const newPictures = (body.pictures || []).map((pic) => {
      if (typeof pic === "string") {
        return {
          url: pic,
          public_id: extractPublicId(pic) || undefined,
        };
      }
      return pic; 
    });

    // 3. Find removed images
    const removedImages = oldBook.pictures.filter(
      (oldPic) =>
        !newPictures.some((newPic) => newPic.public_id === oldPic.public_id)
    );

    // 4. Delete removed images from Cloudinary
    if (removedImages.length) {
      await Promise.all(
        removedImages.map(async (pic) => {
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
    console.error("Error updating book:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
