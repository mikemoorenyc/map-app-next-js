import DataContext from "@/app/contexts/DataContext";
import ActiveContext from "@/app/contexts/ActiveContext";
import { useContext} from "react";
import {  Check, Settings } from 'iconoir-react';
import styles from "./LayerSection.module.css";  

const LayerSection = ({children,layerId,activeId}) => {
  
  const {layerData} = useContext(DataContext)
  const layer = layerData.find((layer) => layer.id == layerId);
  if(!layer) return ; 
  const {activeData,activeDispatch} = useContext(ActiveContext);
  const {activeLayer, collapsedLayers} = activeData;
  const isDragging = activeId == layer.id
  const isActive = activeLayer == layer.id
  const isCollapsed = collapsedLayers.includes(layer.id);
  const hasPins = layer?.pins?.length > 0; 
  const activeStyles = {
    background: isActive ? layer.color : null,
    color: (layer?.lightOrDark == "dark" && isActive) ? "white" : null
  }
  
  return <div onClick={()=>{
        activeDispatch({type:"ACTIVE_LAYER",id:layer.id})
    
        
      }} >
    <div className={`
    ${styles.layerSection}
    ${isDragging ? styles.isDragging : ""}
    ${isActive ? styles.isActive : ""}
    `}
    >
      <div className={`${styles.header} ${isActive? styles.isActive:""}`} style={activeStyles}>
        <button 
         className={styles.collapseButton} 
        onClick={(e)=> {
          e.preventDefault();
          if(!isCollapsed) {
            activeDispatch({
              type: "ACTIVE_LAYER",
              id: layer.id
            })
          }
          activeDispatch({
            type: "UPDATE_COLLAPSED_LAYER",
            collapsed: !isCollapsed,
            id: layer.id
          })
        }}>
          {!isCollapsed && <Check className={styles.svg}  />}
        </button>
        <div className={`flex-1 overflow-ellipsis cursor-default`}>{layer.title}</div>
        <button className={styles.gear} onClick={(e) => {
                                e.preventDefault();
                                activeDispatch({
                                    type: "EDITING_LAYER",
                                    id: layer.id
                                });
                  }}>
          <Settings />
        </button>
      </div>
      {!isCollapsed && <div className={styles.pinContainer}style={{
      height: !hasPins ? "3em":null,  
    }}>{children}</div>}
    </div>
    
                
                
                       
              
  
  </div>

}

export default LayerSection