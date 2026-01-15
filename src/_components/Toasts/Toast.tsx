import styles from "./styles.module.css";
import { useEffect, useContext } from "react";
import ToastContext, { TToast } from "@/_contexts/ToastContext";

const Toast = (props:{t:TToast}) => {
  const {t} = props
  const {toastDispatch} = useContext(ToastContext);
  useEffect(()=> {
    const countdown = setTimeout(()=> {
      toastDispatch({type:"REMOVE_TOAST",id:t.id});
      if(t.removeCallback) t.removeCallback(); 
    },6 * 1000)

    return () => {
      clearTimeout(countdown);
    }
  },[])

  return <div className={styles.toast} >
    {t.content}
  </div>
}
export default Toast
//Redeploy
