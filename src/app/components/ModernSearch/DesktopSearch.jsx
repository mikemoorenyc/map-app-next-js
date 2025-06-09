import TextInput from "../TextInput";
import DropDown from "./DropDown";
import { useRef,useEffect, useMemo,useState,useCallback, useContext } from "react";
import ActiveContext from "@/app/contexts/ActiveContext";
import DataContext from "@/app/contexts/DataContext";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import SearchLogic from "./SearchLogic";
import POICheck from "@/app/maps/[id]/desktop/MapPanel/POICheck";
import resultFormatter from "./lib/resultFormatter";
import { useMap } from "@vis.gl/react-google-maps";
import mapMover from "@/app/maps/[id]/desktop/MapPanel/lib/mapMover";
import AddWindowScreen from "@/app/maps/[id]/desktop/MapPanel/PinEditWindow/AddWindowScreen";


export default function DesktopSearch({clickEvent}) {
  const wrapperRef = useRef(null);
  const [inputVal,updateInputVal]= useState("");
  const [queryVal,updateQueryVal] = useState("")
  const [increment,updateIncrement] = useState("")
  const [predictionResults,updatePredictionResults] = useState([]);
  const [predictionChoice,updatePredictionChoice] = useState("");
  const {layerData} = useContext(DataContext)
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
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
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
  const itemActivated = async (item) => {
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
    
  }


  
  const inputChange = useCallback((e) => {
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
  const predictionsCallback = (predictions) => {
   
    updatePredictionResults(predictions);
  }

  const updatePin = (placeDetails) => {
    infoWindowDispatch({
      type: "UPDATE_TEMP_MARKER_POSITION",
      position: placeDetails.geometry.location.toJSON()
    })
    activeDispatch({
      type: "EDITING_PIN", 
      id: null,
    })
    mapMover(map, placeDetails.geometry.location.toJSON())
    infoWindowDispatch({
      type: "OPEN_WINDOW",
      anchor: null,
      position: placeDetails.geometry.location.toJSON(),
      content: {
        header: placeDetails.name,
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
    <TextInput modifiers={['raised']} placeholder="Search for a location" style={inputStyles}type={"text"} value={inputVal} onChange={inputChange}/>

    {predictionResults.length || activePins.length ? <DropDown itemActivated={itemActivated} pinsFlat={pinsFlat} activePins={activePins} predictions={predictions} query={inputVal} />:""}
  <POICheck clickEvent={clickEvent} updatePin={updatePin}/>
  <SearchLogic predictionChoiceCallBack={updatePin} query={queryVal} updatePredictionResults={predictionsCallback} predictionChoice={predictionChoice}/>
  </div>

}