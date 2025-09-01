import dbConnect from '@/lib/db';
import User from '@/models/User';
import Book from '@/models/books';
import Report from '@/models/Report';

export async function GET() {
  try {
    await dbConnect();

    const [totalUsers, activeUsers, totalBooks, openReports] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isSuspended: false}),
      Book.countDocuments(),
      Report.countDocuments({ status: 'open' })
    ]);

    // Get recent books (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentBooks = await Book.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get recent users (last 7 days)
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    return Response.json({
      totalUsers,
      activeUsers,
      totalBooks,
      openReports,
      recentBooks,
      recentUsers
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}