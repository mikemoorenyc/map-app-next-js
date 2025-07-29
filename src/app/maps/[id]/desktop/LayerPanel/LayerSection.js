import DataContext from "@/app/contexts/DataContext";
import ActiveContext from "@/app/contexts/ActiveContext";
import { useContext} from "react";
import svgImgUrl from "@/app/lib/svgImgUrl";
import styles from "./LayerSection.module.css";  
import { RiCheckLine, RiSettingsLine } from "@remixicon/react";

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
   

  const activeStyles = {
    background: isActive ? layer.color : null,
    color: (isActive) ? textColor : null
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
          {!isCollapsed && <RiCheckLine className={styles.svg}  />}
        </button>
        {layer.icon && <img style={{marginRight:4}}width={16} height={16} src={svgImgUrl({icon:layer.icon})}/>}
        <div className={`flex-1 overflow-ellipsis cursor-default`}>{layer.title}</div>
        <button className={styles.gear} onClick={(e) => {
                                e.preventDefault();
                                activeDispatch({
                                    type: "EDITING_LAYER",
                                    id: layer.id
                                });
                  }}>
          <RiSettingsLine />
        </button>
      </div>
      {!isCollapsed && <div className={styles.pinContainer}style={{
      height: !hasPins ? "3em":null,  
    }}>{children}</div>}
    </div>
    
                
                
                       
              
  
  </div>

}

export default LayerSection