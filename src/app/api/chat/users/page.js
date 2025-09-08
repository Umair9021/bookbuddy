import dbConnect from '@/lib/db';
import User  from '@/models/User';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await dbConnect();
      
      const { query, currentUserId } = req.query;

      const users = await User.find({
        _id: { $ne: currentUserId }, // Exclude current user
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ],
        isSuspended: false // Only active users
      })
        .select('_id name email dp major collegeName')
        .limit(10);

      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}