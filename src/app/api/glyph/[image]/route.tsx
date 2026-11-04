
import { ImageResponse } from 'takumi-js/response';
import { NextRequest } from 'next/server';
import { f } from 'node_modules/@liveblocks/react/dist/room-BZvk8RRP';

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
          lineHeight: 1,
          textAlign:"center"
        }}
      ><span style={{display:"flex",textAlign:"center",marginLeft:-3}}>{icon}</span>
      </div>
    ),
    {
      width: 64,
      height: 64,
      emoji:"twemoji"

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
