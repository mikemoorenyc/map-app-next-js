import {  TPlaceDetails, TGeolocation, TViewport } from "@/projectTypes";

export type TSearchPin = TPlaceDetails & {
  
    location:TGeolocation,
    viewport:TViewport
  
}


export type FieldMap = {
  source: keyof google.maps.places.Place;
  target: keyof TSearchPin;
  transform?: (val: any) => any;
  skip?:boolean
};

export const fieldMapping: FieldMap[] = [
  { source: "id", target: "id" },
  { source: "displayName", target: "title"},
  { source: "formattedAddress", target: "formatted_address" },
  { source: "websiteURI", target: "website" },
  { source: "googleMapsURI", target: "url" },
  {source:"location",target:"location",transform:(v)=>v?.toJSON()},
  {source:"viewport",target:"viewport",transform:(v)=>v?.toJSON()}

];




export const formatter = (newPlace:google.maps.places.Place) :TSearchPin|false => {
 
  const formattedResult:Partial<TSearchPin> = {};
  if(!newPlace.location||!newPlace.viewport) return false
  fieldMapping.forEach(({source,target,transform})=> {
    let newVal = newPlace[source];
   
    if(transform) {
      newVal = transform(newVal);
    }
    formattedResult[target as keyof TSearchPin] = newVal as any;
  })
  formattedResult.location = newPlace.location.toJSON(); 
  formattedResult.viewport = newPlace.viewport?.toJSON(); 
  return formattedResult as TSearchPin; 
}

export default fieldMapping
