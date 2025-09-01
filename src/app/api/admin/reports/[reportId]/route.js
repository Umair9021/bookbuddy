import dbConnect from '@/lib/db';
import Report from '@/models/Report';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { reportId } = await params;
    const { status, adminNote, adminId, actionTaken, resolutionNote } = await request.json();

    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['open', 'investigating', 'action_taken', 'resolved', 'dismissed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      );
    }

    const report = await Report.findById(reportId);
    
    if (!report) {
      return NextResponse.json(
        { message: 'Report not found' },
        { status: 404 }
      );
    }

    // Update the report
    report.status = status;
    
    if (status === 'resolved') {
      report.resolvedAt = new Date();
      if (resolutionNote) {
        report.resolutionNote = resolutionNote;
      }
    }
    
    if (actionTaken) {
      report.actionTaken = actionTaken;
    }

    // Add admin note if provided
    if (adminNote && adminId) {
      report.adminNotes.push({
        note: adminNote,
        addedBy: adminId,
        addedAt: new Date()
      });
    }

    await report.save();

    // Populate the updated report before sending response
    const updatedReport = await Report.findById(reportId)
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email')
      .populate('reportedBook', 'title price');

    return NextResponse.json({ 
      message: 'Report updated successfully',
      report: updatedReport 
    });

  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { 
        message: 'Failed to update report',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { reportId } = params;

    const report = await Report.findById(reportId)
      .populate('reporter', 'name email user_metadata')
      .populate('reportedUser', 'name email user_metadata')
      .populate('reportedBook', 'title price department condition');

    if (!report) {
      return NextResponse.json(
        { message: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ report });

  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch report',
        error: error.message 
      },
      { status: 500 }
    );
  }
}