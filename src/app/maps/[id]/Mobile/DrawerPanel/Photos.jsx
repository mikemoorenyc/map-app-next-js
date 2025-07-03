import { useMapsLibrary} from "@vis.gl/react-google-maps"
import { useCallback, useEffect,useState,useRef } from "react"
import styles from "./styles.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function({id,drawerState}) {
  const [photos,updatePhotos] = useState([]);
  const containerRef = useRef(null);
  const [containerHeight, updateContainerHeight] = useState(0);

 
  const places = useMapsLibrary('places');
  const savedPhotos = JSON.parse(sessionStorage.getItem("saved_photos") || "[]");
  const sliderSettings = {
    variableWidth: true, 
    dots:false,
    arrows: false, 
    infinite:false, 
    centerMode: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: styles.photoContainer
  }
 


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
  },[id])
  useEffect(()=> {
    if(!photos.length && containerRef) {
  
      updateContainerHeight(containerRef.current.offsetHeight)
    }

  },[photos])
  
  useEffect(()=> {
    if(drawerState !== "maximized") return; 
    //Photos already loaded 
    if(photos.length ) return ;
    if(!id || typeof id !== "string" ) return ; 
    const saved = savedPhotos.find(p=>p.id==id);
    if(saved) {
      updatePhotos(saved.photos);
      return ; 
    }
    findPhotos(id) 


  },[drawerState])
  useEffect(()=> {
    if(!containerRef) return ; 
   
    updateContainerHeight(containerRef.current.offsetHeight);

  

  },[containerRef])




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

}

