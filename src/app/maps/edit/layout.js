"use client"
import { useSearchParams } from 'next/navigation'
import { DataContextProvider } from "@/app/contexts/DataContext"
import { createContext ,useState,useEffect} from 'react'
export const PageContext = createContext(null);
import { getMap } from "@/app/actions/maps"

export default ({children}) => {
  const mapId = parseInt(useSearchParams().get("id"));
  useEffect(()=> {
    const initMap = async function() {
      console.log(mapId);
      let mapData = await getMap(mapId);
      console.log(mapData);
      updatePageData(mapData);

    }
    initMap(); 
  },[])
  
  
  const [pageData, updatePageData] = useState({name:"",layerData:[],id: mapId})
  return <PageContext.Provider value={pageData}><DataContextProvider><div>sdasfdas {mapId}
  {children}
  </div></DataContextProvider></PageContext.Provider>
}