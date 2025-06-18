// app/api/users/route.js
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  await dbConnect();
  
  try {
    const users = await User.find({});
    return Response.json(users);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();
  const data = await request.json();
  
  try {
    const user = await User.create(data);
    return Response.json(user, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}