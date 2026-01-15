'use client'
import Link from "next/link";
import styles from "./activeCardStyles.module.css";
import MenuButton from "../MenuButton";
import { SyntheticEvent, useState} from "react";
import { useRouter } from 'next/navigation'
import MapThumbnail from "./MapThumbnail";
import {  RiMap2Line } from "@remixicon/react";
import svgImgUrl from "@/_lib/svgImgUrl";
import { THomepageMap, TMap } from "@/projectTypes";
import { THomepageMapActions } from "@/app/PageClient";
//import DropDown from "@/app/components/DropDown/DropDown";

//import BottomSheet from "@/app/components/BottomSheet/BottomSheet";

type TActiveCardProps = {
  appMap: THomepageMap,
  top:boolean,
  bottom:boolean,
  actions: THomepageMapActions,
  type?: "archived"|"active"
}


export default function ({appMap,top=false,bottom=false, actions, type="active"}:TActiveCardProps)  {

  const [downTime, updateDownTime] = useState(0); 
  const router = useRouter();
  const pinLength = appMap.pinCount; 
  const url = `/maps/${appMap.id}`

  const clickCheck = (e:SyntheticEvent) => {
    e.preventDefault(); 
  
    if ((+new Date() - downTime) > 200) {
                return ;
    }
    router.push(url);
  }


 //<img width={16} height={16} src={`/api/glyph?picker=true&w=16&icon=${appMap.mapIcon}`} style={{marginRight:4}}/>
  
  return <>
  <div style={{position:"relative"}}> <div className={styles.activeCard} onMouseUp={clickCheck} onMouseDown={()=>{updateDownTime(+new Date())}}>
    <div  className={`${styles.imageContainer} flex-center-center ${!pinLength ? "stripes-text-on-bg":""}`}>
      {pinLength < 1 ? <RiMap2Line className={styles.mapIcon} />: <MapThumbnail className={styles.thumbnail} appMap={appMap} width={175} height={150} />}
    </div>
    <div className={styles.text}> 
      <h2 className={`${styles.mapName} overflow-ellipsis `}><Link className="flex-center" href={url}>
        {appMap.mapIcon && <img width={16} height={16} src={svgImgUrl({picker:true, icon:appMap.mapIcon})} style={{marginRight:4}}/> }
        <span className="flex-1 overflow-ellipsis">{appMap.title}</span></Link></h2>
      <div className={styles.amountLine}>{pinLength} pins</div>

    </div>

    
  
  </div>
  <MenuButton actions={actions} archived={type=="archived"}mapData={appMap} top={top} bottom={bottom} modifiers={["secondary","icon","sm"]} containerClasses={styles.moreButton}/>


  </div>

 
  
  
  
  </>
  
}
