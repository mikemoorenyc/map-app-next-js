import { ReactElement, useEffect, useState } from "react"

import { createPortal } from "react-dom"


export default function ({children,containerId="portal-container"}:{children:ReactElement|ReactElement[],containerId?:string}) {
  const [portalDom,updatePortalDom] = useState<HTMLDivElement|null>(null);
  useEffect(()=>{
    const con   = document.getElementById(containerId);
    if(con && con instanceof HTMLDivElement ) {
      updatePortalDom(con); 
    }
  },[])

  if(!portalDom) return ; 

  return <>
  {createPortal(children,portalDom)}
  
  </>

}