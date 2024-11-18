import  { useContext } from "react" 
import { Xmark } from "iconoir-react";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import ActiveContext from "@/app/contexts/ActiveContext";
import styles from "./styles.module.css";

const InfoWindowHeader = ({children}) => {
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
              <Xmark />
          </button>
      </div>
  </div>
}
export default InfoWindowHeader