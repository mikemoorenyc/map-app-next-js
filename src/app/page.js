
"use client";
import { addMap, getAllMaps } from "./actions/maps";
import { useEffect,useState } from "react";
import Link from "next/link"

export default function() {
  const [mapList,updateMapList] = useState([]);
  const submitter = async (e) => {
    e.preventDefault(); 
    const added = await addMap(e.target.elements.name.value);
    updateMapList(added);
    

  }
  useEffect(()=> {
    const initMaps = async () => {
      let initMapData = await getAllMaps(); 
      updateMapList(initMapData);
    }
    initMaps(); 
  },[])
  return <div>
  <form onSubmit={submitter}>
  <label htmlFor="name">Map Name</label>
  <input type="text" id="name" name="name" />
  <button type="submit">Add map</button>
  
  </form>
  <ul>
  {mapList.map(m=><li key={m.id}><Link href={`maps/${m.id}`}>{m.name}</Link></li>)}
  </ul>
  
  </div>
} 