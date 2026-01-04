'use client'
import styles from "./page.module.css"
import { THomepageMap } from "@/projectTypes"

import { useState,useEffect, ReactNode} from "react"

import { mapSort } from "./lib/sortMaps"

import ActiveCard from "./_homepageComponents/ActiveCard/ActiveCard"
import ArchiveItem from "./_homepageComponents/ArchiveItem/ArchiveItem"
import AddMapButton from "./_homepageComponents/AddMapButton/AddMapButton";
import { archiveMap,deleteMap,moveMap } from "./_homepageComponents/actionLogic"
import { ModalProvider } from "./contexts/ModalContext"
import { getAllMaps } from "./actions/maps"
import { useRouter } from "next/navigation"
const localStore : string|undefined = process.env.NEXT_PUBLIC_LOCAL_MAP

export type THomepageMapActions = {
    archive: (id:number,archived:boolean)=>void,
    move:(id:number,move:boolean)=>void,
    delete:(id:number) => void
  }


export default function PageClient({list,header,button}:{list:"archived"|"active",header?:string,button?:ReactNode}){
  const router = useRouter(); 


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
    const current = window.location.href;
    const newSesh = sessionStorage.getItem("sessionStarted");
    const lastViewed = localStorage.getItem("last-viewed");
    console.log(newSesh );
    if(!newSesh ) {
      sessionStorage.setItem("sessionStarted","yes");
      if(lastViewed && lastViewed != current) {
        router.replace(lastViewed); 
      }
    }
    localStorage.setItem("last-viewed",current);
    
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

  const theList = mapList[list];

  return<ModalProvider><div className={styles.container}>

  <h1 className={`${styles.title} headline-style`}><a className="no-underline" href="/">
    <span className={styles.headlineIcon}>💏</span>
    Mike & Danielle&rsquo;s <br/>
    Map App</a>
  </h1>


  <div className={styles.mapListsContainer}>
    
    <div className={styles.activeMapContainer}>

      

      <ul className={`${styles.activeMapList} list-style-none`}>
      {(!theList.length) && <li>No maps</li>}
        {theList.map((m,i)=>(
         <li key={m.id}> <ActiveCard type={list} actions={actions} top={i===0} bottom={i == mapList.active.length - 1} appMap={m} /></li>

        ))}
      </ul>
      {button && <div className={styles.buttonContainer}>
        {button}
      </div>}
        
    </div>
    
  
  </div>
  <AddMapButton />
  

  </div></ModalProvider>
}

/*
  <div className={`${styles.form}`}>
    <AddMapForm />
  </div>
  */
