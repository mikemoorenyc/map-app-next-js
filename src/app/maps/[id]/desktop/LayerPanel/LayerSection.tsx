
import ActiveContext from "@/app/contexts/ActiveContext";
import { CSSProperties, ReactNode, useContext, useEffect} from "react";
import svgImgUrl from "@/app/lib/svgImgUrl";
import styles from "./LayerSection.module.css";
import { RiCheckLine, RiSettingsLine } from "@remixicon/react";
import { useSortable } from "@dnd-kit/react/sortable"
import { useDroppable } from "@dnd-kit/react"
import { TLayer } from "@/projectTypes";
import { CollisionPriority } from "@dnd-kit/abstract";



const LayerSection = ({children,layer,activeId,index}:{children:ReactNode,layer:TLayer,activeId:number|null,index:number}) => {
  const {
    ref: emptyDropRef,
    isDropTarget,
  } = useDroppable({
    id: "empty-"+layer.id,
    type: "empty-layer",
    accept: "pin",

  });
  const { ref, isDragging,handleRef} = useSortable({
      id: layer.id,
      index,
      accept:["layer"],
      type: "layer",
      group: "layer",
      collisionPriority: CollisionPriority.Low,
  })

  useEffect(() => {
    if (isDragging) {
      activeDispatch({
        type: "ACTIVE_LAYER",
        id: layer.id
      })
    }
  },[isDragging])


  if(!layer) return ;
  const {activeData,activeDispatch} = useContext(ActiveContext);
  const {activeLayer, collapsedLayers} = activeData;

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

  return <div ref={ref} onClick={()=>{
        activeDispatch({type:"ACTIVE_LAYER",id:layer.id})


      }} >
    <div className={`
    ${styles.layerSection}
    ${isDragging ? styles.isDragging : ""}
    ${isActive ? styles.isActive : ""}
    `}
    >
      <div className={`${styles.header} ${isActive ? styles.isActive : ""}`} style={activeStyles}>
        <div ref={handleRef} style={{position:"absolute",inset:0,zIndex:2,cursor:"grab"}} />
        <button
          style={{zIndex:3}}
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
        {layer.icon && <img  className={`${layer.icon.startsWith("custom-")?styles.iconCustom:""} ${layer.lightOrDark == "light"?styles.light:styles.dark} ${isActive ? styles.isActive : ""}`} style={{zIndex:1,marginRight:4}}width={16} height={16} src={svgImgUrl({icon:layer.icon})}/>}
        <div style={{zIndex:1}} className={`flex-1 overflow-ellipsis cursor-default`}>{layer.title}</div>
        {activeData.canEdit && <button style={{zIndex:3}} className={styles.gear} onClick={(e) => {
                                e.preventDefault();
                                console.log(layer.id);
                                activeDispatch({
                                    type: "EDITING_LAYER",
                                    id: layer.id
                                });
                  }}>
          <RiSettingsLine />
        </button>}
      </div>
      {(!isCollapsed && hasPins) && <div className={styles.pinContainer}style={{
      height: !hasPins ? "3em":undefined,
      }}>{children}</div>}
      {(!isCollapsed && !hasPins) && <div ref={emptyDropRef} className="empty-drop-container" style={{
        height: "2em",
        borderRadius: 2,
        borderWidth:1,
        borderStyle: isDropTarget ? "solid" : "dotted",
        margin:8
      }}></div>}
    </div>






  </div>

}

export default LayerSection
