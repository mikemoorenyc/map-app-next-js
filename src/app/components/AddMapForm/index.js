'use client'
import { redirect } from 'next/navigation'
import { addMap } from '@/app/actions/maps'
import styles from "./styles.module.css"
import Button from '../Button'
import { PlusCircle } from 'iconoir-react'
import TextInput from '../TextInput'
import { useState } from 'react'
const AddMapForm = () => {
  const [noName,updatenoName] = useState(false);
  const [mapname,updateName] = useState("");
 
  

  const submitter = async (e) => {
    e.preventDefault() ; 
    if(!mapname) {
      updatenoName(true)
      return false 
    }
    const added = await addMap(mapname);
    redirect(`/maps/${added.id}`)

  }

  return<> <form className={`${styles.form} flex-center`} onSubmit={submitter}>
  
  <TextInput onChange={(e)=>{e.preventDefault(); updateName(e.target.value)}} value={mapname} placeholder={"Map Name"} modifiers={["smaller"]} className={`flex-1 ${styles.input}`}/>
  <Button icon={<PlusCircle />} type={"submit"}>Add a map</Button>
  
  
  </form>
  {noName && <p>You need to have a name.</p>}
  </>
}
export default AddMapForm