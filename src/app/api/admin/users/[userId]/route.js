
export async function PUT(request, context) {
  const params = await context.params;
  try {
    await dbConnect();
    const data = await request.json();

    const existingUser = await User.findById(params.userId);

    if (!existingUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData = {};

       if (typeof data.isSuspended === 'boolean') {
      updateData.isSuspended = data.isSuspended;
      
      // ✅ DEBUG: Check what books exist for this user
      const userBooks = await Book.find({ author: params.userId });
      console.log(`Found ${userBooks.length} books for user ${params.userId}`);
      console.log('Book IDs:', userBooks.map(book => book._id));
      
      // ✅ HIDE/SHOW ALL USER'S BOOKS BASED ON SUSPENSION STATUS
      const updateResult = await Book.updateMany(
        { seller: params.userId },
        { isHidden: data.isSuspended }
      );
      
      console.log(`Books update result:`, updateResult);
      console.log(`Updated books visibility for user ${params.userId}: ${data.isSuspended ? 'hidden' : 'visible'}`);
    }


    // ✅ Only update other fields if provided
    if (data.name?.trim()) updateData.name = data.name.trim();
    if (data.email?.trim()) updateData.email = data.email.trim().toLowerCase();
    if (data.username?.trim()) updateData.username = data.username.trim();
    if (data.major) updateData.major = data.major;
    if (data.collegeName?.trim()) updateData.collegeName = data.collegeName.trim();
    if (data.address?.trim()) updateData.address = data.address.trim();
    if (data.about?.trim()) updateData.about = data.about.trim();
    if (data.dp?.trim()) updateData.dp = data.dp.trim();
    if (data.coverdp?.trim()) updateData.coverdp = data.coverdp.trim();

     const updatedUser = await User.findByIdAndUpdate(
      params.userId,
      { isSuspended: data.isSuspended },
      { new: true, runValidators: true }
    );

    // Force save to ensure changes are persisted
    await updatedUser.save();

    return Response.json({ user: updatedUser, message: 'User updated successfully' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
