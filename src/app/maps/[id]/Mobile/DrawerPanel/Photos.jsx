import { useMapsLibrary} from "@vis.gl/react-google-maps"
import { useCallback, useEffect,useState,useRef, useContext } from "react"
import styles from "./styles.module.css";
import Button from "@/app/components/Button";
import { RiCameraLine } from "@remixicon/react";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";

export default function({id}) {
  const [photos,updatePhotos] = useState([]);
  const [photosShown,updatePhotosShown] = useState(false);
  const {activeDispatch} = useContext(MobileActiveContext);
 
  const places = useMapsLibrary('places');
  const savedPhotos = JSON.parse(sessionStorage.getItem("saved_photos") || "[]");



  const findPhotos = useCallback(async (id)=> {
    if(!places) return ;
    const newPlace = new places.Place({id});
    await newPlace.fetchFields({fields:["photos"]});
    const photos = newPlace.photos; 
    if(!photos || !photos.length) return ; 
    const photoArray = newPlace.photos.map(p => {return {uri:p.getURI(),w:p.widthPx,h:p.heightPx}})
    updatePhotos(photoArray);
    const newSaved = [...savedPhotos, ...[{id:id,photos:photoArray}]];
    sessionStorage.setItem("saved_photos",JSON.stringify(newSaved));

  },[places,updatePhotos])



  useEffect(()=> {
    //CLEAR PHOTOS ON ID CHANGE
    updatePhotos([]);
    updatePhotosShown(false);
    if(!id || typeof id !== "string" ) return ; 
    const saved = savedPhotos.find(p=>p.id==id);
    if(saved) {
      updatePhotos(saved.photos);
      return ; 
    }
    findPhotos(id) 
  },[id])

  const showPhotos = () => {
    updatePhotosShown(true);
    activeDispatch({
      type:"DRAWER_STATE",
      state:"maximized"
    })
  }
 
  if(photos.length < 1) return ;

  if(!photosShown ) {
    return <Button onClick={showPhotos} icon={<RiCameraLine />}>See photos</Button>
  }


return <div className={styles.containerFlex}>
<div className={`${styles.spacer} ${styles.front}`} />
   {photos.map(p => 
    <img key={p.uri}  src={`${p.uri}&maxWidthPx=700`}  className={styles.imgFlex}/>
 )}
<div className={styles.spacer} />
</div>


/*
  return <>
  <style jsx global>{`
  :root {
    --container-height: ${containerHeight}px
  }
  `}</style>
  <div className={styles.photoOuter} ref={containerRef}>{photos.length !== 0 && <Slider {...sliderSettings}>

  {photos.map(p => 
    <div className={styles.photo}><img  key={p.uri}src={`${p.uri}&maxWidthPx=700`} width={p.w} height={p.h} className={styles.img}/></div>
 )}
  </Slider>}
  </div>
  
  
  </>
  */

}

