import { Liveblocks } from "@liveblocks/node";
import { auth } from "../auth"



export async function POST(request: Request) {
  const secret = process.env.LIVEBLOCKS_SECRET
  if(!secret) {
    return new Response('No secret key',{status:500});
  }

  const liveblocks = new Liveblocks({
    secret: secret,
  });

  const authjsSession = await auth(); 
  if(!authjsSession?.user) {
    return new Response("Unauthorized",{status:401}); 
  }
  const {user} = authjsSession as TUSER; 
  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(
    user.email,
    {
      userInfo: {
        name:user.name,
        email:user.email
      }
    }// Optional
  );

  // Use a naming pattern to allow access to rooms with wildcards
  // Giving the user read access on their org, and write access on their group
  session.allow(`map-*`, session.READ_ACCESS);
  session.allow(`map-:*`, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
