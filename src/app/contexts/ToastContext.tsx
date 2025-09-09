'use client'
import { useReducer, createContext, ReactElement} from "react";

export type TToast = {
  id:number, 
  content: string,
  removeCallback?:Function
}
enum UserActions {
  ADD_TOAST = "ADD_TOAST",
  REMOVE_TOAST = "REMOVE_TOAST"
}
type UserAction = |
  {type:UserActions.ADD_TOAST; toast:TToast}|
  {type:UserActions.REMOVE_TOAST; id:number}




const ToastContext = createContext<{toastState:{toasts:TToast[]},toastDispatch:Function}>({
  toastState:{toasts:[]},
  toastDispatch:()=>{}
})

const ToastContextProvider = ({children}:{children:ReactElement}) => {
    
  const initState : {
    toasts: TToast[]
  } = {
    toasts  : []
  } 
    
  const toastUpdater = (toastState:{toasts:TToast[]},action:UserAction) => {
    console.log(toastState);
    switch(action.type) {
      case  UserActions.ADD_TOAST: {
        const newToasts = [...toastState.toasts, ...[action.toast]];
        console.log(newToasts);
        return {...toastState, ...{toasts: newToasts}}
      }
      case UserActions.REMOVE_TOAST : {
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