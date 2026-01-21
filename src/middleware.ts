// middleware.ts
import { auth } from "./app/auth";// <-- from your Auth.js setup
import { NextAuthRequest } from "next-auth/lib";
import { NextResponse } from "next/server";
import { isMobile } from "./app/lib/isMobile";

export default auth((req:NextAuthRequest) => {
  const { pathname } = req.nextUrl;

  // Protect all routes under /dashboard and /api/protected
  const isProtected =
    !pathname.includes("/login")&&!pathname.includes("/baduser")

  if (isProtected && !req.auth) {
    // If it's an API request, return 401 instead of redirect
    if (pathname.startsWith("/api")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Otherwise redirect to login
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }
  //not a map page, so don't bother
  if(!pathname.toLowerCase().includes("maps")) {
    return NextResponse.next();
  }
  const mobilePath = pathname.toLowerCase().includes("mobilesite");
  const h = req.headers;
  const userAgent = h.get("user-agent") || "";
  const mobile = isMobile(userAgent);
  //DT and not on Mobile
  if(!mobile && !mobilePath) {
    return NextResponse.next();
  }
  //Mobile && on mobile
  if(mobile && mobilePath) {
    return NextResponse.next()
  }
  if(mobile && !mobilePath) {
    return NextResponse.redirect(new URL(pathname+"/mobilesite", req.nextUrl.origin));
  }
  if(!mobile && mobilePath) {
    return NextResponse.redirect(new URL(pathname.replace("/mobilesite",""), req.nextUrl.origin));
  }



  return NextResponse.next();
});

// Specify which paths should run middleware (optional optimization)

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest).*)"],
}
