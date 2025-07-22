
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  await dbConnect();
  
  try {
    const data = await request.json();
    
    // Check if user already exists
    const existingUser = await User.findById(data._id);
    if (existingUser) {
      return Response.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }
    
    // Create new user with default values
    const newUser = {
      _id: data._id,
      name: data.name || 'New User',
      email: data.email,
      username: data.username || data._id,
      major: data.major || 'Science',
      collegeName: data.collegeName || 'CTI College',
      address: data.address || '',
      about: data.about || '',
      dp: data.dp || '',
      coverdp: data.coverdp || '',
    };
    
    const user = await User.create(newUser);
    return Response.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}