import { ReactNode } from "react";
import styles from "./styles.module.css";
import svgImgUrl from "@/_lib/svgImgUrl";


type Props = {
  mapIcon?:string, 
  contentOpen:boolean,
  pageTitle:string, 
  before?:ReactNode,
  after?:ReactNode
}

const DrawerPanelHeader = ({mapIcon,contentOpen, pageTitle, before,after}:Props) => {
  
  const openClass = contentOpen ? styles.contentOpen : "";
  return <div className={`${styles.drawerPanelHeader} ${openClass} flex-center`}>

  {before}
  <div className={`${styles.title} ${openClass} flex-1 overflow-ellipsis flex-center`}>
    {mapIcon && <img src={svgImgUrl({icon:mapIcon,picker:true})} width={28} height={28} style={{marginRight:8}}/> }
    <span>{pageTitle}</span>
  </div>
  {after}
  </div>
}


export default DrawerPanelHeader; 