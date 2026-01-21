
import { useCallback, useEffect,useState, useContext } from "react"
import styles from "./styles.module.css";
import Button from "@/app/components/Button";
import MobileActiveContext, { TempData } from "@/app/contexts/MobileActiveContext";
import DataContext from "@/app/contexts/DataContext";
import GMIcon from "./GMIcon";
import TAIcon from "./TAIcon";
import Image from "next/image";
import makeNativeLink from "../lib/makeNativeLink";
import { TPin,TPhoto } from "@/projectTypes";
import useLiveEditing from "@/app/lib/useLiveEditing";
import useActiveStore from "@/app/contexts/useActiveStore";


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

const PhotoUploader = ({pinId}:{photos:TPhoto[],status:string,pinId:string|number})=> {
  const dispatchEvent = useLiveEditing(); 
 
  

  useEffect(()=> {
    const uploadPhotos = (event:CustomEvent) => {
      dispatchEvent([{
      type: "UPDATED_PIN",
      id: pinId,
      data : {
        photos : event.detail.photos,
        photos_uploaded: new Date().toLocaleString()
      }
    }])
    }
    window.addEventListener("upload_photos",uploadPhotos as EventListener);

    return () => {
      window.removeEventListener("upload_photos",uploadPhotos as EventListener)
    }
  },[])

  return <></>



}

export default function({id,temp,pin}:{id:number|string,temp:boolean,pin:TPin|TempData}) {
  const [photos,updatePhotos] = useState<TPhoto[]>([]);
  const updateDrawerState = useActiveStore(s=>s.updateDrawerState); 

  const [fetchStatus, updateFetchStatus] = useState("idle");
  
  const {nonEditing,layerDispatch} = useContext(DataContext);
 

  const getPhotos = useCallback(async (pin:TPin|TempData) => {
    const search = await fetch(`/api/tripadvisor?title=${pin.title}&coords=${pin.location.lat},${pin.location.lng}&addr=${pin.formatted_address}`);
    updateFetchStatus("loaded")
    if(!search.ok) {
      return ; 
    }
    const {photos} = await search.json(); 
    console.log(photos[0]);
    updatePhotos(photos);
    if(temp) {
      return ; 
    }
    layerDispatch({
      type:"UPDATED_PIN",
      id:id,
      data: {
        photos,
        photos_uploaded: new Date().toLocaleString() 
      }
    })
    const uploadPhotos = new CustomEvent("upload_photos",{
      detail: {
        photos
      }
    })
    window.dispatchEvent(uploadPhotos);
    /*
    dispatchEvent([{
      type: "UPDATED_PIN",
      id: pin.id,
      data : {
        photos : photos,
        photos_uploaded: new Date().toLocaleString()
      }
    }])
    */

  },[updateFetchStatus,updatePhotos])

useEffect(()=> {

  updatePhotos([]);
   updateFetchStatus("idle");
  if(!pin.id||typeof id !== "string") return ; 
  if(pin.photos) {
    updateFetchStatus("loaded");
    updatePhotos(pin.photos);
  }
},[pin])


/*
  useEffect(()=> {
 
    //CLEAR PHOTOS ON ID CHANGE
    updatePhotos([]);
    updatePhotosShown(false);
   

  },[id])

  const showPhotos = () => {
    updatePhotosShown(true);
    activeDispatch({
      type:"DRAWER_STATE",
      state:"maximized"
    })
    findPhotos(id);
  }*/
 
 // if(photos.length < 1) return ;
 const showPhotos = () => {
  updateFetchStatus("loading");
  updateDrawerState("maximized")

  getPhotos(pin);

 }
 if(!id || typeof id !== "string" ) return ; 

  if(fetchStatus == "idle" ) {
    return <Button icon={<TAIcon />} onClick={showPhotos} >Find photos on Tripadvisor</Button>
  }

const photoFallback = photos.map(p=>{
  if(typeof p !== "string") {
    return p;
  }
  return {
    url: p,
    width: null,
    height: null
  }
})

return <div className={styles.containerFlex}>
  {(!nonEditing && !temp) && <PhotoUploader status={fetchStatus} photos={photos} pinId={id} />}
<div className={`${styles.spacer} ${styles.front}`} />
   {photoFallback.map(p => 
    <img key={p.url} width={p.width||undefined} height={p.height||undefined}  src={`${p.url}`}  className={styles.imgFlex}/>
 )}
 <a target="_blank" href={pin.url?makeNativeLink(pin.url):""} className={`${styles.imgFlex} ${styles.imgPlaceHolder}`}>
  <img src={"/pho-spacer.png"} alt={"Loading Spacer"} width="200"height="500"/>
  <div className={`${styles.placeholderText } flex-center-center`}>
    <div className={styles.placeholderTextInner}>
      {fetchStatus == "loaded" && <span className={`${styles.phicon} flex-center-center`}>
        <GMIcon />
      </span>} 
      <span className={styles.phText}>
        {fetchStatus == "loading" && <>Finding photos</>}
        {fetchStatus=="loaded" && <>
          {photos.length < 1 && <>No photos<br/></>}
          Check Google for more photos
        </>}
      </span>
      {fetchStatus == "loading" && <div className={styles.loaderHolder}>
        <span className={styles.photoLoader}></span>
      </div>}
    
    </div>
  </div>
 </a>
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