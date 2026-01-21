import { useEffect,useState } from "react";

export type darkModeOptions = "light"|"dark"|null;

export default function() {
  /*const ls = localStorage.getItem("darkMode") as darkModeOptions;
  const initDm = ls!==null?ls:"light" as darkModeOptions; */
  
  const [darkMode,updateDarkMode] = useState<darkModeOptions>("dark");

  useEffect(()=> {
 if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        updateDarkMode("dark");
        localStorage.setItem("darkMode","dark"); 
    } else {
      updateDarkMode("light"); 
        localStorage.setItem("darkMode","light"); 
    }
    const changeMode = (event:MediaQueryListEvent) => {
      if(event.matches) {
         localStorage.setItem("darkMode","dark"); 
      } else {
        localStorage.setItem("darkMode","light"); 
      }
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', changeMode);
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', changeMode);
    }


  },[])



  return darkMode; 
}