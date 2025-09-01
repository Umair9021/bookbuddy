import dbConnect from '@/lib/db';
import Book from '@/models/books';
import cloudinary from '@/lib/cloudinary';

// GET all books with admin filters
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const department = searchParams.get('department');
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');

    const query = {};

    if (status) query.status = status;
    if (department) query.department = department;
    if (userId) query.seller = userId;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const books = await Book.find(query)
    .select('title price status isHidden hiddenReason createdAt seller pictures')
      .populate('seller', 'name email user_metadata _id')
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

export async function PATCH(request) {
  try {
    await dbConnect();
    const { bookId, isHidden, hiddenReason } = await request.json();

    const book = await Book.findByIdAndUpdate(
      bookId,
      { isHidden, hiddenReason: isHidden ? hiddenReason : null },
      { new: true }
    );

    if (!book) {
      return Response.json({ error: 'Book not found' }, { status: 404 });
    }

    return Response.json(book, { status: 200 });
  } catch (error) {
    console.error('Error updating book visibility:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
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

    // For visibility updates (hide/show book)
    if (body.hasOwnProperty('isHidden')) {
      const updateData = {
        isHidden: body.isHidden,
      };
      
      // If hiding the book, store the reason
      if (body.isHidden && body.hiddenReason) {
        updateData.hiddenReason = body.hiddenReason;
      }
      
      // If showing the book, clear the reason
      if (!body.isHidden) {
        updateData.hiddenReason = '';
      }

      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        updateData,
        { new: true }
      );
      
      if (!updatedBook) {
        return Response.json({ error: "Book not found" }, { status: 404 });
      }
      
      return Response.json(updatedBook);
    }

    // For status-only updates (Available, sold, reserved)
    if (body.status && !body.hasOwnProperty('isHidden')) {
      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        { status: body.status },
        { new: true }
      );
      
      if (!updatedBook) {
        return Response.json({ error: "Book not found" }, { status: 404 });
      }
      
      return Response.json(updatedBook);
    }

    // Full book update
    const oldBook = await Book.findById(bookId);
    if (!oldBook) {
      return Response.json({ error: "Book not found" }, { status: 404 });
    }

    const newPictures = (body.pictures || []).map((pic) => {
      if (typeof pic === "string") {
        return {
          url: pic,
          public_id: extractPublicId(pic) || undefined,
        };
      }
      return pic;
    });

    const removedImages = oldBook.pictures.filter(
      (oldPic) =>
        !newPictures.some((newPic) => newPic.public_id === oldPic.public_id)
    );

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

    // Prepare update data for full update
    const updateData = {
      title: body.title,
      price: parseFloat(body.price),
      description: body.description,
      department: body.department,
      condition: body.condition,
      status: body.status,
      pictures: newPictures
    };

    // Handle visibility fields if provided
    if (body.hasOwnProperty('isHidden')) {
      updateData.isHidden = body.isHidden;
      if (body.isHidden && body.hiddenReason) {
        updateData.hiddenReason = body.hiddenReason;
      } else if (!body.isHidden) {
        updateData.hiddenReason = '';
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updateData,
      { new: true }
    );

    return Response.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
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