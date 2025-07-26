
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  await dbConnect();
  
  try {
    const data = await request.json();
    
    if (!data.name || !data.email) {
      return Response.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    if (data._id) {
      const existingUser = await User.findById(data._id);
      if (existingUser) {
        return Response.json(
          { error: 'User with this ID already exists' },
          { status: 409 }
        );
      }
    }
    
    const existingEmailUser = await User.findOne({ email: data.email.trim().toLowerCase() });
    if (existingEmailUser) {
      return Response.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    if (data.username) {
      const existingUsername = await User.findOne({ username: data.username.trim() });
      if (existingUsername) {
        return Response.json(
          { error: 'Username already taken' },
          { status: 409 }
        );
      }
    }
    
    const newUser = {
      ...(data._id && { _id: data._id }), 
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      username: data.username ? data.username.trim() : (data._id || ''),
      major: data.major || 'Science',
      collegeName: data.collegeName || 'CTI College',
      address: data.address || '',
      about: data.about || '',
      dp: data.dp || '',
      coverdp: data.coverdp || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const user = await User.create(newUser);
    return Response.json(user, { status: 201 });
    
  } catch (error) {
    console.error('POST /api/users error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return Response.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return Response.json(
        { error: `${field} already exists` },
        { status: 409 }
      );
    }
    
    return Response.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

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