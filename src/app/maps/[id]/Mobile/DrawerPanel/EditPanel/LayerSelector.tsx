import styles from "./LayerSelector.module.css"

import svgImgUrl from "@/app/lib/svgImgUrl"

import { useLayers,useFindLayer } from "@/app/lib/useLayerData";
import { TPin } from "@/projectTypes";
import { RiArrowDownSLine } from "@remixicon/react"



export default function LayerSelector({updater,pinState}:{updater:(v:any,k:string)=>void,pinState:TPin}) {
  const layers = useLayers();
  const currentLayer = useFindLayer(pinState.layerId);
  if(!currentLayer) {
    throw new Error("No current layer found");
  }
  const ldColor = currentLayer.lightOrDark == "light" ? "black" : "white"
  const maskStyles = {
    backgroundColor: currentLayer.color,
    borderColor: ldColor,
    color: ldColor
  }
  return(
<div className={styles.container}>
  <div className={`${styles.mask} flex-center`} style={maskStyles}>
    <div className={`${styles.maskLabel} flex-1 flex-center`}>
      {currentLayer.icon && <img style={{marginRight:4}} width={16} height={16} src={svgImgUrl({icon:currentLayer.icon})}/>}
      <span className="flex-1 overflow-ellipsis">{currentLayer.title}</span>
    </div>
    <div className={styles.maskIcon}> <RiArrowDownSLine /> </div>
  </div>
  <select className={styles.select} name="layerId" id={"layerId"} onChange={(e)=>{e.preventDefault(); updater(parseInt(e.target.value),"layerId")}} value={pinState.layerId}>
      {layers.map(l => {
        return <option key={l.id} value={l.id}>{l.title}</option>
      })
      }
    
    </select>

</div>

  ) 

}