export default (map,location,viewport,zoom) => {

    if(!map) return ; 
    map.setCenter(location);
    map.panBy(0,-100)
    if(viewport) {
        map.fitBounds(viewport);
    }
    if(zoom) {
        map.zoom(zoom);
    }
    
}