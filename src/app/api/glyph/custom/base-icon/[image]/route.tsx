
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import fs from "node:fs/promises";
import path from "node:path";
type ImageAttributes = {
  icon:string,



}


export async function GET(
  request:NextRequest,
 context: any
) {


  const { image } = await context.params as { image: string };



  const imgAttr:Partial<ImageAttributes> = {}
  image.split("__").forEach(v => {
    const item = v.split("_");
    imgAttr[item[0] as keyof ImageAttributes] = item[1];
  });


  const icon = imgAttr?.icon
  if(!icon) {
    return new Response("need Icon value",{status:400});
  }
  //custom
  const isCustom = icon?.startsWith("custom");
  if (!isCustom) {
    return new Response("Icon not custom",{status:400});
  }
  const filename = icon.replace("custom-", "");
  const basePath = path.join(
      process.cwd(),
      "public",
      "map-icons",
      filename
    );

  let filePath: string;
  let contentType: string;

  try {
    await fs.access(`${basePath}.svg`);
    filePath = `${basePath}.svg`;
    contentType = "image/svg+xml";
  } catch {
    try {
      await fs.access(`${basePath}.png`);
      filePath = `${basePath}.png`;
      contentType = "image/png";
    } catch {
      return new Response("Icon not found", { status: 404 });
    }
  }

  const file = await fs.readFile(filePath);

  return new Response(file, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });

}
