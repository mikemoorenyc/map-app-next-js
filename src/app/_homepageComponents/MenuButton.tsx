import Button, { TModOptions } from "../components/Button";
import DropDown from "../components/DropDown/DropDown";
import BottomSheet from "../components/BottomSheet/BottomSheet";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Modal from "../maps/[id]/sharedComponents/Modal";
import { useState,useRef,useEffect } from "react";
import DropDownItem from "../components/DropDown/DropDownItem";
import { RiArchiveLine,RiDeleteBinLine,RiArrowUpCircleLine,RiArrowDownCircleLine,RiMore2Fill } from "@remixicon/react";
import { THomepageMap } from "@/projectTypes";
import { THomepageMapActions } from "../PageClient";

export type TMenuButtonProps = {
  mapData:THomepageMap,
  modifiers?:TModOptions[],
  containerClasses?:string, 
  top?:boolean, 
  bottom?:boolean,
  archived?:boolean,
  actions: THomepageMapActions
}


export default function MenuButton ({mapData,modifiers=[],containerClasses,top,bottom, archived=false,actions}:TMenuButtonProps) {
  const [dropDownOpen,updateDropDownOpen] = useState(false);
  const dropDownAnchor = useRef<HTMLDivElement>(null);
  const [isMobile,updateIsMobile] = useState(false);
  useEffect(()=> {
    updateIsMobile(window.innerWidth < 600)
  },[])
  const closeCallback = ()=>{updateDropDownOpen(false)}
  const [deletePending,updateDeletePending] = useState(false);
  const [deletedId, updateDeleteId] = useState<null|number>(null);

  
  
  const DropDownOptions = () => <>
    <DropDownItem 
      icon={<RiArchiveLine />} 
      mobile={isMobile}
      onClick={()=> {
        closeCallback(); 
        
        actions.archive(mapData.id,!archived);
        
      }}
      >
        <>{archived? "Una":"A"}rchive map</>
    </DropDownItem>

    <DropDownItem
      onClick={()=> {
        
        closeCallback();
        updateDeletePending(true);
        updateDeleteId(mapData.id);
      }}
    
     state={"caution"} icon={<RiDeleteBinLine />} mobile={isMobile}><>Delete map</></DropDownItem>
      {top !== undefined && <DropDownItem
      onClick={() => {
        closeCallback(); 
        actions.move(mapData.id, true)
      }}
     icon={<RiArrowUpCircleLine />} state={top ? "disabled":undefined} mobile={isMobile}>Move up</DropDownItem>}
    {bottom !== undefined && <DropDownItem onClick={()=> {
      closeCallback(); 
      actions.move(mapData.id,false);
    }} icon={<RiArrowDownCircleLine />}mobile={isMobile} state={bottom ? "disabled":undefined}>Move down</DropDownItem>}
  </>

  return <>
  <div ref={dropDownAnchor} className={containerClasses}>
      <Button icon={<RiMore2Fill/>}  onClick={(e)=>{console.log("click"); updateDropDownOpen(!dropDownOpen)}} modifiers={modifiers} />
  </div>

  {dropDownOpen && !isMobile &&dropDownAnchor.current && <DropDown 
      anchor={dropDownAnchor.current}
      dir="right"
      closeCallback={closeCallback} >
        <DropDownOptions />
    </DropDown>}
    {dropDownOpen && isMobile && <BottomSheet
      closeCallback={closeCallback}
    >
    
      <DropDownOptions />
    </BottomSheet>}
  

  {deletePending && <Modal header={`Delete ${mapData.title}?`} closeEvent={()=>{updateDeletePending(false); updateDeleteId(null)}}>
    <DeleteConfirmationModal 
      title={'Are you sure you want to delete this map? All data will be lost'}
      cancelClick={()=>{updateDeletePending(false); updateDeleteId(null)}}
      deleteClick={()=>{
          
          updateDeleteId(null);
          updateDeletePending(false);
          actions.delete(mapData.id);
      }}

    />
  </Modal>}
  
  </>
}


/*

    {top !== undefined && <DropDownItem
      onClick={() => {
        closeCallback(); 
        actions.move(mapData.id, "up")
      }}
     icon={<RiArrowUpCircleLine />} state={top ? "disabled":undefined} mobile={isMobile}>Move up</DropDownItem>}
    {bottom !== undefined && <DropDownItem onClick={()=> {
      closeCallback(); 
      actions.move(mapData.id,"down");
    }} icon={<RiArrowDownCircleLine />}mobile={isMobile} state={bottom ? "disabled":undefined}>Move down</DropDownItem>}

*/
