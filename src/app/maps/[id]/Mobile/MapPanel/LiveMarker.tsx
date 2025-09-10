import { ClientSideSuspense,useMyPresence,useOthers} from "@liveblocks/react/suspense";
import { AdvancedMarker,Pin } from "@vis.gl/react-google-maps";
import lightOrDark from "@/app/lib/lightOrDark";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import { useEffect,useContext ,useMemo} from "react";
import { TGeolocation } from "@/projectTypes";

type Props = {
  color:string ,
  glyph:string, 
  geolocation:TGeolocation,
  scale?:number, 
  zIndex?:number
}
const StaticMarker = ({color,glyph,geolocation,scale=.7,zIndex=3}:Props) => {
  const outlineColor = useMemo(()=>{return lightOrDark(color) == "light"? "#000000" : "#ffffff"},[color]);
  return <AdvancedMarker position={geolocation} zIndex={zIndex}>
    <Pin borderColor={outlineColor} glyph={glyph} scale={scale} background={color} glyphColor={outlineColor}/>
  </AdvancedMarker>
}


const LiveMarker = ({geolocation}:{geolocation:TGeolocation}) => {
  const [myPresence,updateMyPrescence] = useMyPresence(); 
  const others = useOthers(
    (others) => others.filter(other =>other.presence.geolocation )

  );

  if(!geolocation) return false; 

  useEffect(()=> {
    updateMyPrescence({
      geolocation
    })
  },[geolocation]);

  

  return <>
    {myPresence.name && myPresence.geolocation&&<StaticMarker scale={.75} color={"#000000"} zIndex={4} glyph={myPresence.name.charAt(0)} geolocation={myPresence.geolocation}/>}
  {others.map(o=> {
    if(!o.presence.geolocation) {
      return false;
    }
      return <StaticMarker key={o.connectionId} color={o.presence.color} glyph={o.presence.name.charAt(0)} geolocation={o.presence.geolocation} />
  })}
  
  </>




 
}

export default (props:{geolocation:TGeolocation}) => <ClientSideSuspense fallback={<></>}><LiveMarker {...props} /></ClientSideSuspense>