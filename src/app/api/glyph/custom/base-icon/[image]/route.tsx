
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
  let customUrl = ""
  if (isCustom && icon) {
    const filePath = path.join(
      process.cwd(),
      "public",
      "map-icons",
      icon?.replace("custom-","")+".svg"
    );
    const svg = await fs.readFile(filePath, "utf8");

        return new Response(svg, {
          headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });

  }

  const PickerGlyph = new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height:64,
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          fontSize: 62,
          lineHeight: 56
        }}
      >
        <span>{icon}</span>
      </div>
    ),
    {
      width: 64,
      height: 64,
      emoji:"noto"

    }
  )


  try {


      return PickerGlyph;


  } catch (e) {
    console.log(e)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
