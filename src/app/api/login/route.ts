import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import * as db from "@/db/queries";
import { SignJWT } from "jose";

export type LoginResponse = {
  message: string;
  user: {
    id: string;
    username: string;
    created_at: string;
  };
};

export type ErrLoginResponse = {
  message: string;
};

export async function POST(
  request: NextRequest,
): Promise<NextResponse<LoginResponse | ErrLoginResponse>> {
  const data = await request.json();
  const username = data.username.trim().toLowerCase();
  const password = data.password;

  if (username === "" || password === "")
    return NextResponse.json(
      { message: "Username and password must be defined" },
      { status: 422 },
    );

  if (password.length < 4)
    return NextResponse.json(
      { message: "Password must be at least 4 characters long" },
      { status: 422 },
    );

  const user = await db.find_user_by_username(username);

  if (!user)
    return NextResponse.json(
      { message: "This user doesn't exist" },
      { status: 401 },
    );

  if (!(await bcrypt.compare(password, user.password_hash)))
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });

  const response = NextResponse.json(
    {
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
      },
    },
    { status: 200 },
  );
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const JWTtoken = await new SignJWT({ user: user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);

  response.cookies.set("auth-token", JWTtoken, {
    httpOnly: true,
    secure: true,
  });

  return response;
}
