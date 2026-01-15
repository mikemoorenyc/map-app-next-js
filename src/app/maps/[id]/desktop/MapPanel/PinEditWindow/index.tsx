'use client'
import  { useEffect, useContext,  } from "react";

import { InfoWindow, MapMouseEvent } from "@vis.gl/react-google-maps";


import InfoWindowContext from "@/_contexts/InfoWindowContext";
import styles from "./styles.module.css";
import { ClientSideSuspense } from "@liveblocks/react";
import useActiveStore from "@/_contexts/useActiveStore";

type TProps = {
    clickEvent: MapMouseEvent|null,

}

const PinEditWindow = ({clickEvent}:TProps) => {
    const updateEditingPin = useActiveStore(s=>s.updateEditingPin)
  
    //console.log("window Render");
    const {infoWindowState,infoWindowDispatch } = useContext(InfoWindowContext);

    const {infoWindowContent} = infoWindowState
    //console.log(infoWindowState);


    const handleClose = () => {
        infoWindowDispatch({type:"CLOSE_WINDOW"});
        updateEditingPin(null);
    }
    
   
   
    useEffect(()=> {
        if(!clickEvent) return ; 
        handleClose() ; 
    },[clickEvent])



    return <>{infoWindowState.infoWindowShown && <InfoWindow 
        position={infoWindowState.infoWindowPosition} 
        headerDisabled={true} 
       pixelOffset={[0,-30]}
        onClose={handleClose} >
            <div className={styles.container}>
                
                {infoWindowContent?.body ||""}  
            </div>


    </InfoWindow>}</>
}
export default (props:TProps) => <ClientSideSuspense fallback={<></>}><PinEditWindow {...props} /></ClientSideSuspense>