import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const { pathname } = req.nextUrl;

    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirect logic
    if (pathname === "/") {
      if (token.role === Role.OPERATOR) {
        return NextResponse.redirect(new URL("/production", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Protection for specific routes
    if (pathname.startsWith("/production") && token.role === Role.ACCOUNTANT) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    // Add more role-based protection here as needed

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|register).*)",
  ],
};
