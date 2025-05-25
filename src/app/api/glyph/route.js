import { ImageResponse } from 'next/og'
export const contentType = 'image/png'
export async function GET(request,) {


 
  const {searchParams} = request.nextUrl
  const icon = searchParams.get("icon")
  const color = searchParams.get("color");
  const ld = searchParams.get('ld');
  const favorited = searchParams.get("favorited") == "true";
  const visited = searchParams.get("visited") == "true";
  const size = parseInt(searchParams.get("w"));
console.log(searchParams);
  const shadowColor = ld == "dark" ? "white" : "black"
  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border:"1px solid black",
            fontSize:16,
            lineHeight:16,
            fontWeight:600,
            borderRadius:"50%",
            boxShadow: "1px 1px 0 black",
            width: size,
            height: size,
            backgroundColor: color,
            filter: visited? "grayscale(1)" : "none"
          }}
        
        >
          <div
            style={{
             position:"relative",
             left:-1, 
             top:-1,
             textShadow: `1px 1px 0 black`
           }}
           >
            {icon}
          </div>
        </div>
      ),
      {
        width: size + 1,
        height:size + 1,
      }
    )
  } catch (e) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
