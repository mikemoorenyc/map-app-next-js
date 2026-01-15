import TextInput from "../TextInput";
import DropDown from "./DropDown";
import { useRef,useEffect, useMemo,useState,useCallback, useContext, SyntheticEvent, ChangeEvent } from "react";
import ActiveContext from "@/_contexts/ActiveContext";
import InfoWindowContext from "@/_contexts/InfoWindowContext";
import SearchLogic, { BasicResults } from "./SearchLogic";
import POICheck from "@/app/maps/[id]/desktop/MapPanel/POICheck";
import resultFormatter, { TPredictionResult } from "./lib/resultFormatter";
import { MapMouseEvent, useMap } from "@vis.gl/react-google-maps";
import mapMover from "@/app/maps/[id]/desktop/MapPanel/lib/mapMover";
import AddWindowScreen from "@/app/maps/[id]/desktop/MapPanel/PinEditWindow/AddWindowScreen";

import { TSearchPin } from "./lib/fieldMapping";
import useLayerData from "@/_lib/useLayerData";


export default function DesktopSearch({clickEvent}:{clickEvent:MapMouseEvent|null}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inputVal,updateInputVal]= useState("");
  const [queryVal,updateQueryVal] = useState("")
  const [increment,updateIncrement] = useState(0)
  const [predictionResults,updatePredictionResults] = useState<BasicResults[]>([]);
  const [predictionChoice,updatePredictionChoice] = useState<string|number>("");
  const layerData = useLayerData().layers
  const map = useMap();
  const {activeData,activeDispatch} = useContext(ActiveContext)
  const {infoWindowDispatch} = useContext(InfoWindowContext);

  //Close on Change
  const reset = ( ) => {
    updatePredictionResults([])
    updateInputVal("")
    updateQueryVal("");
    updatePredictionChoice("")
  }
  useEffect(()=> {
    if(!wrapperRef ) return ; 
    function handleClickOutside(event:MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        reset(); 
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[wrapperRef])
  const itemActivated = useCallback(async (item:TPredictionResult) => {
    if(!item.new) {
      if(activeData.editingPin != item.id) {
          activeDispatch({
            type: "EDITING_PIN", 
            id: item.id,
          })
          
      }
      reset();
      return ; 
    }
    console.log(item.id);
    updatePredictionChoice(item.id);
    
  },[activeData,activeDispatch,updatePredictionChoice])


  
  const inputChange = useCallback((e:ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      
      const newValue = e.target.value; 

      
      updateIncrement(prev => prev+1);
      if(newValue.length === 0) {
        updatePredictionResults([]);
        updateIncrement(0)
        updateQueryVal("")
      }
      
      if(increment > 0 || Math.abs(newValue.length - inputVal.length) > 4) {
        updateIncrement(0);
        updateQueryVal(newValue);
      }
      updateInputVal(e.target.value);
  },[increment,inputVal]);
  const predictionsCallback = (predictions:BasicResults[]) => {
   
    updatePredictionResults(predictions);
  }

  const updatePin = (placeDetails:TSearchPin|false) => {
      console.log(placeDetails);
      if(!placeDetails) return false; 
      if(!placeDetails?.location) return ; 
    if(!activeData.activeLayer) {
      activeDispatch({
        type: "ACTIVE_LAYER",
        id: layerData[0].id
      })
    }
    infoWindowDispatch({
      type: "UPDATE_TEMP_MARKER_POSITION",
      position: placeDetails.location
    })
    activeDispatch({
      type: "EDITING_PIN", 
      id: null,
    })
    if(map) mapMover(map, placeDetails.location)
    infoWindowDispatch({
      type: "OPEN_WINDOW",
      anchor: null,
      position: placeDetails.location,
      content: {
        header: placeDetails.title,
        body: <AddWindowScreen placeData={placeDetails}></AddWindowScreen>
      }
    }) 
    reset();
  }
  const resultsFormatted = useMemo(()=> {
    return resultFormatter(queryVal,layerData,predictionResults)
  },[layerData,queryVal,predictionResults])
  
  const {pinsFlat, predictions, activePins} = resultsFormatted; 
  const inputStyles = useMemo(()=> {
    return {
    width: 400,
    borderBottomLeftRadius: pinsFlat.length? 0:undefined,
    borderBottomRightRadius: pinsFlat.length ?0 : undefined
    }
  },[pinsFlat])

  return <div ref={wrapperRef} style={{position:"absolute", left:24, top: 24,zIndex:99}} >
    <TextInput name="searchbar" modifiers={['raised']} placeholder="Search for a location" style={inputStyles}type={"text"} value={inputVal} onChange={inputChange}/>

    {predictionResults.length || activePins.length ? <DropDown itemActivated={itemActivated} pinsFlat={pinsFlat} activePins={activePins} predictions={predictions} />:""}
  <POICheck clickEvent={clickEvent} updatePin={updatePin}/>
  <SearchLogic predictionChoiceCallBack={updatePin} query={queryVal} updatePredictionResults={predictionsCallback} predictionChoice={predictionChoice}/>
  </div>

}