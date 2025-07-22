import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(request, { params }) {
  await dbConnect();
  
  try {
    const user = await User.findById(params.id);
    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    return Response.json(user);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    // Parse request body
    let data;
    try {
      data = await request.json();
    } catch (parseError) {
      return Response.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!data.name || !data.email) {
      return Response.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Check if username is taken by another user
    if (data.username) {
      const existingUser = await User.findOne({ 
        username: data.username, 
        _id: { $ne: params.id } 
      });
      if (existingUser) {
        return Response.json(
          { error: 'Username already taken' },
          { status: 409 }
        );
      }
    }
    
    // Check if email is taken by another user
    const existingEmailUser = await User.findOne({ 
      email: data.email, 
      _id: { $ne: params.id } 
    });
    if (existingEmailUser) {
      return Response.json(
        { error: 'Email already taken' },
        { status: 409 }
      );
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      params.id,
      {
        name: data.name.trim(),
        username: data.username ? data.username.trim() : data.username,
        email: data.email.trim().toLowerCase(),
        major: data.major || 'Science',
        collegeName: data.collegeName || 'CTI College',
        address: data.address || '',
        about: data.about || '',
        dp: data.dp || '',
        coverdp: data.coverdp || '',
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return Response.json(user);
    
  } catch (error) {
    console.error('PUT /api/users/[id] error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return Response.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return Response.json(
        { error: `${field} already exists` },
        { status: 409 }
      );
    }
    
    // Handle database connection errors
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return Response.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }
    
    // Generic error handler
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();
  const data = await request.json();
  
  try {
    // Validate required fields
    if (!data.name || !data.email) {
      return Response.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Check if user already exists by email
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return Response.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Check if username is taken
    if (data.username) {
      const existingUsername = await User.findOne({ username: data.username });
      if (existingUsername) {
        return Response.json(
          { error: 'Username already taken' },
          { status: 409 }
        );
      }
    }
    
    // Create user with proper defaults
    const newUser = {
      _id: data._id,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      username: data.username ? data.username.trim() : data._id,
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
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return Response.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return Response.json(
        { error: `${field} already exists` },
        { status: 409 }
      );
    }
    
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  
  try {
    const user = await User.findByIdAndDelete(params.id);
    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    return Response.json({ message: 'User deleted successfully' });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}