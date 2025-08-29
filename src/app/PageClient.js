'use client'
import styles from "./page.module.css"

import { useState,useEffect} from "react"

import { mapSort } from "./lib/sortMaps"

import ActiveCard from "./_homepageComponents/ActiveCard/ActiveCard"
import ArchiveItem from "./_homepageComponents/ArchiveItem/ArchiveItem"
import AddMapButton from "./_homepageComponents/AddMapButton/AddMapButton";
import { archiveMap,deleteMap,moveMap } from "./_homepageComponents/actionLogic"
import { ModalProvider } from "./contexts/ModalContext"
import { getAllMaps } from "./actions/maps"
const localStore = process.env.NEXT_PUBLIC_LOCAL_MAP


export default function PageClient({}){

  const [loaded,updateLoaded] = useState(false);

  const [mapList,updateMapList] = useState( {all:[],active:[],archived:[]});
 

  const updater = (map) => {

    const newMap = mapSort(map)
     updateMapList(newMap);
     localStorage.setItem(localStore,JSON.stringify(newMap))
  }
  const actions = {
    archive: (mapId,toArchive) => { archiveMap(mapList.all,mapId,toArchive,updater)},
    delete: (mapId) => {deleteMap(mapList.all,mapId,updater)},
    move: (mapId,direction) => {moveMap(mapList.all,mapId,updater,direction)}
  }
  const firstMaps = async () => {
    
    const maps = await getAllMaps(); 

    const theList = mapSort(maps);
    updateMapList(theList);
    localStorage.setItem(localStore,JSON.stringify(theList));
    
  }
  useEffect(()=> {
    const lastViewed = localStorage.getItem("last-viewed");
    console.log(lastViewed);



    
  },[])
  
  useEffect(()=> {
    const listData = localStorage.getItem(localStore);

    if(listData) {

      updateMapList(JSON.parse(listData));
    }
    
    updateLoaded(true);

    
   


  },[])
  

  useEffect(()=> {
    if(!loaded) return ; 
    firstMaps(); 
  },[loaded])


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

  return<ModalProvider><div className={styles.container}>

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
  

  </div></ModalProvider>
}

/*
  <div className={`${styles.form}`}>
    <AddMapForm />
  </div>
  */
