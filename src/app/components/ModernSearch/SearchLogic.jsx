import {useState,useEffect,useCallback} from "react"
import { useMap,useMapsLibrary} from "@vis.gl/react-google-maps"





export default function SearchLogic(props) {

  const {query,updatePredictionResults,predictionChoiceCallBack,predictionChoice} = props; 
  
 
  const [sessionToken,setSessionToken] = useState(null)
  const [autocompleteService,setAutocompleteService] = useState(null)
  const [placesService,setPlacesService] = useState(null); 
  
  const map = useMap(); 
  const places = useMapsLibrary('places');
 
 
  useEffect(()=> {
    if (!places || !map) return;
    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(map));
    setSessionToken(new places.AutocompleteSessionToken());
     return () => setAutocompleteService(null);
  },[map,places])
  const fetchPredictions = useCallback(
    async (inputValue) => {
      
      if (!autocompleteService || !inputValue) {
 
        return;
      }

      const request = {input: inputValue, sessionToken,locationBias:map.getBounds()};
      const response = await autocompleteService.getPlacePredictions(request);
      updatePredictionResults(response.predictions);
   
    },
    [autocompleteService, sessionToken]
  );

  //Monitor query update
  useEffect(()=> {
    if(!query) return ;
    
    fetchPredictions(query);
  },[query])
  

  //Monitor choice
  useEffect(()=> {

    if(!predictionChoice) return ; 
    console.log("newchoice",predictionChoice)
    fetchPredictionData(predictionChoice);
  },[predictionChoice])

  const fetchPredictionData = useCallback((placeId)=>{
    const dataCallback = (placeDetails) => {
      predictionChoiceCallBack(placeDetails)
      setSessionToken(new places.AutocompleteSessionToken());
    }
    const requestOptions = {
      placeId,
      sessionToken
    }
    placesService?.getDetails(requestOptions, dataCallback);

  },[places, placesService, sessionToken,predictionChoiceCallBack])

  return <></>
}