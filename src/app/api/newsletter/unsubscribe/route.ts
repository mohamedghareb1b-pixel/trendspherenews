import { NextRequest, NextResponse } from "next/server";
import { container } from "@/lib/container";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(`${siteUrl}/newsletter/error`);
  }

  try {
    await container.unsubscribe.execute(token);
    return NextResponse.redirect(`${siteUrl}/newsletter/unsubscribed`);
  } catch (error) {
    return NextResponse.redirect(`${siteUrl}/newsletter/error`);
  }
}
