
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

type ImageAttributes = {
  icon:string, 
 


}


export async function GET(
  request:NextRequest,  
  { params }: { params: Record<string, string | string[]> }
) {


  const image = params.image; // type: string | string[]

  if (Array.isArray(image)) {
    return new Response("Invalid image param", { status: 400 });
  }


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
          lineHeight: 56
        }}
      >
        <span>{icon}</span>
      </div>
    ),
    {
      width: 64,
      height: 64,
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
