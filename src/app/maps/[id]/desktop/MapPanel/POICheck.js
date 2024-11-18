import { useEffect,useState } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";



export default ({clickEvent, updatePin}) => {




const map = useMap();
const placesLibrary = useMapsLibrary("places");
const [placesService,updatePlacesService] = useState(null);




useEffect(()=> {
    if(!map || !placesLibrary)return;
    //Turn on Places Service
    //console.log("set");
   // const something = google.maps.event.addListener(map,"click",poiCheck)
    updatePlacesService(new placesLibrary.PlacesService(map));
 

},[map,placesLibrary])

//POI CHECK
useEffect(()=> {
    if(!clickEvent || !placesService) return ; 
    console.log("poi click");

    if(!clickEvent.detail.placeId) {
        return ; 
    }
    placesService.getDetails({placeId: clickEvent.detail.placeId},(place,status)=>{
        updatePin(place)
    });

    console.log("send");
},[clickEvent]);


    return <></>
}