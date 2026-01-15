'use client'
import styles from "./styles.module.css"
import { CSSProperties, useContext, useEffect, useState } from "react";
import { useOthers ,useMyPresence, shallow} from "@liveblocks/react/suspense";
import DataContext from "@/_contexts/DataContext";
import lightOrDark from "@/_lib/lightOrDark";
import PortalContainer from "@/_components/PortalContainer/PortalContainer";
import { User } from "@liveblocks/node";


type TProps = {
  updateCanEdit:(c:boolean)=>void,
  overrideStyles?: CSSProperties,
  hideOnEditing?:boolean,
  openDirection?:"top"|"bottom"
}


export default function Prescence({updateCanEdit,overrideStyles={},hideOnEditing,openDirection="top"}:TProps) {
  const {user} = useContext(DataContext);
  const [peopleListOpen,updatePeopleListOpen] = useState(false); 


 
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

  updateCanEdit(!someoneEditing);
  
},[someoneEditing])
useEffect(()=> {
  updatePeopleListOpen(false);
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

const editingStyles: CSSProperties = {
  background:someoneEditing?editingUsers[0].presence?.color:undefined,
  color: oColor,
  borderColor:  oColor
}





return <PortalContainer containerId="prescence-container">
<>
  {(someoneEditing||!peopleListOpen) && <div onClick={()=>{updatePeopleListOpen(!peopleListOpen)}} style={{...editingStyles, ...overrideStyles}} className={`${styles.prescenceContainer} ${someoneEditing?styles.isEditing:""}`}>
    {someoneEditing? <>{editingUsers[0].presence.name.split(" ")[0]} is editing the map  </>: <>{others.length} other {others.length>1 ? "people":"person's"} in here</> }
   
  </div>}
  </>
  <>
  {(!someoneEditing && peopleListOpen)&& <PeopleList {...{others,openDirection,overrideStyles}} closeFunction={()=>{updatePeopleListOpen(false)}}/>}

  </>

</PortalContainer>

  
}
const PeopleList = ({others,closeFunction,openDirection,overrideStyles}:{others:User[],closeFunction:()=>void,openDirection:"top"|"bottom";overrideStyles?:CSSProperties}) => {
  useEffect(()=> {
    const countdown = setTimeout(()=> {
      console.log("close");
      closeFunction(); 
    },4000)
    return () => {
      clearTimeout(countdown);
    }
  },[])


  return <ul style={overrideStyles} className={`${styles.prescenceContainer} ${styles.peopleList} ${openDirection == "top"?styles.top:styles.bottom}`} onClick={()=>{closeFunction}}>{others.map(other => {
      return <Person key={other.presence.email} {...{other,closeFunction}}/>
    })}
  </ul>
} 
const Person = ({other,closeFunction}:{other:User,closeFunction:()=>void}) => {
  const style= {
    background: other.presence.color,
    color: lightOrDark(other.presence.color) == "light"?"black":"white",
    borderColor: lightOrDark(other.presence.color) == "light"?"black":"white"
  }
  return <li onClick={()=>{closeFunction()}} className={`list-style-none ${styles.peoplePill}`} {...{style}}>{other.presence.name.split(" ")[0]}</li>
}