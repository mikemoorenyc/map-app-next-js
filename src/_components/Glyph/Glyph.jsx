
import {useState,useEffect,useContext} from "react"
import DataContext from "@/app/contexts/DataContext";
import glyphStringMaker from "@/_lib/glyphStringMaker";


export default function (props) {
  const {layerDispatch} = useContext(DataContext);


  const values = ["w","favorited","color","icon","hasIcon","picker","ld","size"] ;
  const [imgUrl,updateImgUrl ] = useState(null);
  const [imgLoaded,updateImgLoaded] = useState(false);
  const {w, favorited, picker,color,icon,hasIcon,pinId,saveGlyph} = props;
  
  
  let GCloudString = glyphStringMaker(props,"_","__")

  const APIString = glyphStringMaker(props,"=","&")


  const loadDynamicImg = async () => {
    const APIUrl = `/api/glyph?${APIString}`
    updateImgUrl(`/api/glyph?${APIString}`)
    const gcUrl = await fetch("/api/gcUrl",{
      method:"POST",
      body: JSON.stringify({
        path: `${GCloudString}.png`
      })
    })

    if(!gcUrl) return ;
    const {url,fields} = await gcUrl.json();
    if(!url || !fields) return false ; 
    const glyph = await fetch(APIUrl).then(r => r.blob());
    console.log(glyph);
    const file = new File([glyph],`${GCloudString}.png`);
    console.log(file);

    const formData = new FormData();
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value );
    });
    const upload = await fetch(url, {
      method: "POST",
      body: formData,
    });
    if(upload.ok && pinId && saveGlyph) {
      const update = {};
      update[`glyph_${saveGlyph}`] = GCloudString; 
      layerDispatch({type: "UPDATED_PIN",id: pinId, data: update})
    }

   

    



   
    
  }
  useEffect(()=> {
    updateImgLoaded(false);
     updateImgUrl(`https://storage.googleapis.com/${process.env.NEXT_PUBLIC_GCLOUD_BUCKET}/${GCloudString}.png`)
  },[w, favorited, picker,color,icon,hasIcon])
  
  const newStyles = {...props.style || {}, ...{visibility:imgLoaded?"visible":"hidden"}}; 


  const attributes = {...props};
  ["hasIcon","favorited","picker","style","pinId","saveGlyph"].forEach((k)=> {
          delete attributes[k];
    
  })
  
 
 
  return <img
    style={newStyles}
   onError={loadDynamicImg} {...attributes} src={imgUrl} onLoad={()=>{updateImgLoaded(true)}} />

}
///api/glyph