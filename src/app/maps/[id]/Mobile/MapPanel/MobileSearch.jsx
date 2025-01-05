import { useContext, useEffect, useRef, useState,useCallback, useMemo } from "react";
import { AdvancedMarker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import mapCenterer from "../lib/mapCenterer";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import TextInput from "@/app/components/TextInput";
import BackButton from "./BackButton";
import Button from "@/app/components/Button";
import { NavArrowLeft, Xmark } from "iconoir-react";
import { createPortal } from "react-dom";
import styles from "./MobileSearchStyles.module.css"
import SearchLogic from "@/app/components/ModernSearch/SearchLogic";
import resultFormatter from "@/app/components/ModernSearch/lib/resultFormatter";
import DataContext from "@/app/contexts/DataContext";
import SearchDropDown from "./SearchDropDown";
import { usePreventScroll } from '@react-aria/overlays';


export default () => {
  const prevent = usePreventScroll()
  //query,updatePredictionResults,predictionChoiceCallBack,predictionChoice
  const [queryVal,updateQueryVal] = useState("")
  const [predictionResults,updatePredictionResults] = useState([]);
  const {activeData,activeDispatch} = useContext(MobileActiveContext)
  const {activePin,backState} = activeData;
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
      
      if(increment > 0 || Math.abs(newValue - inputVal) > 4) {
        updateIncrement(0);
        updateQueryVal(newValue);
      }
      updateInputVal(e.target.value);
  },[increment,inputVal]);

  const itemClicked= (p) => {
    
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
  console.log(viewPortHeight);
  const {pinsFlat} = resultsFormatted; 
 
    return <>
    <style 
    dangerouslySetInnerHTML={{__html:`
    :root {
    --view-port-size: ${viewPortHeight}px
    }
    .mobile-app, #drawer-panel {
    display: ${focused?"none":"block"}
    }
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
    {!activeData.legendOpen && createPortal(<>
     
    <div style={{
      background:focused?"var(--screen-bg)":"",
      transition: "transform .15s",
      transform: activeData.drawerState == "maximized" ? "translateY(-300%)" : null,
      position:"fixed", 
      left: 0, 
      top:focused?0:24,
      height: focused?viewPortHeight : "auto",
      paddingTop: focused?24:0,
      display:focused?"flex":"block",
      flexDirection: "column", 
      zIndex:99,
      width: "100%"}}>
      <div className="flex-center" style={{height:34}}>
        {!focused ? <BackButton /> : <Button icon={<NavArrowLeft />} modifiers={['secondary']} style={{marginRight: 12,marginLeft:16}} onClick={(e)=>{e.preventDefault(); reset(); 
            }}/>  }

        <div className={`${styles.inputContainer} big-drop-shadow `}>
              <input ref={inputEl} className={`${styles.searchInput} flex-1`} onFocus={()=> {
              updateFocused(true);
              }} value={inputVal} onChange={inputChange} type="text" placeholder="Search for a location"/>
              {(focused && inputVal) && <button onClick={e => {
                e.preventDefault(); 
                updateInputVal("");
                updateQueryVal("")
                updatePredictionResults([])
                updateIncrement(0)
                inputEl.current.value = ""
                inputEl.current.focus();
              }}
              
               className={`${styles.xButton} flex-center`}>
                <Xmark width={14} height={14} className={styles.xIcon} />
              </button>}
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
    />
    </>,document.getElementById("menu-container"))}
    </>
}
//<TextInput placeholder={"Search for a location"} onFocus={(e)=>{console.log(e)}} type={"text"} ref={inputEl}  className={`flex-1`}/>