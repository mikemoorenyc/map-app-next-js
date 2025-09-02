'use client'
import { createPortal } from "react-dom";
import styles from "./styles.module.css"
import { useContext, useEffect } from "react";
import { useOthers ,useMyPresence, shallow} from "@liveblocks/react/suspense";
import DataContext from "@/app/contexts/DataContext";
import ActiveContext from "@/app/contexts/ActiveContext";


export default function Prescence() {
  const {user} = useContext(DataContext);
 const {activeData,activeDispatch} = useContext(ActiveContext);
 const {canEdit}= activeData
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





return createPortal(<>
  <div className={`${styles.prescenceContainer} ${someoneEditing?styles.isEditing:""}`}>
    {someoneEditing? <>{editingUsers[0].presence.name.split(" ")[0]} is editing the map  </>: <>{others.length} other {others.length>1 ? "people":"person's"} in here</> }
  </div>

</>,document.getElementById("prescence-container"))

  
}