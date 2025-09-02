
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Book from '@/models/books'; 

export async function GET(request, context) {
  const params = await context.params   
  await dbConnect();

  try {
    const user = await User.findById(params.userId);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    return Response.json(user);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(request, context) {
  const params = await context.params;
  try {
    await dbConnect();
    const data = await request.json();

    const existingUser = await User.findById(params.userId);
    
    if (!existingUser) {

      if (!data.name || !data.email) {
        return Response.json({ error: 'Name and email are required for new profiles' }, { status: 400 });
      }
      
      const newUser = new User({
        _id: params.userId,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        major: data.major || 'Science',
        collegeName: data.collegeName?.trim() || 'CTI College',
        address: data.address?.trim() || '',
        about: data.about?.trim() || '',
        dp: data.dp?.trim() || '',
        coverdp: data.coverdp?.trim() || '',
        isSuspended: data.isSuspended || false 
      });
      
      const savedUser = await newUser.save();
      return Response.json({ user: savedUser, message: 'Profile created successfully' });
    }

    const updateData = {};

    if (typeof data.isSuspended === 'boolean') {
      updateData.isSuspended = data.isSuspended;
      
      const updateResult = await Book.updateMany(
        { seller: params.userId },
        { isHidden: data.isSuspended }
      );
      
      console.log(`Updated ${updateResult.modifiedCount} books for user ${params.userId}: ${data.isSuspended ? 'hidden' : 'visible'}`);
    }

    if (data.name?.trim()) updateData.name = data.name.trim();
    if (data.email?.trim()) updateData.email = data.email.trim().toLowerCase();
    if (data.major) updateData.major = data.major;
    if (data.collegeName?.trim()) updateData.collegeName = data.collegeName.trim();
    if (data.address?.trim()) updateData.address = data.address.trim();
    if (data.about?.trim()) updateData.about = data.about.trim();
    if (data.dp?.trim()) updateData.dp = data.dp.trim();
    if (data.coverdp?.trim()) updateData.coverdp = data.coverdp.trim();

    if (Object.keys(updateData).length > 0) {
      const updatedUser = await User.findByIdAndUpdate(
        params.userId,
        updateData,
        { new: true, runValidators: true }
      );

      return Response.json({ 
        user: updatedUser, 
        message: Object.keys(updateData).includes('isSuspended') 
          ? `User ${data.isSuspended ? 'suspended' : 'activated'} successfully` 
          : 'Profile updated successfully' 
      });
    } else {
      return Response.json({ user: existingUser, message: 'No changes detected' });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const params = await context.params   
  await dbConnect();

  try {
    const user = await User.findByIdAndDelete(params.userId);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    return Response.json({ message: 'User deleted successfully' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
