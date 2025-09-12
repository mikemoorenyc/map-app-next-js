import { Liveblocks } from "@liveblocks/node";
import { NextRequest} from "next/server";

export async function POST(request:NextRequest) {
  // Get the current user from your database
  const data = await request.json();

  if(!data.user||!data.user.email) {
    return new Response("No user in post data")
  }
  
 
   const secret = process.env.LIVEBLOCKS_SECRET_KEY
   if(!secret) {
    return new Response(
      "no secret key",{status:500}
    )
   }

  const liveblocks = new Liveblocks({
  secret: secret,
  });
  
  

  // Start an auth session inside your endpoint
  const liveblocksSession = liveblocks.prepareSession(
    data.user?.email,
  
  );

  // Use a naming pattern to allow access to rooms with wildcards
  // Giving the user read access on their org, and write access on their group
  liveblocksSession.allow(`maps:*`, liveblocksSession.READ_ACCESS);
  liveblocksSession.allow(`maps:*`, liveblocksSession.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await liveblocksSession.authorize();
  return new Response(body, {
    status,
    headers: { "Content-Type": "application/json" },
  });
}