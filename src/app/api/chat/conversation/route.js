
// import dbConnect from '@/lib/db';
// import Conversation from '@/models/Conversation';
// import User from '@/models/User';

// export default async function handler(req, res) {
//   await dbConnect();

//   if (req.method === 'POST') {
//     try {
//       const { userId1, userId2 } = req.body;

//       // Check if conversation already exists
//       let conversation = await Conversation.findOne({
//         participants: { $all: [userId1, userId2] }
//       }).populate('participants', 'name dp email');

//       if (!conversation) {
//         // Create new conversation
//         conversation = await Conversation.create({
//           participants: [userId1, userId2],
//           unreadCount: {
//             [userId1]: 0,
//             [userId2]: 0
//           }
//         });

//         // Populate the participants
//         conversation = await Conversation.findById(conversation._id)
//           .populate('participants', 'name dp email');
//       }

//       res.status(200).json({ success: true, conversation });
//     } catch (error) {
//       res.status(500).json({ success: false, error: error.message });
//     }
//   }

//   if (req.method === 'GET') {
//     try {
//       const { userId } = req.query;

//       const conversations = await Conversation.find({
//         participants: userId
//       })
//         .populate('participants', 'name dp email major')
//         .sort({ updatedAt: -1 });

//       res.status(200).json({ success: true, conversations });
//     } catch (error) {
//       res.status(500).json({ success: false, error: error.message });
//     }
//   }
// }


import dbConnect from "@/lib/db";
import Conversation from "@/models/Conversation";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  try {
    const { userId1, userId2 } = await request.json();

    let conversation = await Conversation.findOne({
      participants: { $all: [userId1, userId2] }
    }).populate("participants", "name dp email");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId1, userId2],
        unreadCount: {
          [userId1]: 0,
          [userId2]: 0
        }
      });

      conversation = await Conversation.findById(conversation._id).populate(
        "participants",
        "name dp email"
      );
    }

    return NextResponse.json({ success: true, conversation });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate("participants", "name dp email major")
      .sort({ updatedAt: -1 });

       const conversationsWithUnread = conversations.map(conv => {
      const userUnreadCount = conv.unreadCount?.get(userId) || 0;
      return {
        ...conv.toObject(), // Convert mongoose document to plain object
        unreadCount: userUnreadCount
      };
    });

     return NextResponse.json({ success: true, conversations: conversationsWithUnread });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
