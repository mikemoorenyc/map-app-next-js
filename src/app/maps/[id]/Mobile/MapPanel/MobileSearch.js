import { useContext, useEffect, useRef, useState } from "react";
import { AdvancedMarker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import mapCenterer from "../lib/mapCenterer";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import TextInput from "@/app/components/TextInput";


export default () => {
  const {activeData,activeDispatch} = useContext(MobileActiveContext);
  const map = useMap(); 
  const inputEl = useRef(null);
  const [markerPosition, updateMarkerPosition] = useState(null);
  const [autocompleteWidget, setAutocompleteWidget] = useState(null)
  const placesLibrary = useMapsLibrary("places");
  
  //ATTACH WIDGET TO INPUT
  useEffect(()=> {
    if (!placesLibrary || !map) return;
      setAutocompleteWidget(new placesLibrary.Autocomplete(inputEl.current, {
          bounds: map.getBounds(),
      }));
  },[placesLibrary,map])

  //ADD EVENT LISTENER

  useEffect(()=> {
    if(!autocompleteWidget) return ; 
    //SET AREA TO MAP VIEWPORT
    autocompleteWidget.bindTo("bounds",map);
    //CREATE EVENT LISTENER
    autocompleteWidget.addListener("place_changed",()=> {
 
            const place = autocompleteWidget.getPlace()
            console.log(place);
            const pos = place.geometry.location.toJSON()
            mapCenterer(map, pos);
            updateMarkerPosition(pos);
            activeDispatch({type:"SET_ACTIVE_PIN",id:"temp"})
            activeDispatch({type:"DRAWER_STATE",state:"open"})
            activeDispatch({type: "SET_TEMP_DATA",data: place})
            inputEl.current.value = ""
            
      })

  },[autocompleteWidget])


    

    return <><div style={{
              transition: "transform .15s",
              transform: activeData.drawerState == "maximized" ? "translateY(-300%)" : null,
              position:"absolute", 
              left: 24, top:24, 
              width: "calc(100% - 48px)"}}>
         <TextInput type={"text"} ref={inputEl} style={{width:"100%"}}/>
         <div>
         
          {(activeData.activePin == "temp" && markerPosition) && <AdvancedMarker position={markerPosition} />}
         </div>
      
    
    
    </div> </>
}