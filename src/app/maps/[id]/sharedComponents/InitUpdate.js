import { useContext,useEffect } from "react";
import DataContext from "@/app/contexts/DataContext";
import { getMap } from "@/app/actions/maps";

const InitUpdate = function({id}) {
  const {layerDispatch,updatePageTitle,updateMapId} = useContext(DataContext);

  useEffect(()=> {
    const initMap = async () => {
      let newMap = await getMap(id);
      console.log(newMap);
      updateMapId(newMap.id);
      updatePageTitle(newMap.title);
      layerDispatch({
        type: "FULL_REFRESH",
        newData: newMap?.layerData || []
      })
    }
    initMap(); 
  },[])

  return<></>
}

export default InitUpdate