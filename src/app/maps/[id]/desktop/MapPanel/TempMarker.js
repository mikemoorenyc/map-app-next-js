import { useContext, forwardRef } from "react";
import ActiveContext from "@/app/contexts/ActiveContext";
import DataContext from "@/app/contexts/DataContext";
import { MapPin } from "iconoir-react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

const TempMarker = forwardRef((props,ref)=> {
    const {activeData} = useContext(ActiveContext);
    const {layerData} = useContext(DataContext);
    const {position} = props
    const currentLayer = layerData.find(l => l.id == activeData.activeLayer)
    let activeColor  = "#ffffff"
    if(activeData?.activeLayer) {
        activeColor = currentLayer?.color
    }

    let foregroundColor = "#ffffff";
  
    if(currentLayer?.lightOrDark == "light") {
        foregroundColor = "#000000";
    }
   


    return <AdvancedMarker ref={ref || null}  position={position}>
       {position ? <div>
       <MapPin color={foregroundColor} width={36} height={36} fill={activeColor} />
       
       </div> : <div style={{transform: "translateX(200%)",width:1,height:1,visibility:"hidden"}}></div>}
    </AdvancedMarker>
})

export default TempMarker; 