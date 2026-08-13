import { NextResponse } from "next/server";

// Notice the export function name is changed to `proxy`
export function proxy(request) {
  // 1. Get the token from cookies
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/api/auth/login", "/api/invoices/generate"];

  // 2. Define public routes that don't require authentication
  const isPublicRoute = publicRoutes.includes(pathname);

  console.log(pathname, token, isPublicRoute);

  // 3. If NO token exists and user tries to access a protected route
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);

    return NextResponse.redirect(loginUrl);
  }

  // 5. Allow request to proceed normally
  return NextResponse.next();
}

// Config matcher stays the same
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
