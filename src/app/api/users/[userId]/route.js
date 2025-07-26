
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(request, { params }) {
  await dbConnect();
  
  try {
    const user = await User.findById(params.userId);
    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    return Response.json(user);
  } catch (error) {
    console.error('GET /api/users/[userId] error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    let data;
    try {
      data = await request.json();
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return Response.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
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
    
    const existingUser = await User.findById(params.userId);
    
    if (existingUser) {
      const updateData = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        major: data.major !== undefined ? data.major : existingUser.major,
        collegeName: data.collegeName !== undefined ? data.collegeName : existingUser.collegeName,
        address: data.address !== undefined ? data.address : existingUser.address,
        about: data.about !== undefined ? data.about : existingUser.about,
        dp: data.dp !== undefined ? data.dp : existingUser.dp,
        coverdp: data.coverdp !== undefined ? data.coverdp : existingUser.coverdp,
      };
      
      if (data.username !== undefined && data.username !== null) {
        const newUsername = data.username.trim();
        const currentUsername = existingUser.username || '';
        
        if (newUsername !== currentUsername && newUsername !== '') {
          const userWithSameUsername = await User.findOne({ 
            username: newUsername, 
            _id: { $ne: params.userId }
          });
          
          if (userWithSameUsername) {
            return Response.json(
              { error: 'Username already taken' },
              { status: 409 }
            );
          }
        }
        updateData.username = newUsername;
      }
      
      const newEmail = data.email.trim().toLowerCase();
      const currentEmail = existingUser.email ? existingUser.email.toLowerCase() : '';
      
      if (newEmail !== currentEmail) {
        const userWithSameEmail = await User.findOne({ 
          email: newEmail, 
          _id: { $ne: params.userId }
        });
        
        if (userWithSameEmail) {
          return Response.json(
            { error: 'Email already taken' },
            { status: 409 }
          );
        }
      }
      const updatedUser = await User.findByIdAndUpdate(
        params.userId,
        updateData,
        { new: true, runValidators: true }
      );
      
      return Response.json({ 
        user: updatedUser, 
        message: 'Profile updated successfully' 
      });
      
    } else {
      const newUserData = {
        _id: params.userId,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        major: data.major || 'Science',
        collegeName: data.collegeName || 'CTI College',
        address: data.address || '',
        about: data.about || '',
        dp: data.dp || '',
        coverdp: data.coverdp || '',
      };
      
      if (data.username && data.username.trim()) {
        const trimmedUsername = data.username.trim();
        
        const userWithSameUsername = await User.findOne({ 
          username: trimmedUsername
        });
        
        if (userWithSameUsername) {
          return Response.json(
            { error: 'Username already taken' },
            { status: 409 }
          );
        }
        
        newUserData.username = trimmedUsername;
      }
      
      const userWithSameEmail = await User.findOne({ 
        email: newUserData.email
      });
      
      if (userWithSameEmail) {
        return Response.json(
          { error: 'Email already taken' },
          { status: 409 }
        );
      }
      
      const newUser = new User(newUserData);
      const savedUser = await newUser.save();
      return Response.json({ 
        user: savedUser, 
        message: 'Profile created successfully' 
      });
    }
    
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return Response.json(
        { 
          error: 'Validation failed', 
          details: validationErrors,
          fields: Object.keys(error.errors)
        },
        { status: 400 }
      );
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];
      return Response.json(
        { error: `${field || 'Field'} already exists` },
        { status: 409 }
      );
    }
    
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return Response.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }
    
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
export async function DELETE(request, { params }) {
  await dbConnect();
  
  try {
    const user = await User.findByIdAndDelete(params.userId); 
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