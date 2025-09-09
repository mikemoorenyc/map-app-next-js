import { TViewport } from "@/projectTypes";

export default (map:google.maps.Map,location:{lat:number,lng:number},viewport?:TViewport,zoom?:number) => {

    if(!map) return ; 
    map.setCenter(location);
    map.panBy(0,-100)
    if(viewport) {
        map.fitBounds(viewport);
    }
    if(zoom) {
        map.setZoom(zoom);
    }
    
}