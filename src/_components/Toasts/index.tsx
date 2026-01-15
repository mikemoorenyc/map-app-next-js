'use client'
import  { useContext} from "react";
import ToastContext from "@/_contexts/ToastContext";
import Toast from "./Toast";
import styles from "./styles.module.css"




const Toasts =  () => {
  const {toastState,toastDispatch} = useContext(ToastContext);
  return <div className={styles.toastContainer}>
    {toastState.toasts.map(t => {
     
      return <Toast t={t} key={t.id} />
      
    })
    }
  
  </div>

};


export default Toasts