import styles from "./styles.module.css";


const DrawerPanelHeader = ({contentOpen, title, before,after}) => {
  const openClass = contentOpen ? styles.contentOpen : "";
  return <div className={`${styles.drawerPanelHeader} ${openClass} flex-center`}>

  {before}
  <div className={`${styles.title} ${openClass} flex-1 overflow-ellipsis`}>{title}</div>
  {after}
  </div>
}


export default DrawerPanelHeader; 