import Button from "@/app/components/Button";
import { NavArrowLeft } from "iconoir-react";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import { useContext } from "react";

export default function BackButton() {
  const {activeData,activeDispatch} = useContext(MobileActiveContext);
  const {backState} = activeData;
  console.log(activeData);
  let fn;
  switch (backState) {
    case "base":
      break ; 
    case "back_to_base": 
      fn = () => {
        activeDispatch({type:"BACK_STATE",state:"base"})
        activeDispatch({type:"DRAWER_STATE",state:"minimized"})
        activeDispatch({type:"SET_ACTIVE_PIN",state:null})
        activeDispatch({type:"LEGEND_OPEN",state: false})
      }
      break; 
    case "back_to_legend":
      fn = () => {
        activeDispatch({type:"LEGEND_OPEN",state: true})
      }
  }

  return <Button onClick={backState=="base"?undefined: (e)=> {
    e.preventDefault(); 
    fn(); 
  }} href={backState == "base"?"/":undefined} icon={<NavArrowLeft />} modifiers={['secondary']} style={{marginRight: 12}}/>
}