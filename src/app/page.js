
import {  getAllMaps } from "./actions/maps";

import Link from "next/link"
import AddMapForm from "./components/AddMapForm";
import styles from "./page.module.css";

const Page = async function() {
  let initMapData = await getAllMaps(); 
  return <div className={`${styles.container}`}>
  <h1 className={`${styles.title}`}>💏 Mike & Danielle's Map App</h1>
  <h2 className={`${styles.warning}`}>❌NO ONE ELSE ALLOWED❌</h2>
  <div className={`${styles.form}`}>
  <AddMapForm />
  </div>
  <h3 className={styles.mapTitle}>All Maps</h3>
  
  <ul className={`${styles.mapList}`}>
  {initMapData.map(m=><li className={`${styles.mapItem}`} key={m.id}><Link href={`maps/${m.id}`}>{m.title}</Link></li>)}
  </ul>
  
  </div>
}

export default Page 
/*
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
  {mapList.map(m=><li key={m.id}><Link href={`maps/${m.id}`}>{m.title}</Link></li>)}
  </ul>
  


  </div>
} 
*/