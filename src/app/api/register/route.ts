import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import * as db from "@/db/queries";

const saltRounds = 10;

export async function POST(request: NextRequest) {
  const data = await request.json();
  const username = data.username.trim().toLowerCase();
  const password = data.password;

  if (password.length < 4)
    return NextResponse.json(
      { message: "Password must be at least 4 characters long" },
      { status: 422 },
    );

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Its easier to ask forgiveness than its to get permission
  try {
    await db.create_user(username, hashedPassword);
  } catch {
    return NextResponse.json(
      { message: "This user already exists" },
      { status: 401 },
    );
  }

  return NextResponse.json({ message: "Sucessfully logged in" });
}
