import { useContext, useEffect, useRef, useState,useCallback, useMemo,ChangeEvent, SyntheticEvent } from "react";
import { AdvancedMarker, useMap,Pin} from "@vis.gl/react-google-maps";
import mapCenterer from "../lib/mapCenterer";


import BackButton from "./BackButton";
import Button from "@/app/components/Button";
import { createPortal } from "react-dom";
import styles from "./MobileSearchStyles.module.css"
import SearchLogic, { BasicResults } from "@/app/components/ModernSearch/SearchLogic";
import resultFormatter, { TPredictionResult } from "@/app/components/ModernSearch/lib/resultFormatter";
import DataContext from "@/app/contexts/DataContext";
import SearchDropDown from "./SearchDropDown";
import { RiArrowLeftFill, RiCloseFill, RiSearchLine } from "@remixicon/react";
import { TSearchPin } from "@/app/components/ModernSearch/lib/fieldMapping";
import { TGeolocation } from "@/projectTypes";
import PortalContainer from "@/app/components/PortalContainer/PortalContainer";
import { useLayers } from "@/app/lib/useLayerData";
import useActiveStore from "@/app/contexts/useActiveStore";



export default () => {

  //query,updatePredictionResults,predictionChoiceCallBack,predictionChoice
  const [queryVal,updateQueryVal] = useState("")
  const [predictionResults,updatePredictionResults] = useState<BasicResults[]>([]);

  const activePin = useActiveStore(s=>s.activePin);
  const colorMode = useActiveStore(s=>s.colorMode);
  const drawerState = useActiveStore(s=>s.drawerState);
  const legendOpen = useActiveStore(s=>s.legendOpen);

  const updateDrawerState = useActiveStore(s=>s.updateDrawerState);
  const updateLegendOpen = useActiveStore(s=>s.updateLegendOpen)
  const updateActivePin = useActiveStore(s=>s.updateActivePin)
  const updateTempData = useActiveStore(s=>s.updateTempData)
  const updateBackState = useActiveStore(s=>s.updateBackState)

  const map = useMap(); 
  const inputEl = useRef<HTMLInputElement>(null);
  const [markerPosition, updateMarkerPosition] = useState<TGeolocation>();
  const [inputVal,updateInputVal] = useState("")
  const [increment,updateIncrement] = useState(0);
  const [focused,updateFocused] = useState(false);
  const [predictionChoice,updatePredictionChoice] = useState("")
  const [viewPortHeight, updateViewPortHeight] = useState<string|number>("100%")
  //const {layerData} = useContext(DataContext)
  const reset = ()=> {
    updateInputVal("")
    updateIncrement(0)
    updateFocused(false)
    updateQueryVal("")
    updatePredictionResults([])
   
  }
  const layerData = useLayers(); 



  const inputChange = useCallback((e:ChangeEvent<HTMLInputElement>) => {
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

  const itemClicked= (p:TPredictionResult) => {
    console.log("newchoice",p);
    console.log("current",predictionChoice);
  
   // activeDispatch({type:"SET_ACTIVE_PIN",id:null})
   updateActivePin(null)
    if(!p.new) {
  
      updateActivePin(p.id)
      updateDrawerState("open")
      updateBackState("back_to_base")

      if(map&&p.location) {
        mapCenterer(map, p.location);
      }
      reset();
      return ; 
    }
    updatePredictionChoice(p.id);
    

    reset(); 
    return ; 
  }
  const addPredictionPin = (place:TSearchPin) => {

    place.title = place.title;
    const pos = place.location
    place.location = place.location; 
    place.viewport = place.viewport;
    place.id=place.id; 
    if(map) {
      mapCenterer(map, pos);
    }
    updateMarkerPosition(pos);
    updateActivePin("temp")
    updateDrawerState('open')
    updateTempData(place);
    updateBackState("back_to_base")

    reset(); 
  }


    
  const resultsFormatted = useMemo(()=> {
      return resultFormatter(queryVal,layerData,predictionResults)
  },[layerData,queryVal,predictionResults])
 
  useEffect(()=> {
    if(!window.visualViewport) return ; 
    const resizeHandler = (e:Event) => {
      const newH = window.visualViewport?.height
     
      if(newH ) {
        updateViewPortHeight(newH);
      }
    }
    window.visualViewport.addEventListener("resize",resizeHandler)
    updateViewPortHeight(window.visualViewport.height)
    return () => {
      if(window.visualViewport) {
        window.visualViewport.removeEventListener("resize",resizeHandler);
      }
    }

  },[])
    const currentEl = inputEl.current; 

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
    
     
    {true && <PortalContainer containerId="menu-container"><><div style={{
      background:focused?"var(--screen-bg)":"",
      transition: "transform .15s",
      transform:  ["maximized","editing"].includes(drawerState) ? "translateY(-300%)" : undefined,
      position:"fixed", 
      left: 0, 
      top:focused?0:20,
      visibility: legendOpen ? "hidden": undefined,
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
              {(!focused && !inputVal) && <Button onClick={()=>{if(currentEl)currentEl.focus()}} className={styles.searchStarter} icon={<RiSearchLine />} modifiers={['icon','round','ghost']}/>}
              {(focused && inputVal) && <Button onClick={e => {
                e.preventDefault(); 
                updateInputVal("");
                updateQueryVal("")
                updatePredictionResults([])
                updateIncrement(0)
                if(currentEl) {
                  currentEl.value = ""
                  currentEl.focus();
                }
              }}
              icon={<RiCloseFill />}
              modifiers={['ghost','icon']}
               className={`${styles.xButton} flex-center`}/>}

             
            </div>
      </div>
     {focused && <SearchDropDown itemClicked={itemClicked} results={resultsFormatted} />}
            
            
            
            
         
         {<>
         
          {(activePin == "temp" && markerPosition) && <AdvancedMarker zIndex={999} position={markerPosition} />}
         </>}
      
    
    
    </div>
    <SearchLogic 
      query={queryVal}
      updatePredictionResults={(r)=>{updatePredictionResults(r)}}
      predictionChoice={predictionChoice}
      predictionChoiceCallBack={addPredictionPin}
    /></></PortalContainer>}
    
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