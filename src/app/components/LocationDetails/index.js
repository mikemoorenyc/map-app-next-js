import { Phone, Safari } from "iconoir-react"
import styles from "./styles.module.css";
import makeNativeLink from "@/app/maps/[id]/Mobile/lib/makeNativeLink";

const ItemRow = ({children}) => (
  <div className={`${styles.item} flex-center`}>
  {children}
  </div>
)

const LocationDetails =  ({placeData,isMobile}) => {
    const {website,name,formatted_address,international_phone_number,url,geometry} = placeData
  

    return <div className={styles.locationDetails}>

        {formatted_address && <ItemRow>{formatted_address}</ItemRow>}
        {international_phone_number && <ItemRow>
            <div className="LocationDetails-item-icon"><Phone className={styles.svg} /></div> <a href={`tel:${international_phone_number}`}>{international_phone_number}</a>
        </ItemRow>}
        {website && <ItemRow>
            <div className="LocationDetails-item-icon"><Safari className={styles.svg}/></div> <a className={"overflow-ellipsis flex-1"} href={website} target="_blank">{website}</a>
        </ItemRow>}
        {url && <ItemRow><a href={isMobile ? makeNativeLink(url) : url} target="_blank">View in Google Maps</a></ItemRow>}
      

    
    </div>
}
export default LocationDetails; 
