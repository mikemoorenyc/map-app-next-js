import DataContext from "@/_contexts/DataContext";

import { CSSProperties, ReactNode, useContext} from "react";
import svgImgUrl from "@/_lib/svgImgUrl";
import styles from "./LayerSection.module.css";  
import { RiCheckLine, RiSettingsLine } from "@remixicon/react";

import { TLayer } from "@/projectTypes";
import useActiveStore from "@/_contexts/useActiveStore";

const LayerSection = ({children,layer,activeId}:{children:ReactNode,layer:TLayer,activeId:number|null}) => {
  

 
  if(!layer) return ; 


  const activeLayer = useActiveStore(set=>set.activeLayer)
  const collapsedLayers = useActiveStore(set => set.collapsedLayers)
  const setActiveLayer = useActiveStore(set =>set.updateActiveLayer)
  const updateCollapsedLayers = useActiveStore(set => set.updateCollapsedLayers);
  const canEdit = useActiveStore(set=>set.canEdit);
  const updateEditingLayer = useActiveStore(set=>set.updateEditingLayer)


  const isDragging = activeId == layer.id
  const isActive = activeLayer == layer.id
  const isCollapsed = collapsedLayers.includes(layer.id);
  const hasPins = layer?.pins?.length > 0; 
  let textColor;
  switch(layer?.lightOrDark) {
    case "dark":
      textColor = "white"
      break;
    case "light": 
      textColor = "black"
      break;
    default:
      textColor = "var(--screen-text)"
  }
   

  const activeStyles:CSSProperties = {
    background: isActive ? layer.color : undefined,
    color: (isActive) ? textColor : undefined
  }
  
  return <div onClick={()=>{
        setActiveLayer(layer.id);
    
        
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
            setActiveLayer(layer.id);
          }
          updateCollapsedLayers(layer.id, isCollapsed)
         
        }}>
          {!isCollapsed && <RiCheckLine className={styles.svg}  />}
        </button>
        {layer.icon && <img style={{marginRight:4}}width={16} height={16} src={svgImgUrl({icon:layer.icon})}/>}
        <div className={`flex-1 overflow-ellipsis cursor-default`}>{layer.title}</div>
        {canEdit && <button className={styles.gear} onClick={(e) => {
                                e.preventDefault();
                                console.log(layer.id);
                                updateEditingLayer(layer.id)
                  }}>
          <RiSettingsLine />
        </button>}
      </div>
      {!isCollapsed && <div className={styles.pinContainer}style={{
      height: !hasPins ? "3em":undefined,  
    }}>{children}</div>}
    </div>
    
                
                
                       
              
  
  </div>

}

export default LayerSection