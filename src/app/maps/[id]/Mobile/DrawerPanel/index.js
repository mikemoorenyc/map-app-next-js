'use client'
import { useContext } from "react";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import DataContext from "@/app/contexts/DataContext";
import Button from "@/app/components/Button";

import ContentPanel from "./ContentPanel";
import DrawerPanelHeader from "./DrawerPanelHeader";
import { useSwipeable } from "react-swipeable";
import styles from "./styles.module.css";
import EditPanel from "./EditPanel";
import { RiListUnordered } from "@remixicon/react";

const DrawerPanel = () => {
  const {pageTitle,mapIcon} = useContext(DataContext)
   const {activeData,activeDispatch} = useContext(MobileActiveContext);
  const {activePin,legendOpen,drawerState} = activeData; 
  let transform  = 100;

  
  if(drawerState == "open") {
    transform = 340;
  }
  if(drawerState == "maximized") {
    transform = window.innerHeight - 40;
  }
  if(drawerState == "editing") {
    transform = window.innerHeight - 10
  }

  if(legendOpen) {
    transform = -3;
  }
  const isEditing = drawerState == "editing"
  
  const handlers =   useSwipeable({
    onSwipedDown: isEditing ? undefined : (e) => {
      if(isEditing) return;
      if(drawerState == "minimized" ) return ; 
     
      if(drawerState == "maximized") {
        activeDispatch({type: "DRAWER_STATE", state: "open"});
        return
      }
      if(drawerState == "open") {
        activeDispatch({type: "DRAWER_STATE", state: "minimized"})
      }
      ;

    },
    onSwipedUp : isEditing ? undefined : (e) => {
      if(!activePin || isEditing) return ; 
      if(drawerState == "maximized") return ;
    
      if(drawerState == "open") activeDispatch({type: "DRAWER_STATE", state: "maximized"});
      if(drawerState == "minimized") activeDispatch({type: "DRAWER_STATE", state: "open"});
  
    },
     preventScrollOnSwipe: true,
     delta: 10,
     swipeDuration: 150
  })

  const transformPosition = {
    transform: `translateY(calc(100% - ${transform}px))`
  }
  
  return <div id="drawer-panel" className={`${styles.drawerPanel} ${activePin && isEditing == false ? styles.swipeable : ""}`} {...handlers}   style={transformPosition}>
    {isEditing && <EditPanel />}
    {(!activePin && isEditing == false)&& <DrawerPanelHeader mapIcon={mapIcon} title={pageTitle} after={<Button icon={<RiListUnordered className="Button-icon"/>} modifiers={["secondary","round","icon"]} onClick={(e)=>{e.preventDefault(); activeDispatch({type:"LEGEND_OPEN",state: true})}}></Button>} />}
    {(activePin && isEditing == false )&& <ContentPanel $transform={transform} pinId={activePin}/>}
  </div>
}

export default DrawerPanel

/*
const DrawerPanel = styled.div`
position:fixed;
left: 0;
top: 0;
width: 100%;
height: 100%;
transform: translateY(100%);
transition: transform .125s;
background:black;
border-top: 1px solid;
border-radius: var(--border-radius);
box-shadow: 0px -3px 0 black;
${({$swipeable}) => $swipeable ? `
  &:before {
    display: block;
    content: "";
    position: absolute;
    border: 1px solid;
    width: 80px;
    height: 6px;
    border-radius: 3px;
    top: 8px;
    left: calc(50% - 40px);
  }


`:""}
*/