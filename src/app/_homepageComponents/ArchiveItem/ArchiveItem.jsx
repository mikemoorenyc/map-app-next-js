import svgImgUrl from "@/app/lib/svgImgUrl";

import styles from "./ArchiveItemStyles.module.css";
import Link from "next/link";

import MenuButton from "../MenuButton";

export default function ({appMap,actions}) {
  
  const url = `/maps/${appMap.id}`
  const imgUrl = svgImgUrl({icon:appMap.mapIcon,picker:true})
  return (
    <div className={`${styles.archiveItem} flex-center`}>
      <Link className={`flex-center flex-1 ${styles.link}`} href={url}>
        <span  className={`${styles.title} flex-center`}>
          {appMap.mapIcon && <img src={imgUrl} width={16} height={16} style={{marginRight:4}}/>}
          <span className="flex-1 overflow-ellipsis">{appMap.title}</span>
        </span>
        <span className={styles.count}>{appMap.pinCount} pins</span>
    </Link>
    <MenuButton actions={actions} mapData={appMap} archived={true} modifiers={["secondary","ghost","icon","sm"]}/>
  </div>
  )
}
