'use client'
import  { useEffect, useContext,  } from "react";

import { InfoWindow, MapMouseEvent } from "@vis.gl/react-google-maps";

import ActiveContext from "@/app/contexts/ActiveContext";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import styles from "./styles.module.css";
import { ClientSideSuspense } from "@liveblocks/react";

type TProps = {
    clickEvent: MapMouseEvent|null
}

const PinEditWindow = ({clickEvent, }:TProps) => {

  
    //console.log("window Render");
    const {infoWindowState,infoWindowDispatch } = useContext(InfoWindowContext);

    const {infoWindowContent} = infoWindowState
    //console.log(infoWindowState);
    const {activeData,activeDispatch} = useContext(ActiveContext)

    const handleClose = () => {
        infoWindowDispatch({type:"CLOSE_WINDOW"});
        activeDispatch({type:"EDITING_PIN",id:null})
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