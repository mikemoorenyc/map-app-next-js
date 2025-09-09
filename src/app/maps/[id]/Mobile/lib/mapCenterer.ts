export default (map:google.maps.Map, locationPin:{lat:number,lng:number}) => {
  const wH = window.innerHeight;
  const cn = wH /2 ;
  const mainArea = window.innerHeight - 280;
  const mainAreaCenter = mainArea / 2; 
  const newPosition = cn - mainAreaCenter
  map.setCenter(locationPin);
  map.panBy(0,newPosition)

}