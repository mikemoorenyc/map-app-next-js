
import { NextAuthRequest } from "next-auth/lib";
import { auth } from "./app/auth"

export default auth((req:NextAuthRequest) => {
  const userList = process.env.ALLOWED_USERS||""
const allowedUsers = userList.split(',');

  if(!req?.auth?.user || !req?.auth?.user.email) {
    return Response.redirect("/login")
  }
  
  if( req?.auth && req.nextUrl.pathname !== "/baduser" && req.nextUrl.pathname !== "/login" && !allowedUsers.includes(req?.auth?.user?.email)) {
    const newUrl = new URL("/baduser", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }


  

  if ( (!req.auth && req.nextUrl.pathname !== "/login") ) {
    const newUrl = new URL("/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }

})


export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest).*)"],
}