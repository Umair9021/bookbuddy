import dbConnect from '@/lib/db';
import Book from '@/models/books';

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
