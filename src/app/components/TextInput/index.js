import { forwardRef } from "react";
import styles from "./styles.module.css"


const TextInput = forwardRef((props,ref) => {
  const {modifiers=[],type="input",style=null,name, onChange, onKeyDown,value,onBlur} = props
  const modClasses = modifiers.map(m=>styles[m]).join(" ");
  return <input 
    style={style}
    type={type}
    ref={ref || undefined}
    value={value}
    name={name}
    onChange={onChange||undefined}
    onKeyDown={onKeyDown||undefined}
    onBlur= {onBlur || undefined}
    className={`${styles.input} ${!modifiers.includes("smaller")? 'big-drop-shadow':""} ${modClasses}`}
  />
})

export default TextInput; 