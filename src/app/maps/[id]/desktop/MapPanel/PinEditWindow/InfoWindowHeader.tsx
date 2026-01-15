import  { ReactNode, useContext } from "react" 

import InfoWindowContext from "@/_contexts/InfoWindowContext";
import ActiveContext from "@/_contexts/ActiveContext";
import styles from "./styles.module.css";
import { RiCloseLine } from "@remixicon/react";

const InfoWindowHeader = ({children}:{children:ReactNode}) => {
  const {infoWindowDispatch} = useContext(InfoWindowContext);
  const {activeDispatch} = useContext(ActiveContext);
  const handleClose = () => {
    infoWindowDispatch({type:"CLOSE_WINDOW"});
  activeDispatch({type:"EDITING_PIN",id:null})  
  }

  return <div className="header display-flex">
      <div className={styles.title}>
         {children}
      </div>
      <div className="PinEditWindow-close">
          <button className={styles.closeButton} onClick={(e)=>{e.preventDefault; handleClose()}} >
              <RiCloseLine/>
          </button>
      </div>
  </div>
}
export default InfoWindowHeader