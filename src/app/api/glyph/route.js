
import { ImageResponse } from 'next/og'
export const contentType = 'image/png'
export async function GET(request,) {

 
  const {searchParams} = request.nextUrl
  const icon = searchParams.get("icon")
  const color = searchParams.get("color");
  const ld = searchParams.get('ld');
  const visited = searchParams.get("visited") == "true";
  const favorited = searchParams.get("favorited") == "true";
  const hasIcon = searchParams.get("hasIcon") == "true";
  const size = parseInt(searchParams.get("w")) * 2;
  const fontSize = parseInt(searchParams.get("size"))
  

  
  const shadowColor = ld == "dark" ? "white" : "black";
  const favoritedSize = size * 1.3;
  const isLight = ld == "light";
  const textShadow = hasIcon || (!hasIcon && ld=="dark") ? `1px 1px 0 ${shadowColor}, -1px 1px 0 ${shadowColor}, -1px -1px 0 ${shadowColor}, 1px -1px 0 ${shadowColor}` : "none"
  const FavoritedIcon = new ImageResponse((
    <div
      style={{
        position:"relative",
        display:"flex",
        width: favoritedSize,
        height: favoritedSize,
        color: ld == "dark"?"white":"black",
        filter: visited? "grayscale(1)" : "none",
      }}
    >
  
     <svg style={{width:"100%",height:"100%",position:"absolute"}} viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 1L22.4498 5.30479L28.5801 4.43769L29.6498 10.5359L35.119 13.4377L32.4 19L35.119 24.5623L29.6498 27.4641L28.5801 33.5623L22.4498 32.6952L18 37L13.5502 32.6952L7.41987 33.5623L6.35015 27.4641L0.880983 24.5623L3.6 19L0.880983 13.4377L6.35015 10.5359L7.41987 4.43769L13.5502 5.30479L18 1Z"  strokeLinejoin="round" style={{
  stroke: isLight ?"black":"white",
  fill: color
}}/>
</svg>
  <div style={{
    position:"absolute",
    left: 0,
    top: 0,
    width: favoritedSize,
    height: favoritedSize,
    textAlign:"center",
    fontSize: fontSize * 2.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight:1,
    textShadow: textShadow
   
  }}
  
  
  ><span>{icon}</span></div>
    
    
    </div>
  ),
  {width: favoritedSize,height:favoritedSize}
  )

  const PickerGlyph = new ImageResponse(
    (
      <div
        style={{
          width: size||44,
          height:size||40,
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          fontSize: `${size?size*.8:36}px`,
          lineHeight: `${size?size*.8:36}px`
        }}
      >
        <span>{icon}</span>
      </div>
    ),
    {
      width: size,
      height: size
    }
  )

  const PlainIcon = new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            
            justifyContent: 'center',
            border:"1px solid black",
            fontSize:fontSize * 1.85,
            lineHeight:`${size}px` ,
            fontWeight:600,
            borderRadius:"50%",
            boxShadow: "1px 1px 0 black",
            width: size,
            height: size,
            backgroundColor: color,
            filter: visited? "grayscale(1)" : "none",
            color: ld == "dark"?"white":"black"
          }}
        
        >
          <div
            style={{
            
             position:"relative",
       
             textAlign: "center",
             lineHeight: 1,
             textShadow: textShadow
           }}
           >
            {icon}
          </div>
        </div>
      ),
      {
        width: size + 2,
        height:size + 2,

      }
    )
  try {
    if(searchParams.get("picker") == "true") {
      return PickerGlyph;
    }
    return favorited ? FavoritedIcon : PlainIcon
  } catch (e) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
