import { ReactNode } from "react"
import { ImageResponse } from "next/og"
export type TIconProps = {
  favoritedSize?: number,
  ld?: string|null,
  visited: boolean,
  isLight: boolean,
  color?: string,
  fontSize: number,
  favorited: boolean,
  interior: ReactNode,
  size:number
}

export default function (props: TIconProps) {
  const {favoritedSize,ld,visited,isLight,color,fontSize,interior,size,favorited} = props
  const FavoritedIcon = <div
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
fill: color||undefined
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
  //textShadow: textShadow

}}


    >
    {interior}


    </div>


  </div>
  const PlainIcon = <div
    style={{
      display: 'flex',
      alignItems: 'center',

      justifyContent: 'center',
      border:"1px solid black",
      fontSize:fontSize * 2.1,
      lineHeight:`${size}px` ,
      fontWeight:600,
      borderRadius:"50%",
      boxShadow: "1px 1px 0 black",
      width: size,
      height: size,
      backgroundColor: color||undefined,
      filter: visited? "grayscale(1)" : "none",
      color: ld == "dark"?"white":"black"
    }}
  >
    <div
    style={{
       position:"relative",
       textAlign: "center",
       lineHeight: 1,
      //textShadow: textShadow,
       display:"flex"
     }}
     >
       {interior}
    </div>
  </div>
  return new ImageResponse(favorited ? FavoritedIcon : PlainIcon, {
    width: favorited?favoritedSize:size + 2,
    height: favorited?favoritedSize:size + 2,
    emoji:"noto"
  })
}
