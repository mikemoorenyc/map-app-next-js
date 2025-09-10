'use client'
import styles from "./page.module.css"
import { THomepageMap } from "@/projectTypes"

import { useState,useEffect} from "react"

import { mapSort } from "./lib/sortMaps"

import ActiveCard from "./_homepageComponents/ActiveCard/ActiveCard"
import ArchiveItem from "./_homepageComponents/ArchiveItem/ArchiveItem"
import AddMapButton from "./_homepageComponents/AddMapButton/AddMapButton";
import { archiveMap,deleteMap,moveMap } from "./_homepageComponents/actionLogic"
import { ModalProvider } from "./contexts/ModalContext"
import { getAllMaps } from "./actions/maps"
const localStore : string|undefined = process.env.NEXT_PUBLIC_LOCAL_MAP

export type THomepageMapActions = {
    archive: (id:number,archived:boolean)=>void,
    move:(id:number,move:boolean)=>void,
    delete:(id:number) => void
  }


export default function PageClient({}){

  const [loaded,updateLoaded] = useState(false);

  const [mapList,updateMapList] = useState<{all:THomepageMap[],active:THomepageMap[],archived:THomepageMap[]}>( {all:[],active:[],archived:[]});
 

  const updater = (map: THomepageMap[]) => {

    const newMap = mapSort(map,"client")
     updateMapList(newMap);
     if(localStore ) {
      localStorage.setItem(localStore,JSON.stringify(newMap))
     }
  }
  const actions = {
    archive: (mapId:number,toArchive:boolean) => {console.log(mapList.all); archiveMap(mapList.all,mapId,toArchive,updater)},
    delete: (mapId:number) => {deleteMap(mapList.all,mapId,updater)},
    move: (mapId:number,direction:boolean) => {moveMap(mapList.all,mapId,updater,direction)}
  }
  const firstMaps = async () => {
    
    const maps = await getAllMaps(); 
    if(!maps) return ; 

    const theList = mapSort(maps,"first maps");
    updateMapList(theList);
    if(localStore) {
      localStorage.setItem(localStore,JSON.stringify(theList));
    }
    
  }
  useEffect(()=> {
    const lastViewed = localStorage.getItem("last-viewed");
    console.log(lastViewed);



    
  },[])
  
  useEffect(()=> {
    let listData;
    if(localStore) {
      listData = localStorage.getItem(localStore);
    }
    

    if(listData) {

      updateMapList(JSON.parse(listData));
    }
    
    updateLoaded(true);

    
   


  },[])
  

  useEffect(()=> {
    if(!loaded) return ; 
    firstMaps(); 
  },[loaded])



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
    {mapList.archived.sort((a, b) => a.title.localeCompare(b.title)).map(m=> {
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
