
import styles from "./styles.module.css";
import makeNativeLink from "@/app/maps/[id]/Mobile/lib/makeNativeLink";
import { RiPhoneLine, RiSafariLine, } from "@remixicon/react";
import { Suspense,lazy ,ReactNode} from "react";
import ItemRow from "./ItemRow";
import { TPin, TPlaceDetails } from "@/projectTypes";

const OpenOrClosed = lazy(()=>import("./OpenOrClosed"))

type TProps = {
    placeData:TPlaceDetails,
    isMobile?:boolean,
    inBounds?:boolean
}


const LocationDetails =  ({placeData,isMobile,inBounds}:TProps) => {
    const {website,formatted_address,international_phone_number,url} = placeData
  

    return <div className={styles.locationDetails}>
        {inBounds && process.env.NODE_ENV !== "development" && <Suspense><OpenOrClosed  placeData={placeData} /></Suspense>}
        
        {formatted_address && <ItemRow>{formatted_address}</ItemRow>}
        {international_phone_number && <ItemRow>
            <div className="LocationDetails-item-icon"><RiPhoneLine className={styles.svg} /></div> <a href={`tel:${international_phone_number}`}>{international_phone_number}</a>
        </ItemRow>}
        {website && <ItemRow>
            <div className="LocationDetails-item-icon"><RiSafariLine className={styles.svg}/></div> <a className={"overflow-ellipsis flex-1"} href={website} target="_blank">{website}</a>
        </ItemRow>}
        {url && <ItemRow><a href={isMobile ? makeNativeLink(url) : url} target="_blank">View in Google Maps</a></ItemRow>}
      

    
    </div>
}
export default LocationDetails; 
