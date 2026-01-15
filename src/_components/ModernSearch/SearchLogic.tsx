import {useState,useEffect,useCallback} from "react"
import { useMap,useMapsLibrary} from "@vis.gl/react-google-maps"
import {fieldMapping,formatter,FieldMap,TSearchPin} from "./lib/fieldMapping";
import { TPin } from "@/projectTypes";

type TProps = {
  query?:string, 
  updatePredictionResults: (results:BasicResults[])=>void,
  predictionChoiceCallBack:Function,
  predictionChoice:string|number
}
export type BasicResults = {
  place_id:string, 
  description:string
}


export default function SearchLogic(props:TProps) {

  const {query,updatePredictionResults,predictionChoiceCallBack,predictionChoice} = props; 
  
 
  const [sessionToken,setSessionToken] = useState<google.maps.places.AutocompleteSessionToken>()
  /*const [autocompleteService,setAutocompleteService] = useState(null)
  const [placesService,setPlacesService] = useState(null); */

  
  const map = useMap(); 
  const places = useMapsLibrary('places');
  
  //Set up session token
  useEffect(()=> {
    if (!places || !map) return;

   // setPlacesService(new places.PlacesService(map));
    setSessionToken(new places.AutocompleteSessionToken());
  

  },[map,places])


  /*GETTING SEARCH RESULTS*/

  //1. Monitor query update
  useEffect(()=> {
    if(!query) return ;
    
    fetchPredictions(query);
  },[query])

  //2. Get predictions

  const fetchPredictions = useCallback(
    async (inputValue?:string) => {
      
      if (!places || !inputValue||!map) {
        return;
      }

      const request = {input: inputValue, sessionToken,locationBias:map.getBounds()};
   
      const {suggestions} = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request)

      const formattedPredictions = suggestions.map((s): BasicResults|false =>  {
        if(!s?.placePrediction) return false 
        return  {
          place_id: s.placePrediction.placeId,
          description: s.placePrediction.text.text
        }
      }).filter(s => s !== false);
      //Send Raw results back to requestor
      updatePredictionResults(formattedPredictions);
   
    },
    [places, sessionToken,map]
  );

  
  /*SEND DATA BACK ABOUT CHOICE*/

  //Monitor choice
  useEffect(()=> {

    if(!predictionChoice) return ; 
    console.log("newchoice",predictionChoice)
    fetchPredictionData(predictionChoice);
  },[predictionChoice])

  const fetchPredictionData = useCallback(async (placeId:string|number)=>{
    if(!places) return false; 
    const newPlace = new places.Place({id:placeId.toString()})
    await newPlace.fetchFields({fields:fieldMapping.map((f:FieldMap) => f.source)});
    
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