import svgImgUrl from "@/_lib/svgImgUrl";

import styles from "./ArchiveItemStyles.module.css";
import Link from "next/link";

import MenuButton from "../MenuButton";
import { THomepageMap } from "@/projectTypes";
import { THomepageMapActions } from "@/app/PageClient";

export default function ({appMap,actions}:{appMap:THomepageMap,actions:THomepageMapActions}) {
  
  const url = `/maps/${appMap.id}`
 
  return (
    <div className={`${styles.archiveItem} flex-center`}>
      <Link className={`flex-center flex-1 ${styles.link}`} href={url}>
        <span  className={`${styles.title} flex-center`}>
          {appMap.mapIcon && <img src={svgImgUrl({icon:appMap.mapIcon,picker:true})} width={16} height={16} style={{marginRight:4}}/>}
          <span className="flex-1 overflow-ellipsis">{appMap.title}</span>
        </span>
        <span className={styles.count}>{appMap.pinCount} pins</span>
    </Link>
    <MenuButton actions={actions} mapData={appMap} archived={true} modifiers={["secondary","ghost","icon","sm"]}/>
  </div>
  )
}
