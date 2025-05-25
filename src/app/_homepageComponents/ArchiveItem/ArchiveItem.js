import Button from "../../components/Button"

import styles from "./ArchiveItemStyles.module.css";
import Link from "next/link";
import { RiMore2Fill } from "@remixicon/react";
import MenuButton from "../MenuButton";

export default function ({appMap,actions}) {
  const pinAmount = appMap.layerData.map(l => l.pins).flat().length; 
  const url = `/maps/${appMap.id}`
  return <div className={`${styles.archiveItem} flex-center`}>
    <Link className={`flex-center flex-1 ${styles.link}`} href={url}>
    <span className={styles.title}>{appMap.title}</span>
    <span className={styles.count}>{pinAmount} pins</span>
    </Link>
    <MenuButton actions={actions} mapData={appMap} archived={true} modifiers={["secondary","ghost","icon","sm"]}/>
   
  </div>
}