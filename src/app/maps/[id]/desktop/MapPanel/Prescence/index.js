'use client'
import { createPortal } from "react-dom";
import styles from "./styles.module.css"
import { useContext, useEffect } from "react";
import { useOthers ,useMyPresence, shallow} from "@liveblocks/react/suspense";
import DataContext from "@/app/contexts/DataContext";
import lightOrDark from "@/app/lib/lightOrDark";



export default function Prescence({activeDispatch,overrideStyles={},hideOnEditing}) {
  const {user} = useContext(DataContext);

 
  const others = useOthers(
  (others) => others.filter(other =>other.presence.name )

);
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const [myPresence,updateMyPrescence] = useMyPresence(); 

useEffect(()=> {
  if(!user ) return ; 
  updateMyPrescence({
    name: user.name,
    email:user.email,
    isEditing:false,
    color: getRandomColor()
  })
},[user])

const editingUsers = useOthers(
  (others) => others.filter((other) => other.presence.isEditing),
  shallow // 👈
);
const someoneEditing = editingUsers.length > 0;

useEffect(()=> {
  activeDispatch({
    type: "CAN_EDIT",
    canEdit: !someoneEditing
  })
},[someoneEditing])



if(others.length < 1) {
  return false; 
}
if(myPresence.isEditing && hideOnEditing) {
  return false
}

let oColor = undefined; 
if(someoneEditing) {
  oColor = lightOrDark(editingUsers[0].presence.color) == "light"?"black":"white"
}

const editingStyles = {
  background:someoneEditing?editingUsers[0].presence.color:undefined,
  color: oColor,
  borderColor:  oColor
}




return createPortal(<>
  <div style={{...editingStyles, ...overrideStyles}} className={`${styles.prescenceContainer} ${someoneEditing?styles.isEditing:""}`}>
    {someoneEditing? <>{editingUsers[0].presence.name.split(" ")[0]} is editing the map  </>: <>{others.length} other {others.length>1 ? "people":"person's"} in here</> }
  </div>

</>,document.getElementById("prescence-container"))

  
}