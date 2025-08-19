import { useMapsLibrary} from "@vis.gl/react-google-maps"
import { useCallback, useEffect,useState,useRef, useContext } from "react"
import styles from "./styles.module.css";
import Button from "@/app/components/Button";
import { RiCameraLine } from "@remixicon/react";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import DataContext from "@/app/contexts/DataContext";


/*
const uploadPhotos = async (photoArray,pinId,layerDispatch) => {
  const photoUrls = []; 
  for(const photo of photoArray) {
    const photoFilename = `locationPhotos/${pinId}_${photoUrls.length}.jpg`
    const uploadURL  = await fetch("/api/gcUrl",{
      method:"POST",
      body: JSON.stringify({
        path: photoFilename
      })
    })
    if(!uploadURL) {
      console.log(`couldn't get upload url`);
      continue;
    }
    const {url,fields} = await uploadURL.json(); 
    if(!url||!fields) {
      console.log("no url or field",await uploadURL.json());
      continue; 
    }
    console.log(photo);
    const originalPhoto = await fetch(photo).then(r => r.blob());
    console.log(originalPhoto);
    const file = new File([originalPhoto],photoFilename);
    const formData = new FormData();
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value );
    });
    const upload = await fetch(url, {
      method: "POST",
      body: formData,
    });
    if(upload.ok) {
       photoUrls.push(`https://storage.googleapis.com/${process.env.NEXT_PUBLIC_GCLOUD_PHOTOS}/${photoFilename}`);
    }

  }
  layerDispatch({
    type:"UPDATED_PIN",
    id:pinId,
    data: {
      photos: photoUrls,
      photosUploaded: new Date().toLocaleString()
    }
  })

}
*/

export default function({id,temp}) {
  const [photos,updatePhotos] = useState([]);
  const [photosShown,updatePhotosShown] = useState(false);
  const {activeDispatch} = useContext(MobileActiveContext);
  const {layerDispatch} = useContext(DataContext)
 
  const places = useMapsLibrary('places');
 // const savedPhotos = JSON.parse(sessionStorage.getItem("saved_photos") || "[]");



  const findPhotos = useCallback(async (id)=> {
    if(!places) return ;
    const newPlace = new places.Place({id});
    await newPlace.fetchFields({fields:["photos"]});
    const photos = newPlace.photos; 
    if(!photos || !photos.length) return ; 
    const photoArray = newPlace.photos.map(p => {return {uri:p.getURI(),w:p.widthPx,h:p.heightPx}})
    updatePhotos(photoArray);
    if(!temp) {
     // uploadPhotos(photoArray,id,layerDispatch);
    }
   /* const newSaved = [...savedPhotos, ...[{id:id,photos:photoArray}]];
    sessionStorage.setItem("saved_photos",JSON.stringify(newSaved)); */

  },[places,updatePhotos])





  useEffect(()=> {
 
    //CLEAR PHOTOS ON ID CHANGE
    updatePhotos([]);
    updatePhotosShown(false);
   
    /*const saved = savedPhotos.find(p=>p.id==id);
    if(saved) {
      updatePhotos(saved.photos);
      return ; 
    }*/
   // findPhotos(id) 
  },[id])

  const showPhotos = () => {
    updatePhotosShown(true);
    activeDispatch({
      type:"DRAWER_STATE",
      state:"maximized"
    })
    findPhotos(id);
  }
 
 // if(photos.length < 1) return ;
 if(!id || typeof id !== "string" ) return ; 

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

