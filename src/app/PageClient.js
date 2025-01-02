'use client'
import styles from "./page.module.css"
import AddMapForm from "./components/AddMapForm"
import Link from "next/link"
import {useState} from "react"
import DeleteConfirmationModal from "./components/DeleteConfirmationModal"
import Modal from "./maps/[id]/sharedComponents/Modal"
import { deleteMap,archiveMap,getAllMaps } from "./actions/maps"
import Button from "./components/Button"
import { Archive, Trash } from "iconoir-react"

export default function PageClient({mapData,isMobile}){
 
  const [deleteConfirmOpen,updateDeleteConfirmationOpen] = useState(false)
  const [deleteId,updateDeleteId] = useState(null)

  const [mapList,updateMapList] = useState(mapData);
  const deleteClick = async (id) => {
    const deletedMap = await deleteMap(deleteId);
    updateDeleteConfirmationOpen(false);
    updateDeleteId(null);
    updateMapList(deletedMap);

  }
  const archiver = async(id,isArchived) => {
    updateMapList(prev => {
      return prev.map(m => {
        if(m.id === id) {
          return {...m, ...{isArchived:isArchived}}
        }
        return m; 
      })
    })
    const mapArchived = await archiveMap(id,isArchived);
    if(!mapArchived) {
      alert("Couldn't unarchive");
      return ; 
    }
    const updatedMapList = await getAllMaps();
    updateMapList(updatedMapList);
  }
  const activeMaps = mapList.filter(m => !m.isArchived); 
  const archiveMaps = mapList.filter(m => m.isArchived);
  const MapItem = ({m}) => {
    const activeClass = m.isArchived ? "":styles.active
    return (
      <li className={`${styles.mapItem} ${activeClass}`}>
        <Link className={`${styles.mapLink} ${activeClass}`} href={`maps/${m.id}`}>{m.title}</Link>
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
 
  return<div className={styles.container}>
  <h1 className={`${styles.title}`}>💏 Mike & Danielle's Map App</h1>
  <h2 className={`${styles.warning}`}>❌NO ONE ELSE ALLOWED❌</h2>
  <div className={`${styles.form}`}>
    <AddMapForm />
  </div>
  <div className={styles.mapListsContainer}>
    <div className={styles.activeMapContainer}>
      <h3 className={styles.mapTitle}>All Maps</h3>
      <ul className={`${styles.mapList} ${styles.active}`}>
        {activeMaps.map(m=>(
          <MapItem m={m} key={m.id}/>

        ))}
      </ul>
        
    </div>
    {archiveMaps.length ? <div>
    <h4 style={{marginTop:24}}>Archived Maps</h4>
    <ul className={styles.mapList}>
    {archiveMaps.map(m=> {
      return <MapItem m={m} key={m.id}/>
    })}
    </ul>
  
  </div>:""}
  
  </div>
  
  {deleteConfirmOpen && <Modal header={"Delete Map"} closeEvent={()=>{updateDeleteConfirmationOpen(false)}}>
    <DeleteConfirmationModal 
      title={'Are you sure you want to delete this map? All data will be lost'}
      cancelClick={(e)=>{e.preventDefault(); updateDeleteConfirmationOpen(false)}}
      deleteClick={(e)=>{e.preventDefault(); deleteClick()}}

    />
  </Modal>}
  </div>
}