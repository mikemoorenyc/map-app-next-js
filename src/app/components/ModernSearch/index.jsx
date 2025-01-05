import {useState,useEffect,useCallback, useContext,useMemo,useRef} from "react"
import { useMap,useMapsLibrary,useAdvancedMarkerRef} from "@vis.gl/react-google-maps"
import TextInput from "../TextInput"
import DropDown from "./DropDown"
import DataContext from "@/app/contexts/DataContext"
import getCurrentPins from "./lib/getCurrentPins"
import ActiveContext from "@/app/contexts/ActiveContext"
import AddWindowScreen from "@/app/maps/[id]/desktop/MapPanel/PinEditWindow/AddWindowScreen"
import mapMover from "@/app/maps/[id]/desktop/MapPanel/lib/mapMover"
import POICheck from "@/app/maps/[id]/desktop/MapPanel/POICheck"

import InfoWindowContext from "@/app/contexts/InfoWindowContext"



export default function Search({clickEvent}) {
  
  const [inputVal,updateInputVal] = useState("")
  const [sessionToken,setSessionToken] = useState(null)
  const [autocompleteService,setAutocompleteService] = useState(null)
  const [placesService,setPlacesService] = useState(null); 
  const [predictionResults,setPredictionResults] = useState([]);
  const {layerData} = useContext(DataContext)
  const wrapperRef = useRef(null);
  const {activeData,activeDispatch} = useContext(ActiveContext)

  const {infoWindowDispatch} = useContext(InfoWindowContext);
  

  const [incrementCheck,updateIncrementCheck] = useState(0);
  const map = useMap(); 
  const places = useMapsLibrary('places');

  useEffect(()=> {
    if(!wrapperRef || !places) return ; 
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setPredictionResults([])
        updateInputVal("")
        setSessionToken(new places.AutocompleteSessionToken());
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[wrapperRef,places])
 
  useEffect(()=> {
    if (!places || !map) return;
    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(map));
    setSessionToken(new places.AutocompleteSessionToken());
     return () => setAutocompleteService(null);
  },[map,places])
  const fetchPredictions = useCallback(
    async (inputValue) => {
      console.log(inputValue);
      if (!autocompleteService || !inputValue) {
 
        return;
      }

      const request = {input: inputValue, sessionToken,locationBias:map.getBounds()};
      const response = await autocompleteService.getPlacePredictions(request);
      console.log(response)
      setPredictionResults(response.predictions);
    },
    [autocompleteService, sessionToken]
  );
  
  const inputChange = useCallback((e) => {
    e.preventDefault();
   
    
    updateIncrementCheck(prev => prev+1);
    if(e.target.value.length === 0) {
      setPredictionResults([]);
    }
    
    if(incrementCheck > 0 || Math.abs(e.target.value - inputVal) > 4) {
      updateIncrementCheck(0);
      
      fetchPredictions(e.target.value);
    }
    updateInputVal(e.target.value);
  },[fetchPredictions,incrementCheck,inputVal]); 
  const handleClick = useCallback(
    (item) => {
      const placeId = item.id;
      if(!item.new) {
        if(activeData.editingPin != item.id) {
          activeDispatch({
            type: "EDITING_PIN", 
            id: item.id,
          })
          setPredictionResults([])
          updateInputVal("");
        }
        
        
        return ;
      }
      console.log(placeId);
      const detailRequestOptions = {
        placeId,
     
        sessionToken
      };
      const detailsRequestCallback = (
        placeDetails
      ) => {
        console.log(placeDetails);
        
        updatePin(placeDetails)
        
        setPredictionResults([]);
        updateInputVal("");
        setSessionToken(new places.AutocompleteSessionToken());
      };
      placesService?.getDetails(detailRequestOptions, detailsRequestCallback);

    },
  [places, placesService, sessionToken])
  const updatePin = (placeDetails) => {
    infoWindowDispatch({
          type: "UPDATE_TEMP_MARKER_POSITION",
          position: placeDetails.geometry.location.toJSON()
    })
    activeDispatch({
            type: "EDITING_PIN", 
            id: null,
          })
    mapMover(map, placeDetails.geometry.location.toJSON(),placeDetails.geometry.viewport.toJSON())
    infoWindowDispatch({
                        type: "OPEN_WINDOW",
                        anchor: null,
                        position: placeDetails.geometry.location.toJSON(),
                        content: {
                            header: placeDetails.name,
                            body: <AddWindowScreen placeData={placeDetails}></AddWindowScreen>
                        }
            }) 
  }
  /*
  const sendRequest = async () => {
    if(!token) return ; 
    const request = {
      input: inputVal,
      sessionToken: token,
      locationBias: map.getBounds()
    }
    const req = new placesLibrary.AutocompleteSuggestion(); 
    
    console.log(req);
    const {suggestions} = req.fetchAutocompleteSuggestions(request);
    console.log(suggestions);
  }

  
*/
const activePins = useMemo(()=> {
    return getCurrentPins(layerData,inputVal)
  },[layerData,inputVal])
const inputStyles = {
  width: 400,
  borderBottomLeftRadius: activePins.length || predictionResults.length? 0:undefined,
  borderBottomRightRadius: activePins.length || predictionResults.length ?0 : undefined
}

  return <div ref={wrapperRef} style={{position:"absolute", left:24, top: 24}} >
    <TextInput placeholder="Search for a location" style={inputStyles}type={"text"} value={inputVal} onChange={inputChange}/>

    {predictionResults.length || activePins.length ? <DropDown itemActivated={handleClick} activePins={activePins} predictions={predictionResults} query={inputVal} />:""}
  <POICheck clickEvent={clickEvent} updatePin={updatePin}/>
  </div>
}