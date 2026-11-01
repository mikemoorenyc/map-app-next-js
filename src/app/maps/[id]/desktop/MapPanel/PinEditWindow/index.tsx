'use client'
import  { useEffect, useContext,  memo, ReactNode, useCallback} from "react";

import { InfoWindow, MapMouseEvent } from "@vis.gl/react-google-maps";

import ActiveContext from "@/app/contexts/ActiveContext";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import styles from "./styles.module.css";
import { ClientSideSuspense } from "@liveblocks/react";
import { TGeolocation } from "@/projectTypes";

type TProps = {
    clickEvent: MapMouseEvent|null
}

const WindowMemo = memo(({ position, content, handleClose }: {
  position: TGeolocation|null,
  content: ReactNode,
  handleClose:Function
}) => {


  return <InfoWindow
      position={position}
      headerDisabled={true}
     pixelOffset={[0,-30]}
    >
          <div className={styles.container}>

              {content ||""}
          </div>


  </InfoWindow>
})

const PinEditWindow = ({clickEvent, }:TProps) => {


    //console.log("window Render");
    const {infoWindowState,infoWindowDispatch } = useContext(InfoWindowContext);


    //console.log(infoWindowState);
    const {activeDispatch} = useContext(ActiveContext)

    const handleClose = useCallback(() => {
          console.log("handle close")
          infoWindowDispatch({type:"CLOSE_WINDOW"});
          activeDispatch({type:"EDITING_PIN",id:null})
      }
, [activeDispatch,infoWindowDispatch])


    useEffect(()=> {
        if(!clickEvent) return ;
        handleClose() ;
    }, [clickEvent])





  return <>{infoWindowState.infoWindowShown&& <WindowMemo
    {...{handleClose,content:infoWindowState.infoWindowContent.body,position:infoWindowState.infoWindowPosition}}
  />}</>
}
export default (props:TProps) => <ClientSideSuspense fallback={<></>}><PinEditWindow {...props} /></ClientSideSuspense>
