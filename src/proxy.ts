import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run proxy for dashboard routes
  if (pathname.startsWith("/dashbord")) {
    const token = request.cookies.get("token")?.value || request.cookies.get("jevxo services_access_token")?.value;
    const role = request.cookies.get("jevxo services_user_role")?.value;

    // 1. If not logged in, redirect to login page with original destination as a redirect query param
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Role-based access control
    if (role) {
      const clientOnlyPaths = [
        "/dashbord/overview",
        "/dashbord/saved",
        "/dashbord/bookings",
        "/dashbord/wallet",
        "/dashbord/help"
      ];

      const staffOnlyPaths = [
        "/dashbord/users",
        "/dashbord/analytics",
        "/dashbord/quick-booking",
        "/dashbord/orders",
        "/dashbord/commissions",
        "/dashbord/support"
      ];

      if (role === "client") {
        // Client trying to access main dashbord overview or staff-only routes
        if (pathname === "/dashbord" || staffOnlyPaths.some(path => pathname.startsWith(path))) {
          return NextResponse.redirect(new URL("/dashbord/overview", request.url));
        }
      } else {
        // Staff/Vendor trying to access client-only routes
        if (clientOnlyPaths.some(path => pathname.startsWith(path))) {
          return NextResponse.redirect(new URL("/dashbord", request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

// Configure proxy matcher for dashboard routes
export const config = {
  matcher: ["/dashbord/:path*"],
};
