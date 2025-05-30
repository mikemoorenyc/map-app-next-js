import { useContext, useEffect, useRef, useState,useCallback, useMemo } from "react";
import { AdvancedMarker, useMap,Pin} from "@vis.gl/react-google-maps";
import mapCenterer from "../lib/mapCenterer";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";

import BackButton from "./BackButton";
import Button from "@/app/components/Button";
import { createPortal } from "react-dom";
import styles from "./MobileSearchStyles.module.css"
import SearchLogic from "@/app/components/ModernSearch/SearchLogic";
import resultFormatter from "@/app/components/ModernSearch/lib/resultFormatter";
import DataContext from "@/app/contexts/DataContext";
import SearchDropDown from "./SearchDropDown";
import { usePreventScroll } from '@react-aria/overlays';
import { RiArrowLeftFill, RiCloseFill, RiSearchLine } from "@remixicon/react";


export default () => {

  //query,updatePredictionResults,predictionChoiceCallBack,predictionChoice
  const [queryVal,updateQueryVal] = useState("")
  const [predictionResults,updatePredictionResults] = useState([]);
  const {activeData,activeDispatch} = useContext(MobileActiveContext)
  const {activePin,colorMode} = activeData;
  const map = useMap(); 
  const inputEl = useRef(null);
  const [markerPosition, updateMarkerPosition] = useState(null);
  const [inputVal,updateInputVal] = useState("")
  const [increment,updateIncrement] = useState(0);
  const [focused,updateFocused] = useState(false);
  const [predictionChoice,updatePredictionChoice] = useState("")
  const [viewPortHeight, updateViewPortHeight] = useState("100%")
  const {layerData} = useContext(DataContext)
  const reset = ()=> {
    updateInputVal("")
    updateIncrement(0)
    updateFocused(false)
    updateQueryVal("")
    updatePredictionResults([])
   
  }



  const inputChange = useCallback((e) => {
      e.preventDefault();
      
      const newValue = e.target.value; 
     
     
      updateIncrement(prev => prev+1);
      if(newValue.length === 0) {
        updatePredictionResults([]);
        updateIncrement(0)
        updateQueryVal("")
      }

      if(increment > 0 || Math.abs(newValue.length - inputVal.length) > 4) {
        updateIncrement(0);
        updateQueryVal(newValue);
      }
      updateInputVal(e.target.value);
  },[increment,inputVal]);

  const itemClicked= (p) => {
    console.log("newchoice",p);
    console.log("current",predictionChoice);
  
    activeDispatch({type:"SET_ACTIVE_PIN",id:null})
    if(!p.new) {
  
      if(activePin == p.id) {
        reset();
        return ; 
      }
      activeDispatch({type:"SET_ACTIVE_PIN",id:p.id})
      activeDispatch({type:"DRAWER_STATE",state:"open"})
      activeDispatch({type:"BACK_STATE",state:"back_to_base"})
      mapCenterer(map, p.location);
      reset();
      return ; 
    }
    updatePredictionChoice(p.id);
    

    reset(); 
    return ; 
  }
  const addPredictionPin = (place) => {
   
    place.title = place.name;
    const pos = place.geometry.location.toJSON()
    place.location = place.geometry.location.toJSON(); 
    mapCenterer(map, pos);
    updateMarkerPosition(pos);
    activeDispatch({type:"SET_ACTIVE_PIN",id:"temp"})
    activeDispatch({type:"DRAWER_STATE",state:"open"})
    activeDispatch({type: "SET_TEMP_DATA",data: place})
    activeDispatch({type:"BACK_STATE",state:"base"})
    reset(); 
  }


    
  const resultsFormatted = useMemo(()=> {
      return resultFormatter(queryVal,layerData,predictionResults)
  },[layerData,queryVal,predictionResults])
 
  useEffect(()=> {
    if(!window.visualViewport) return ; 
    const resizeHandler = (e) => {
      updateViewPortHeight(e.currentTarget.height);
    }
    window.visualViewport.addEventListener("resize",resizeHandler)
    updateViewPortHeight(window.visualViewport.height)
    return () => {
      window.visualViewport.removeEventListener("resize",resizeHandler);
    }

  },[])


    return <>
    <style 
    dangerouslySetInnerHTML={{__html:`
    :root {
    --view-port-size: ${viewPortHeight}px
    }
    ${focused ? "#drawer-panel,.compass-icon{display:none}" : ""}
    ${focused ? "#mobile-map {opacity: 0;}":""}

    html,body {
    /*${focused? `height: ${viewPortHeight}px;`:""}*/
    }
    body {
    position:fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    
    }
    `}}
    
    />
    
     
    {true && createPortal(<><div style={{
      background:focused?"var(--screen-bg)":"",
      transition: "transform .15s",
      transform:  ["maximized","editing"].includes(activeData.drawerState) ? "translateY(-300%)" : null,
      position:"fixed", 
      left: 0, 
      top:focused?0:20,
      visibility: activeData.legendOpen ? "hidden": undefined,
      height: focused?viewPortHeight : "auto",
      paddingTop: focused?20:0,
      display:focused?"flex":"block",
      flexDirection: "column", 

      width: "100%"}}>
      <div className="flex-center" style={{borderBottom:focused?"1px solid var(--screen-text)":""}}>
        {!focused ? <BackButton /> : <Button style={{marginLeft:"var(--gutter)"}} icon={<RiArrowLeftFill />} modifiers={['ghost','icon','round']}  onClick={(e)=>{e.preventDefault(); reset(); 
            }}/>  }

        <div className={` ${focused?styles.inputContainerFocused:styles.inputContainer}`}>
        

      <input ref={inputEl} className={`${styles.searchInput} flex-1 ${focused?styles.focused:""}`} onFocus={()=> {
              updateFocused(true); 
              updatePredictionChoice("");
              }} value={inputVal} onChange={inputChange} type="text" placeholder="Search for a location"/>
              {(!focused && !inputVal) && <Button onClick={()=>{inputEl.current.focus()}} className={styles.searchStarter} icon={<RiSearchLine />} modifiers={['icon','round','ghost']}/>}
              {(focused && inputVal) && <Button onClick={e => {
                e.preventDefault(); 
                updateInputVal("");
                updateQueryVal("")
                updatePredictionResults([])
                updateIncrement(0)
                inputEl.current.value = ""
                inputEl.current.focus();
              }}
              icon={<RiCloseFill />}
              modifiers={['ghost','icon']}
               className={`${styles.xButton} flex-center`}/>}

             
            </div>
      </div>
     {focused && <SearchDropDown itemClicked={itemClicked} results={resultsFormatted} />}
            
            
            
            
         
         {<>
         
          {(activeData.activePin == "temp" && markerPosition) && <AdvancedMarker position={markerPosition} />}
         </>}
      
    
    
    </div>
    <SearchLogic 
      query={queryVal}
      updatePredictionResults={updatePredictionResults}
      predictionChoice={predictionChoice}
      predictionChoiceCallBack={addPredictionPin}
    /></>,document.getElementById("menu-container"))}
    
    </>
}
//<TextInput placeholder={"Search for a location"} onFocus={(e)=>{console.log(e)}} type={"text"} ref={inputEl}  className={`flex-1`}/>


/*
        <input ref={inputEl} className={`${styles.searchInput} flex-1 ${focused?styles.focused:""}`} onFocus={()=> {
              updateFocused(true); inputEl.current.focus(); 
              }} value={inputVal} onChange={inputChange} type="text" placeholder="Search for a location"/>
              */

/*

         {!focused && <div onClick={focusClick} className={`${styles.searchInput} flex-1 ${focused?styles.focused:""}`} > Search for a location</div>}
               <input ref={inputEl} className={`${styles.searchInput} flex-1 ${focused?styles.focused:""}`} value={inputVal} onChange={inputChange} type="text" style={!focused?{position:"absolute",left:-9999}:{}} placeholder="Search for a location"/>
               */