import dbConnect from '@/lib/db';
import Warning from '@/models/Warning';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 15; 
    const page = parseInt(searchParams.get("page")) || 1;

    const query = {};

    const skip = (page - 1) * limit;

    const warnings = await Warning.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('userId', 'email username name isSuspended') 
      .populate('bookId', 'title price')
      .lean(); 

    const totalWarnings = await Warning.countDocuments(query);
    const totalPages = Math.ceil(totalWarnings / limit);

    return NextResponse.json({
      warnings,
      pagination: {
        currentPage: page,
        totalPages,
        totalWarnings,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching all warnings:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

