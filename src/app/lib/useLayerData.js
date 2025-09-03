import { useCallback, useContext, useMemo } from "react";
import DataContext from "../contexts/DataContext";

export default function useLayerData() {

  const {layerData} = useContext(DataContext); 

const findPin = useCallback((id) => {
  return layerData.map(l=> {
    if (l?.pins) {
      return l.pins
    } else {
      return [];
    }
    }).flat().find(p => p.id == id)
},[layerData])
const findLayer = useCallback((id) => {
  return layerData.find(l => l.id == id);
},[layerData])

const isHighlighted = (activeData, pinId) => {
  return activeData.editingPin == pinId || activeData.hoveringPin == pinId
}
const pinIds = useMemo(()=> {
 return layerData.map(l => l.pins).flat().map(p=>p.id);
},[layerData])
const layerIds = useMemo(()=> layerData.map(l=>l.id),[layerData]);
const pinsFlat = useMemo(()=>layerData.map(l=>l.pins).flat(),[layerData])



  return {
    findPin,findLayer,isHighlighted,pinIds,layerIds,pinsFlat
  }

}