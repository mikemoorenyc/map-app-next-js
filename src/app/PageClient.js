'use client'
import styles from "./page.module.css"

import {useState} from "react"

import { mapSort } from "./lib/sortMaps"

import ActiveCard from "./_homepageComponents/ActiveCard/ActiveCard"
import ArchiveItem from "./_homepageComponents/ArchiveItem/ArchiveItem"
import AddMapButton from "./_homepageComponents/AddMapButton/AddMapButton";
import { archiveMap,deleteMap,moveMap } from "./_homepageComponents/actionLogic"

export default function PageClient({mapData,isMobile}){

  

 
  const [deleteId,updateDeleteId] = useState(null)

  const [mapList,updateMapList] = useState(mapSort(mapData));

  const updater = (map) => {
    console.log(map);
     updateMapList(mapSort(map));
  }
  const actions = {
    archive: (mapId,toArchive) => { archiveMap(mapList.all,mapId,toArchive,updater)},
    delete: (mapId) => {deleteMap(mapList.all,mapId,updater)},
    move: (mapId,direction) => {moveMap(mapList.all,mapId,updater,direction)}
  }
 


/*
  const MapItem = ({m}) => {
    const activeClass = m.isArchived ? "":styles.active
 
    return (
      <li className={`${styles.mapItem} ${activeClass}`}>
        <div className={styles.cardText}>
          <Link className={`${styles.mapLink} ${activeClass} ${activeClass ? "headline-style":""}`} href={`maps/${m.id}`}>{m.title}</Link>
        <div className={styles.cardCount}>{m.layerData.map(l => l.pins).flat().length} places</div>
        </div>
        <div className={`${styles.mapActions} ${activeClass} flex-center`}>
          
          
          <Button modifiers={['sm','ghost',"caution"]} icon={<Trash />} className={styles.actionButton} onClick={(e)=>{
          e.preventDefault(); 
          updateDeleteConfirmationOpen(true);
          updateDeleteId(m.id)
          }}>Delete map</Button>
          <Button modifiers={['sm','ghost']} icon={<Archive/>} className={styles.actionButton} onClick={(e)=>{
          e.preventDefault(); 
          archiver(m.id,!m.isArchived)
          }}>{`${m.isArchived?"Un":""}`}Archive map</Button>
          
        </div>

      </li>
    )
  } 
 */

  return<div className={styles.container}>

  <h1 className={`${styles.title} headline-style`}>
    <span className={styles.headlineIcon}>💏</span>
    Mike & Danielle&rsquo;s <br/>
    Map App
  </h1>

  <div className={styles.mapListsContainer}>
    <div className={styles.activeMapContainer}>

      <ul className={`${styles.activeMapList} list-style-none`}>
        {mapList.active.map((m,i)=>(
         <li key={m.id}> <ActiveCard actions={actions} top={i===0} bottom={i == mapList.active.length - 1} appMap={m} /></li>

        ))}
      </ul>
        
    </div>
    {mapList.archived.length ? <div>
    <h4 className={`headline-style ${styles.archiveHeader}`} >Archived Maps</h4>
    <ul className={`${styles.archiveList} list-style-none`}>
    {mapList.archived.map(m=> {
      return <li key={m.id}><ArchiveItem actions={actions} appMap={m} /></li>
    })}
    </ul>
  
  </div>:""}
  
  </div>
  <AddMapButton />
  

  </div>
}

/*
  <div className={`${styles.form}`}>
    <AddMapForm />
  </div>
  */