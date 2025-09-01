import dbConnect from '@/lib/db';
import Report from '@/models/Report';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    const stats = await Report.getReportStats();
    
    const totalReports = await Report.countDocuments();
    const openReports = await Report.countDocuments({ status: { $in: ['open', 'investigating'] } });
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });
    const highPriorityReports = await Report.countDocuments({ priority: { $in: ['high', 'critical'] } });

    return NextResponse.json({
      totalReports,
      openReports,
      resolvedReports,
      highPriorityReports,
      ...stats
    });

  } catch (error) {
    console.error('Error fetching report stats:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch report statistics',
        error: error.message 
      },
      { status: 500 }
    );
  }
}