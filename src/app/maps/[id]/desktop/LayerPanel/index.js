'use client'
import { useContext } from "react";
import DataContext from "@/app/contexts/DataContext";
import Header from "./Header";
import styles from "./LayerPanel.module.css"
const LayerPanel = ({id})=> {
  const {layerData, pageTitle} = useContext(DataContext);

  return <div className={styles.layerPanel}>
  <Header id={id} />
  
  <ul>
    {layerData.map(l=> <li key={l.name}>{l.name}</li>)}
  </ul>
  </div>
}    

export default LayerPanel 