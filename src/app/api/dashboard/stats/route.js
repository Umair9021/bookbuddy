import dbConnect from '@/lib/db';  
import Book from '@/models/books';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    
    if (!sellerId) {
      return Response.json(
        { error: 'sellerId parameter is required' },
        { status: 400 }
      );
    }

    const [totalBooks, soldBooks] = await Promise.all([
      Book.countDocuments({ seller: sellerId }),
      Book.find({ seller: sellerId, isSold: true })
    ]);

    const totalSales = soldBooks.reduce((sum, book) => sum + book.price, 0);

    return Response.json({
      totalBooks,
      totalSales: `$${totalSales.toFixed(2)}`,
      activeOrders: 0,
      profileViews: 0
    });
  } catch (error) {
    console.error('Database error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}