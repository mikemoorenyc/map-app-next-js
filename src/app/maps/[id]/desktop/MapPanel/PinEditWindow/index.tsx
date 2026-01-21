'use client'
import  { useEffect, useContext, ReactNode, useCallback,  } from "react";

import { InfoWindow, MapMouseEvent } from "@vis.gl/react-google-maps";

import ActiveContext from "@/app/contexts/ActiveContext";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import styles from "./styles.module.css";
import { ClientSideSuspense } from "@liveblocks/react";
import { memo } from "react";

type TProps = {
    clickEvent: MapMouseEvent|null,

}
const InfoWindowMemo = memo(InfoWindow);
const PinEditWindow = ({clickEvent }:TProps) => {

  
     const {activeDispatch} = useContext(ActiveContext);
  
    //console.log("window Render");
    const {infoWindowState,infoWindowDispatch } = useContext(InfoWindowContext);

    const {infoWindowContent} = infoWindowState
    //console.log(infoWindowState);


    const handleClose = () => {
        console.log("run");
        infoWindowDispatch({type:"CLOSE_WINDOW"});
        activeDispatch({
            type:"EDITING_PIN",
            id:null
        })
    }
    
        useEffect(()=> {
        if(!clickEvent) return ; 
        handleClose() ; 
    },[clickEvent])
    


    if(!infoWindowState.infoWindowShown ) return ; 
    return <InfoWindowMemo 
        position={infoWindowState.infoWindowPosition} 
        headerDisabled={true} 
       pixelOffset={[0,-30]}
        onClose={handleClose} >
            <div className={styles.container}>
               {infoWindowContent?.body ||""}  
            </div>


    </InfoWindowMemo>
}
const PinEditWindowMemo = memo(PinEditWindow);
export default PinEditWindowMemo; 