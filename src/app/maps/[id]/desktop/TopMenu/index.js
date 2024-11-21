'use client'
import { createPortal } from "react-dom";
import Updater from "./Updater";
import { useEffect,useState } from "react";
import styles from "./styles.module.css";
import { Map } from "iconoir-react";
import Button from "@/app/components/Button";

const TopMenu = () => {
  const [isMounted,updateIsMounted] = useState(false)
  useEffect(()=> {
    updateIsMounted(true);

  },[])
  return isMounted && <>
  {createPortal(
  <div className={`${styles.topMenu} `}>
    <Updater />
    <Button
    icon={<Map />}
    href={"/"}
    modifiers={["secondary","sm"]}
    >
    All Maps
    </Button>
  </div>  
   , document.getElementById("menu-container")
   )}
  </>
}
export default TopMenu