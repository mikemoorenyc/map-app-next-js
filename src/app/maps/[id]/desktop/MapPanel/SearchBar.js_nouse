
import { useMap,useMapsLibrary, useAdvancedMarkerRef } from "@vis.gl/react-google-maps"
import { useEffect , useRef, useState,useCallback,useContext} from "react";
import mapMover from "./lib/mapMover";
import TempMarker from "./TempMarker";
import POICheck from "./POICheck";
import AddWindowScreen from "./PinEditWindow/AddWindowScreen";
import TextInput from "@/app/components/TextInput";
import ActiveContext from "@/app/contexts/ActiveContext";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";



const SearchBar =  ({clickEvent}) => {
    
    const {infoWindowState,infoWindowDispatch} = useContext(InfoWindowContext)
    const {activeDispatch} = useContext(ActiveContext);

    const map = useMap(); 
    const [markerRef,marker] = useAdvancedMarkerRef(); 
    const [activeMarker,setActiveMarker] = useState(null)
    const placesLibrary = useMapsLibrary('places');
  
    const inputEl = useRef(null);
    const [autocompleteWidget,setAutocompleteWidget] = useState(null);
    const [inputListener, updateInputListener] = useState(null)
    const [pinLocation, updatePinLocation] = useState(null)
    const [infoWindowShown, updateInfoWindowShown] = useState(false);
    const [placeData,updatePlaceData] = useState(null)
   
    const closeInfoWindow = useCallback(()=> {
        updatePlaceData(null)
        updatePinLocation(null);
        updateInfoWindowShown(null);
    },[])
    useEffect(()=> {
        if (!placesLibrary || !map) return;
        setAutocompleteWidget(new placesLibrary.Autocomplete(inputEl.current, {
            bounds: map.getBounds(),
        }));
        
        
    },[placesLibrary,map])



    //Make sure marker is ready before firing
    useEffect(()=> {
        const {infoWindowShown,tempRef} = infoWindowState;
        if(!marker)return ;
        if(marker && tempRef) return 
        if(marker && !tempRef) {
            infoWindowDispatch({
                type: "UPDATE_TEMP_REF",
                tempRef: marker
            })
        }


        


    },[marker,placeData, infoWindowState])
    const updatePin = (place,  open=true) =>{

        activeDispatch({
            type:"EDITING_PIN",
            id: null
        })
     
        infoWindowDispatch({
                type: "OPEN_WINDOW",
                anchor: null,
                position: place.location,
                content: {
                    header: place.name,
                    body: <AddWindowScreen placeData={place}></AddWindowScreen>
                }
            }) 
        
       // console.log("pinup");
        const data = open ? place : null
        //updatePlaceData(data)
        updatePinLocation(open ? data.location : null);
        updatePlaceData(place)
       // updateInfoWindowShown(open);
        if(open) {
            mapMover(map, data.location)
        }
    }
    useEffect(()=> {
        if(!autocompleteWidget) return; 
        autocompleteWidget.bindTo("bounds",map);
        updateInputListener(autocompleteWidget.addListener("place_changed",()=> {
          //  console.log(marker === null);
          console.log(marker);
            const place = autocompleteWidget.getPlace()
            console.log(place);
            //updateMapState(place.geometry.location.toJSON(),place.geometry.viewport.toJSON());
            updatePin(place);
           // updateInfoWindowShown(prev => true)
            /*infoWindowDispatch({
                type: "OPEN_WINDOW",
                anchor: marker
            })*/

            inputEl.current.value = ""
        }))
    },[autocompleteWidget])
    //ADD WINDOW AFTER MARKER CREATED
   
  
    useEffect(()=> {
       
        setActiveMarker(marker)
    },[marker])

    //UPDATE PIN LOCATION ON CLOSE
    
    useEffect(()=> {
        const openState = infoWindowState.infoWindowShown;
        //CHECK IF THEY"RE MATCHING AND DO NOTHING
        if(!openState) {
            updatePlaceData(null);
        }
    },[infoWindowState])

    

    const handleMarkerClick = useCallback(
    () => updateInfoWindowShown(infoWindowShown => !infoWindowShown),
    []
  )

    

    
    

    return <div style={{position:"absolute", left:24, top: 24}}  >
         <TextInput style={{width:400}}type={"text"} ref={inputEl} />
        
      <TempMarker ref={markerRef}  visible={false}position={placeData?.geometry?.location.toJSON() }></TempMarker> 
      <POICheck clickEvent={clickEvent} updatePin={updatePin}/>
    
    </div> 
}

export default SearchBar