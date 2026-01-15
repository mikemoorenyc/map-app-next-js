import { useEffect,useState } from "react";
import { MapMouseEvent, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { FieldMap } from "@/_components/ModernSearch/lib/fieldMapping";
import { formatter,fieldMapping } from "@/_components/ModernSearch/lib/fieldMapping";

export default ({clickEvent, updatePin}:{clickEvent:MapMouseEvent|null,updatePin:Function}) => {




const map = useMap();
const placesLibrary = useMapsLibrary("places");
///const [placesService,updatePlacesService] = useState(null);




useEffect(()=> {
    if(!map || !placesLibrary)return;
    //Turn on Places Service
    //console.log("set");
   // const something = google.maps.event.addListener(map,"click",poiCheck)
   // updatePlacesService(new placesLibrary.PlacesService(map));
 

},[map,placesLibrary])

const getClick = async (clickEvent:MapMouseEvent|null)=> {
    if(!clickEvent) return ; 
        console.log("poi click");

    if(!clickEvent.detail.placeId) {
        return ; 
    }
    if(!placesLibrary) return ; 
    const newPlace = new placesLibrary.Place({id:clickEvent.detail.placeId})
    await newPlace.fetchFields({fields:fieldMapping.map((f:FieldMap) => f.source)});
    const formattedResult = formatter(newPlace);
    updatePin(formattedResult);
}

//POI CHECK
useEffect(()=> {
    
    if(!clickEvent || !placesLibrary) return ; 
    
    getClick(clickEvent); 
    /*
    placesService.getDetails({placeId: clickEvent.detail.placeId},(place,status)=>{
        updatePin(place)
    });
    */

    console.log("send");
},[clickEvent]);


    return <></>
}