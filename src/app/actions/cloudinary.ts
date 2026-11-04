"use server";
import { v2 as cloudinary, SignApiOptions, type UploadApiOptions } from "cloudinary";
import { auth } from "../auth"
import type { Session } from "next-auth";
const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret = process.env.CLOUDINARY_API_SECRET,
  map_server_key = process.env.MAP_SERVER_KEY
const badEnv = !cloud_name || !api_key || !api_secret||!map_server_key;

type TGenerateSignatureParams= {
  public_id: string,

  overwrite?: boolean
  public?:boolean
}

const uploadRemote = async (url: string,public_id:string) => {
  if (badEnv) throw new Error("Bad env values");
  const session: Session|null = await auth();
  if(!session || !session?.user) {
    throw new Error("Not logged in")
  }
  const response = await fetch(url+map_server_key);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Google Places Photo Error:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorBody
      });
    throw new Error(`Google returned ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  cloudinary.config({cloud_name,api_key,api_secret});
  const result = await cloudinary.uploader.upload(
    `data:${response.headers.get("content-type")};base64,${buffer.toString("base64")}`,
    {
      public_id,
      overwrite: true
    }
  );
  return result;
}

const generateSignature = async (params:TGenerateSignatureParams): Promise<UploadApiOptions & {}> => {
  if (badEnv) throw new Error("Bad env values");
  const session: Session|null = await auth();
  if(!session || !session?.user) {
    throw new Error("Not logged in")
  }
  const signParams = {
    ...params,
    overwrite: params.overwrite ?? true,
    timestamp: Math.floor(Date.now() / 1000)
  }
  try {
    cloudinary.config({cloud_name,api_key,api_secret});
    const signature = cloudinary.utils.api_sign_request(signParams, api_secret);
    return {
          ...signParams,
          ...{cloud_name,api_key,signature}
        }
  } catch (err) {
    throw new Error("couldn't do signature "+String(err))
  }
}


export {generateSignature,uploadRemote}
