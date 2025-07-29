import styles from "./styles.module.css";
import svgImgUrl from "@/app/lib/svgImgUrl";

const DrawerPanelHeader = ({mapIcon,contentOpen, title, before,after}) => {
  const openClass = contentOpen ? styles.contentOpen : "";
  return <div className={`${styles.drawerPanelHeader} ${openClass} flex-center`}>

  {before}
  <div className={`${styles.title} ${openClass} flex-1 overflow-ellipsis flex-center`}>
    {mapIcon && <img src={svgImgUrl({icon:mapIcon,picker:true})} width={28} height={28} style={{marginRight:8}}/> }
    <span>{title}</span>
  </div>
  {after}
  </div>
}


export default DrawerPanelHeader; 