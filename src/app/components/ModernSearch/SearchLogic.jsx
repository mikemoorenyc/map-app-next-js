import {useState,useEffect,useCallback} from "react"
import { useMap,useMapsLibrary} from "@vis.gl/react-google-maps"
import {fieldMapping,formatter} from "./lib/fieldMapping";




export default function SearchLogic(props) {

  const {query,updatePredictionResults,predictionChoiceCallBack,predictionChoice} = props; 
  
 
  const [sessionToken,setSessionToken] = useState(null)
  /*const [autocompleteService,setAutocompleteService] = useState(null)
  const [placesService,setPlacesService] = useState(null); */

  
  const map = useMap(); 
  const places = useMapsLibrary('places');

 

  useEffect(()=> {
    if (!places || !map) return;

   // setPlacesService(new places.PlacesService(map));
    setSessionToken(new places.AutocompleteSessionToken());
  

  },[map,places])
  const fetchPredictions = useCallback(
    async (inputValue) => {
      
      if (!places || !inputValue) {
 
        return;
      }

      const request = {input: inputValue, sessionToken,locationBias:map.getBounds()};
   
      const {suggestions} = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request)

      const formattedPredictions = suggestions.map(s => {
        return {
          place_id: s.placePrediction.placeId,
          description: s.placePrediction.text.text
        }
      })
      updatePredictionResults(formattedPredictions);
   
    },
    [places, sessionToken]
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

  const fetchPredictionData = useCallback(async (placeId)=>{
    const newPlace = new places.Place({id:placeId})
    await newPlace.fetchFields({fields:fieldMapping.map(f => f[0])});
    const formattedResult = formatter(newPlace);
    console.log(formattedResult);
    predictionChoiceCallBack(formattedResult);
    return ; 
    /*
    const dataCallback = (placeDetails) => {
      predictionChoiceCallBack(placeDetails)
      setSessionToken(new places.AutocompleteSessionToken());
    }
    const requestOptions = {
      placeId,
      sessionToken
    }
    placesService?.getDetails(requestOptions, dataCallback);
    */
  },[places, sessionToken,predictionChoiceCallBack])

  return <></>
}