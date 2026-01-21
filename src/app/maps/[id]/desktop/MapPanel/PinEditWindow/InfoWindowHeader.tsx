import  { ReactNode, useContext } from "react" 

import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import ActiveContext from "@/app/contexts/ActiveContext";
import styles from "./styles.module.css";
import { RiCloseLine } from "@remixicon/react";

const InfoWindowHeader = ({children,closeEvent}:{children:ReactNode,closeEvent?:()=>void}) => {
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