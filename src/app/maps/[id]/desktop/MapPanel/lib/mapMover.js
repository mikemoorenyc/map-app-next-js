export default (map,location,viewport,zoom) => {

    if(!map) return ; 
        map.setCenter(location);
        if(viewport) {
            map.fitBounds(viewport);
        }
        if(zoom) {
            map.zoom(zoom);
    }
}