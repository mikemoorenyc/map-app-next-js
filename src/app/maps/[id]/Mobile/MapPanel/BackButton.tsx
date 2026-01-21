import Button from "@/app/components/Button";

import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import { useContext } from "react";
import { RiArrowLeftFill } from "@remixicon/react";
import useActiveStore from "@/app/contexts/useActiveStore";

export default function BackButton() {
 // const {activeData,activeDispatch} = useContext(MobileActiveContext);
 // const {backState} = activeData;
  const backState=useActiveStore(s=>s.backState);
  const updateBackState=useActiveStore(s=>s.updateBackState);
  const updateDrawerState=useActiveStore(s=>s.updateDrawerState);
  const updateActivePin=useActiveStore(s=>s.updateActivePin);
  const updateLegendOpen=useActiveStore(s=>s.updateLegendOpen);
  let fn:Function;
  switch (backState) {
    case "base":
      break ; 
    case "back_to_base": 
      fn = () => {
        updateBackState("back");
        updateDrawerState("minimized");
        updateActivePin(null);
        updateLegendOpen(false);
        //activeDispatch({type:"BACK_STATE",state:"base"})
        //activeDispatch({type:"DRAWER_STATE",state:"minimized"})
        //activeDispatch({type:"SET_ACTIVE_PIN",state:null})
        //activeDispatch({type:"LEGEND_OPEN",state: false})
      }
      break; 
    case "back_to_legend":
      fn = () => {
        updateLegendOpen(true);
        //activeDispatch({type:"LEGEND_OPEN",state: true})
      }
  }
  console.log(backState);

  return <Button  onClick={backState=="base"?undefined: (e)=> {
    e.preventDefault(); 
    fn(); 
  }} href={backState == "base"?"/":undefined} icon={<RiArrowLeftFill />} modifiers={['secondary',"icon", "round"]} style={{marginLeft: "var(--gutter)"}}/>
}