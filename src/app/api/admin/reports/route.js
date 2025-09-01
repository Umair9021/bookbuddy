import dbConnect from '@/lib/db';
import Report from '@/models/Report';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const reason = searchParams.get('reason');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    
    const filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (reason) filter.reason = reason;

    const reports = await Report.find(filter)
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email')
      .populate('reportedBook', 'title price')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments(filter);

    return NextResponse.json({
      reports,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReports: total
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

export async function POST(request) {
  try {
    await dbConnect();

    const {
      reporterEmail,
      reporterName,
      reportedUser,
      reportedBook,
      reportedContent,
      reason,
      details,
      reportType,
      ipAddress,
      userAgent
    } = await request.json();

    // Validation
    if (!reporterEmail || !reporterName || !reason || !details) {
      return NextResponse.json(
        { 
          message: 'Missing required fields: reporterEmail, reporterName, reason, details' 
        },
        { status: 400 }
      );
    }

    const report = new Report({
      reporterEmail,
      reporterName,
      reportedUser,
      reportedBook,
      reportedContent,
      reason,
      details,
      reportType,
      ipAddress,
      userAgent
    });

    await report.save();

    const populatedReport = await Report.findById(report._id)
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email')
      .populate('reportedBook', 'title price');

    return NextResponse.json(
      { 
        message: 'Report created successfully',
        report: populatedReport 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { 
        message: 'Failed to create report',
        error: error.message 
      },
      { status: 500 }
    );
  }
}