import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = (req.nextauth.token as { role?: string })?.role;
    const isAdminArea = req.nextUrl.pathname.startsWith("/admin");

    if (isAdminArea && !["admin", "editor", "author"].includes(role ?? "")) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  },
  {
    callbacks: {
      // لازم يكون فيه توكن (يعني مسجل دخول) عشان يدخل /admin أساسًا
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/signin",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
