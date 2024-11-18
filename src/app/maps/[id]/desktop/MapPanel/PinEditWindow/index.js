'use client'
import  { useEffect, useContext,  } from "react";

import { InfoWindow } from "@vis.gl/react-google-maps";
import DataContext from "@/app/contexts/DataContext";
import ActiveContext from "@/app/contexts/ActiveContext";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import styles from "./styles.module.css";

const PinEditWindow = ({clickEvent, placeData,state,anchor,closeFunction,outsideClick}) => {

  
    //console.log("window Render");
    const {infoWindowState,infoWindowDispatch } = useContext(InfoWindowContext);
    const {infoWindowAnchor, infoWindowPosition} = infoWindowState;
    const {infoWindowContent} = infoWindowState
    //console.log(infoWindowState);
    const {activeData,activeDispatch} = useContext(ActiveContext)
    const {layerData, layerDispatch} = useContext(DataContext)
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
export default PinEditWindow; 