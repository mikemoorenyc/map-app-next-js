import { ReactNode } from "react";
import styles from "./styles.module.css"
const ItemRow = ({children,className=""}:{children:ReactNode,className?:string}) => (
  <div className={`${className} ${styles.item} flex-center`}>
  {children}
  </div>
)

export default ItemRow;