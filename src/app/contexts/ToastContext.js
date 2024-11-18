'use client'
import { useReducer, createContext} from "react";

const ToastContext = createContext()

const ToastContextProvider = ({children}) => {
    
  const initState = {
    toasts : []
  }
  const toastUpdater = (toastState,action) => {
    console.log(toastState);
    switch(action.type) {
      case  "ADD_TOAST": {
        const newToasts = [...toastState.toasts, ...[action.toast]];
        console.log(newToasts);
        return {...toastState, ...{toasts: newToasts}}
      }
      case "REMOVE_TOAST" : {
        return {...toastState, ...{toasts: toastState.toasts.filter(t => t.id != action.id)}}
      }
    }

  }

  const [toastState, toastDispatch] = useReducer(toastUpdater, initState);
  return (
    <ToastContext.Provider value={{toastState,toastDispatch}}>
      {children}
    </ToastContext.Provider>
  );
}
export default ToastContext
export {ToastContextProvider,ToastContext}