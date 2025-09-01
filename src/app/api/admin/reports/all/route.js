import dbConnect from '@/lib/db';
import Report from '@/models/Report';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    const reports = await Report.find({})
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email')
      .populate('reportedBook', 'title price')
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      reports,
      count: reports.length 
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch reports',
        error: error.message 
      },
      { status: 500 }
    );
  }
}