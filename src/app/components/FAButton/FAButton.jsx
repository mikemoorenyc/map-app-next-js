import Button from "@/app/components/Button";
import styles from "./FAButtonStyles.module.css";


export default function ({className="",onClick,icon,href,children,target})  {
  return <Button onClick={onClick} icon={icon} modifiers={['raised',"md","pill"]} className={`${styles.FAButton} ${className}`} >{children}</Button>
}