
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(request) {
  await dbConnect();
  
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    return Response.json(users);
  } catch (error) {
    console.error('GET /api/users error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}