import { Storage } from "@google-cloud/storage";
const bucketName = process.env.GCLOUD_BUCKET || process.env.GCLOUD_BUCKET



export const createStorage = () => {
  const id = process.env.GCLOUD_PROJECT_ID || process.env.GCLOUD_PROJECT_ID
  const keys =  process.env.GCLOUD_CREDENTIALS 
  if(!id||!keys) { console.log("coudn't created storage"); return  false}; 
  return new Storage({
  projectId:process.env.CLOUD_PROJECT_ID,
  credentials: JSON.parse(keys)
  });
}
export const createBucket = () => {
   

  if(!bucketName ) {console.log("couldn't create bucket"); return false }; 
  const storage = createStorage();
  if(!storage) return false; 
  return storage.bucket(bucketName);
}


export default async function (path) {
  if(!path) return false; 
  const corsList =  process.env.GCLOUD_CORS
  const bucket = createBucket(); 
  if(!corsList||!bucket) {
    return false; 
  }
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
    return false;  
  }
  const file = bucket.file(path );
  const options = {
    expires: Date.now() + 5 * 60 * 1000, //  5 minutes,
    fields: { "x-goog-meta-source": "map-app-project" },
  };
  const [response] = await file.generateSignedPostPolicyV4(options);
if(!response) {
  console.log("error getting url from API")
    return false
  }
  return  response; 

}

