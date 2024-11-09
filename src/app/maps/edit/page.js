'use client'
import { useContext, useEffect } from "react"

import { PageContext } from "./layout";
import { useSearchParams } from 'next/navigation'



export default function () {
  const mapId = useSearchParams().get("id");
  const mapData = useContext(PageContext);
  console.log(mapData);
  return<div>
  Map editor
  
  </div> 
  


}