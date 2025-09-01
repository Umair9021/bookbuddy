import dbConnect from '@/lib/db';
import User from '@/models/User';
import Book from '@/models/books';
import Report from '@/models/Report';
import Warning from '@/models/Warning';

export async function GET() {
  try {
    await dbConnect();

    // Get recent activities (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [newUsers, newBooks, reports, warnings] = await Promise.all([
      User.find({ createdAt: { $gte: thirtyDaysAgo } })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Book.find({ createdAt: { $gte: thirtyDaysAgo } })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('seller', 'name')
        .lean(),
      Report.find({ createdAt: { $gte: thirtyDaysAgo } })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('reporterName', 'reportedContent')
        .lean(),
      Warning.find({ createdAt: { $gte: thirtyDaysAgo } })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('userId', 'name')
        .lean()
    ]);

    // Format activities for the timeline
    const activities = [
      ...newUsers.map(user => ({
        type: 'user',
        action: 'New user registered',
        details: `${user.name || user.email} joined`,
        timestamp: user.createdAt
      })),
      ...newBooks.map(book => ({
        type: 'book',
        action: 'New book listed',
        details: `${book.title} by ${book.seller?.name}`,
        timestamp: book.createdAt
      })),
      ...reports.map(report => ({
        type: 'report',
        action: 'New report submitted',
        details: `${report.reporterName} reported ${report.reportedContent}`,
        timestamp: report.createdAt
      })),
      ...warnings.map(warning => ({
        type: 'warning',
        action: 'Warning issued',
        details: `Admin warned ${warning.userId?.name} (${warning.severity})`,
        timestamp: warning.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 20);

    return Response.json(activities);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}