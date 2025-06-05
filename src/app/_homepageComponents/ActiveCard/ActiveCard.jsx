'use client'
import Link from "next/link";
import styles from "./activeCardStyles.module.css";
import { redirect } from "next/navigation";
import MenuButton from "../MenuButton";
import { useState,useRef,useEffect, use } from "react";
import Button from "@/app/components/Button";
import MapThumbnail from "./MapThumbnail";
import { RiArchiveLine, RiArrowDownCircleLine, RiArrowUpCircleLine, RiDeleteBinLine, RiMap2Line, RiMore2Fill } from "@remixicon/react";
//import DropDown from "@/app/components/DropDown/DropDown";
import DropDownItem from "@/app/components/DropDown/DropDownItem";
//import BottomSheet from "@/app/components/BottomSheet/BottomSheet";


export default function ({appMap,top=false,bottom=false, actions})  {

  const [downTime, updateDownTime] = useState(0); 
  const [dropDownOpen,updateDropDownOpen] = useState(false);
  const dropDownAnchor = useRef(null);
  const pinLength = appMap.layerData.map(l => l.pins).flat().length; 
  const url = `/maps/${appMap.id}`
  const [isMobile,updateIsMobile] = useState(false);
  useEffect(()=> {
    updateIsMobile(window.innerWidth < 600);
  },[])

  const clickCheck = (e) => {
    e.preventDefault(); 
  
    if ((+new Date() - downTime) > 200) {
                return ;
    }
    redirect(url);
  }


 

  return <>
  <div style={{position:"relative"}}> <div className={styles.activeCard} onMouseUp={clickCheck} onMouseDown={()=>{updateDownTime(+new Date())}}>
    <div  className={`${styles.imageContainer} flex-center-center ${!pinLength ? "stripes-text-on-bg":""}`}>
      {!pinLength ? <RiMap2Line className={styles.mapIcon} />: <MapThumbnail className={styles.thumbnail} appMap={appMap} width={175} height={150} />}
    </div>
    <div className={styles.text}> 
      <h2 className={`${styles.mapName} overflow-ellipsis `}><Link className="flex-center" href={url}>
        {appMap.mapIcon && <img width={16} height={16} src={`/api/glyph?picker=true&w=16&icon=${appMap.mapIcon}`} style={{marginRight:4}}/>}
        {appMap.title}</Link></h2>
      <div className={styles.amountLine}>{pinLength} pins</div>
    </div>

    
  
  </div>
  <MenuButton actions={actions} mapData={appMap} top={top} bottom={bottom} modifiers={["secondary","icon","sm"]} containerClasses={styles.moreButton}/>


  </div>

 
  
  
  
  </>
  
}