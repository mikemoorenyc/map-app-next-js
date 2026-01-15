// middleware.ts
import { auth } from "./auth";// <-- from your Auth.js setup
import { NextAuthRequest } from "next-auth/lib";
import { NextResponse } from "next/server";

import { isMobile } from "@/_lib/isMobile";

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
  //NOT A MAP PAGE
  if(!pathname.includes("/maps/")) {
    return NextResponse.next();
  }
  const userAgent = req.headers.get("user-agent") || "";
  const mobileCheck = isMobile(userAgent);
  const mobileSite = pathname.includes("/mobilesite");
  //MOBILE PHONE ON MOBILE SITE OR DT ON DT SITE
  if((mobileCheck && mobileSite)|| (!mobileCheck&&!mobileSite)) {
    return NextResponse.next();
  }
  //MOBILE NOT ON MOBILE SITE
  if(mobileCheck && !mobileSite) {
    return NextResponse.redirect(new URL(pathname+"/mobilesite",req.nextUrl))
  } 
  if(!mobileCheck && mobileSite) {
    return NextResponse.redirect(new URL(pathname.replace("/mobilesite",""),req.nextUrl))
  }
  
  


  return NextResponse.next();

 
  
});

// Specify which paths should run middleware (optional optimization)

export const config = {
  matcher: ["/((?!favicon.ico|_next/static|_next/image|manifest.webmanifest).*)"],
}
