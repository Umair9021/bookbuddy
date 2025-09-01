import dbConnect from '@/lib/db';
import User from '@/models/User';
import Book from '@/models/books';

// GET all users with filters
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // Get book counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const bookCount = await Book.countDocuments({ seller: user._id });
        const soldBookCount = await Book.countDocuments({ 
          seller: user._id, 
          status: 'Sold' 
        });
        
        return {
          ...user,
          bookCount,
          soldBookCount
        };
      })
    );

    return Response.json(usersWithStats);
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// UPDATE user status
export async function PUT(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const { status } = await request.json();

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!['active', 'suspended'].includes(status)) {
      return Response.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}