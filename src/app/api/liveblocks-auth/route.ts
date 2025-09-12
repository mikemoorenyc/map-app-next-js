import { Liveblocks } from "@liveblocks/node";
import { NextRequest} from "next/server";

export async function POST(request:NextRequest) {
  // Get the current user from your database
  let data:any; 
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if(!data.user||!data.user.email) {
    return Response.json({ error: "No user in post data" }, { status: 400 });
  }
  
 
   const secret = process.env.LIVEBLOCKS_SECRET_KEY
   if(!secret) {
    return Response.json({ error: "No secret key configured" }, { status: 500 });
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