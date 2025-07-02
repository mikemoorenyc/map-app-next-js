import { useMapsLibrary} from "@vis.gl/react-google-maps"
import { useCallback, useEffect,useState } from "react"
import styles from "./styles.module.css";
export default function({id}) {
  const [photos,updatePhotos] = useState([]);
 
  const places = useMapsLibrary('places');
  const savedPhotos = JSON.parse(sessionStorage.getItem("saved_photos") || "[]");


  const findPhotos = useCallback(async (id)=> {
    if(!places) return ;
    const newPlace = new places.Place({id});
    await newPlace.fetchFields({fields:["photos"]});
    const photos = newPlace.photos; 
    if(!photos || !photos.length) return ; 
    const photoArray = newPlace.photos.map(p => p.getURI())
    updatePhotos(photoArray);
    const newSaved = [...savedPhotos, ...[{id:id,photos:photoArray}]];
    sessionStorage.setItem("saved_photos",JSON.stringify(newSaved));

  },[places,updatePhotos])



  useEffect(()=> {
    updatePhotos([]);

    if(!id || typeof id !== "string" ) return ; 
    const saved = savedPhotos.find(p=>p.id==id);
    if(saved) {
      updatePhotos(saved.photos);
      return ; 
    }
    findPhotos(id)

  },[id])

  if(!photos.length) return ; 


  return <div className={styles.photoContainer}>
  {photos.map(p => <img key={p} src={p} className={styles.photo}/>)}
  </div>

}