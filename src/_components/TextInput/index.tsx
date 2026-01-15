import { ChangeEvent, CSSProperties, forwardRef, KeyboardEvent, RefObject, SyntheticEvent } from "react";
import styles from "./styles.module.css"


type TProps = {
  modifiers?:string[],
  type:"input"|"text"
  style?:CSSProperties|undefined,
  name:string,
  onChange:(e:ChangeEvent<HTMLInputElement>)=>void,
  onKeyDown?:(e:KeyboardEvent)=>void,
  value?:string, 
  onBlur?:(e:SyntheticEvent)=>void,
  placeholder?:string, 
  className?:string
}

const TextInput = forwardRef<HTMLInputElement, TProps>((props,ref) => {
  //if(!ref) return false; 
  const {modifiers=[],type="input",style,name, onChange, onKeyDown,value,onBlur,placeholder, className} = props
  const modClasses = modifiers.map(m=>styles[m]).join(" ");
  return <input 

    {...{style,type,name,onChange,onKeyDown,value,onBlur,placeholder,ref}}
    className={`${styles.input}  ${modClasses} ${className || ""}`}
  />
})

export default TextInput; 