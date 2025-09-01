import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📥 Incoming user data:", body);   // 👈 log incoming data

    const { _id, email, name,role } = body;
    if (!_id || !email) {
      console.error("❌ Missing _id or email");
      return NextResponse.json({ ok: false, error: "Missing _id or email" }, { status: 400 });
    }

    await dbConnect();
    console.log("✅ DB connected");

    const user = await User.findOneAndUpdate(
      { _id },
      {
        $setOnInsert: {
          _id,
          email,
          name: name ?? "",
          dp: "",
          coverdp: "",
          major: "Science",
          collegeName: "CTI College",
          address: "",
          about: "",
          role,
        },
      },
      { new: true, upsert: true }
    );

    console.log("✅ User stored:", user);

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error("❌ API error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
