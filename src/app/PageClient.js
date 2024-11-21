'use client'
import styles from "./page.module.css"
import AddMapForm from "./components/AddMapForm"
import Link from "next/link"
import {useState,useEffect} from "react"
import DeleteConfirmationModal from "./components/DeleteConfirmationModal"
import Modal from "./maps/[id]/sharedComponents/Modal"
import { deleteMap } from "./actions/maps"
import Button from "./components/Button"
import { Trash } from "iconoir-react"

export default function PageClient({mapData,isMobile}){
  console.log(isMobile);
  const [deleteConfirmOpen,updateDeleteConfirmationOpen] = useState(false)
  const [deleteId,updateDeleteId] = useState(null)

  const [mapList,updateMapList] = useState(mapData);
  const deleteClick = async (id) => {
    const deletedMap = await deleteMap(deleteId);
    updateDeleteConfirmationOpen(false);
    updateDeleteId(null);
    updateMapList(deletedMap);

  }
  return<div className={styles.container}>
  <h1 className={`${styles.title}`}>💏 Mike & Danielle's Map App</h1>
  <h2 className={`${styles.warning}`}>❌NO ONE ELSE ALLOWED❌</h2>
  <div className={`${styles.form}`}>
    <AddMapForm />
  </div>
  <h3 className={styles.mapTitle}>All Maps</h3>
  <ul className={`${styles.mapList}`}>
    {mapList.map(m=>(
      <li className={`${styles.mapItem} flex-center`} key={m.id}>
        {!isMobile ? <><Link href={`maps/${m.id}`}>{m.title}</Link>
        <Button modifiers={['sm','ghost']} icon={<Trash />} className={styles.trashButton} onClick={(e)=>{
          e.preventDefault(); 
          updateDeleteConfirmationOpen(true);
          updateDeleteId(m.id)
          }}></Button></> : <Button  style={{width: "100%"}} modifiers={["secondary","big"]} href={`maps/${m.id}`}>{m.title}</Button>}
      </li>

    ))}
  </ul>
  {deleteConfirmOpen && <Modal header={"Delete Map"} closeEvent={()=>{updateDeleteConfirmationOpen(false)}}>
    <DeleteConfirmationModal 
      title={'Are you sure you want to delete this map? All data will be lost'}
      cancelClick={(e)=>{e.preventDefault(); updateDeleteConfirmationOpen(false)}}
      deleteClick={(e)=>{e.preventDefault(); deleteClick()}}

    />
  </Modal>}
  </div>
}