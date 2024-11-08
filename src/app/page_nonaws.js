"use client";  

import {useActionState,useState,useEffect} from "react";
import { addMap,getMaps } from "./actions/maps";
import Link from "next/link";
export default function Home() {
 
    const [allMaps,updateAllMaps] = useState([]);
    useEffect( ()=> {
      async function fetchData() {
        const initialMaps = await getMaps();
        updateAllMaps(initialMaps.maps);
      }
      fetchData(); 
      
    },[])
    console.log(allMaps);
    async function formSend(e) {
      e.preventDefault(); 
      
      const addedMap = await addMap(e.target.elements.name.value)
      updateAllMaps(addedMap.maps);
     
    }
  return (
    <div >
      <main >
       
        <h2>Add Map</h2>
        <form onSubmit={formSend}>
        <label htmlFor="name" />
        <input type="text" id="name" name="name" />
        <button>Add</button>
        </form>
        <h3>Maps</h3>
        <ul>
        {allMaps.map(m => {
          return <li key={m.id}>
          <Link href={`/maps/${m.id}`}>{m.name}</Link>
          </li>
        })}
        </ul>
        
      </main>

      
    </div>
  );
}
