
import { auth } from "./app/auth"

export default auth((req) => {
const allowedUsers = process.env.ALLOWED_USERS.split(',');
  
  if(req?.auth && req.nextUrl.pathname !== "/baduser" && req.nextUrl.pathname !== "/login" && !allowedUsers.includes(req?.auth?.user?.email)) {
    const newUrl = new URL("/baduser", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }


  
  console.log(req.auth);
  if ((!req.auth && req.nextUrl.pathname !== "/login") ) {
    const newUrl = new URL("/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }

})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}