import { auth } from "@/app/auth"
import { Storage } from "@google-cloud/storage";
const bucketName =  process.env.NEXT_PUBLIC_GCLOUD_BUCKET



 const createStorage = () => {
  const id =  process.env.GCLOUD_PROJECT_ID
  const keys =  process.env.GCLOUD_CREDENTIALS 
  if(!id||!keys) { console.log("coudn't created storage"); return  false}; 
  return new Storage({
  projectId:process.env.CLOUD_PROJECT_ID,
  credentials: JSON.parse(keys)
  });
}
const createBucket = () => {
   

  if(!bucketName ) {console.log("couldn't create bucket"); return false }; 
  const storage = createStorage();
  if(!storage) return false; 
  return storage.bucket(bucketName);
}


export async function POST(request) {
  const session = await  auth(request);

  if(!session) {
    return new Response(`Must be Logged in`, {
      status: 500,
    })
  }
  const {path} = await request.json();

  if(!path) {
    return new Response("No path", {
      status: 500
    })
  }
  const corsList = process.env.GCLOUD_CORS
  const bucket = createBucket(); 
  if(!corsList||!bucket) {
    return new Response(null, {
      status:500,
      statusText: "error bucket or cors"
    }) 
  }
  const [metadata] = await bucket.getMetadata();
  


  if(metadata.cors[0].origin.join(",") !== corsList) {
    try {
     const corSet = await bucket.setCorsConfiguration([
    {
      "origin": corsList.split(','),
      "method": ["POST"],
      "responseHeader": ["Content-Type"],
      "maxAgeSeconds": 3600
    }
  ])
  } catch(err) {
    console.log(err);
    console.log(err.errors);
    return new Response(null, {
      status:500,
      statusText: "error setting CORS"
    }) 
  }

  }
/*
  
  */
  const file = bucket.file(path );
  const options = {
    expires: Date.now() + 5 * 60 * 1000, //  5 minutes,
    fields: { "x-goog-meta-source": "map-app-project" },
  };
  const [response] = await file.generateSignedPostPolicyV4(options);


  if(!response) {
    return new Response(null, {
      status:500,
      statusText: "error getting url from API"
    }) 
  }
  return  new Response(
       JSON.stringify(response)
      ,{
      status:200,
      headers: {
        "Content-Type": "application/json"
      }
    }
    )
}