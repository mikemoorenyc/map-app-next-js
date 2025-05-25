'use client'
import { createPortal } from "react-dom";
import Updater from "./Updater";
import { useEffect,useState } from "react";
import styles from "./styles.module.css";

import Button from "@/app/components/Button";
import { RiMap2Line } from "@remixicon/react";

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
    icon={<RiMap2Line />}
    href={"/"}
    modifiers={["secondary","sm"]}
    >
    All maps
    </Button>
  </div>  
   , document.getElementById("menu-container")
   )}
  </>
}
export default TopMenu