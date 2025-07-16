import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ 
      url: uploadResult.secure_url, 
      public_id: uploadResult.public_id 
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');
    
    if (!publicId) {
      return NextResponse.json({ error: 'No publicId provided' }, { status: 400 });
    }

    // Delete from Cloudinary
    const deleteResult = await cloudinary.uploader.destroy(publicId);
    
    if (deleteResult.result === 'ok') {
      return NextResponse.json({ message: 'Image deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

export async function PUT(request) {
    try {
        const { searchParams } = new URL(request.url);
        const bookId = searchParams.get('bookId');
        
        if (!bookId) {
            return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
        }

        const updateData = await request.json();
        const { title, price, description, condition, category, status, pictures, thumbnailIndex } = updateData;

        const updateFields = {};
        
        if (title !== undefined) updateFields.title = title;
        if (price !== undefined) updateFields.price = price;
        if (description !== undefined) updateFields.description = description;
        if (condition !== undefined) updateFields.condition = condition;
        if (category !== undefined) updateFields.category = category;
        if (status !== undefined) updateFields.status = status;
        
        if (pictures !== undefined) {
            updateFields.pictures = pictures;
        }
        if (thumbnailIndex !== undefined) {
            updateFields.thumbnailIndex = thumbnailIndex;
        }

        const result = await db.collection('books').updateOne(
            { _id: new ObjectId(bookId) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        const updatedBook = await db.collection('books').findOne({ _id: new ObjectId(bookId) });
        
        return NextResponse.json(updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
    }
}