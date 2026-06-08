import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const password = body?.password;

  const correctPassword = process.env.SITE_PASSWORD;
  const accessToken = process.env.SITE_ACCESS_TOKEN;

  if (!correctPassword || !accessToken) {
    return NextResponse.json(
      { message: "Website password is not configured." },
      { status: 500 },
    );
  }

  if (password !== correctPassword) {
    return NextResponse.json(
      { message: "Incorrect password" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: "site-auth",
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}