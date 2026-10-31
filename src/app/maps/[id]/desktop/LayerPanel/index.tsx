'use client'
import { useContext,useState,useRef,useEffect } from "react";
import useLiveEditing from "@/app/lib/useLiveEditing";
import DataContext from "@/app/contexts/DataContext";
import ActiveContext from "@/app/contexts/ActiveContext";
import Header from "./Header";
import styles from "./LayerPanel.module.css"
import { DragDropProvider } from "@dnd-kit/react";
import LayerSection from "./LayerSection";
import PinItem from "./PinItem";
import LayerEdit from "./LayerEdit";
import useLayerData from "@/app/lib/useLayerData";
import { TLayer, TPin } from "@/projectTypes";
import { move } from "@dnd-kit/helpers";
import { isSortable } from "@dnd-kit/react/sortable";

type TDraggableObject = {
  index:number,
  id:string,
  droppableId:string,

}
const formatTempPins = (layerData: TLayer[]) => {
  return Object.fromEntries(layerData.map(section => [section.id, section.pins]))
}
const LayerPanel = ()=> {

  const dispatchEvent = useLiveEditing();
  const {activeData,activeDispatch} = useContext(ActiveContext);
    const layerData = useLayerData().layers;
  const { findLayer,findPin } = useLayerData();

    const [items,setItems] = useState([...layerData]);
    const [activeId, setActiveId] = useState<number|null>(null);
    const layerPanelEl = useRef<HTMLDivElement>(null);
    const [tempPins, setTempPins] = useState<Record<number,TPin[]>>(formatTempPins(layerData))
    useEffect(()=> {

      if(!layerPanelEl) return ;
      activeDispatch({type: "SET_LAYER_PANEL_REF", layerPanelRef:layerPanelEl.current})

    },[layerPanelEl])

    useEffect(()=> {

      if(!layerData.length) return ;
        setTempPins(formatTempPins(layerData))
       setItems(layerData)
    },[layerData])



const handleDragEnd = (result:any) => {
    const { source, destination, draggableId, type } = result;
    console.log(result);


    if (!destination) {
      return;
    }

    if (type === 'parent') {
      const newParentItems = Array.from(items);
      const [removed] = newParentItems.splice(source.index, 1);
      newParentItems.splice(destination.index, 0, removed);

      setItems(newParentItems);
      dispatchEvent([{type: "FULL_REFRESH",newData: newParentItems}])
    }



    if (type === 'child') {

      const sourceParentIndex = items.findIndex((parent) => parent.id === parseInt(source.droppableId));
      const destinationParentIndex = items.findIndex((parent) => parent.id === parseInt(destination.droppableId));

      if (sourceParentIndex === destinationParentIndex) {
        const newParentItems = Array.from(items);
        console.log(newParentItems);
        const sourceParent = newParentItems[sourceParentIndex];
        console.log(sourceParent);
        const [removed] = sourceParent.pins.splice(source.index, 1);
        sourceParent.pins.splice(destination.index, 0, removed);

        setItems(newParentItems);
        dispatchEvent([{type: "FULL_REFRESH",newData: newParentItems}])
      } else {
        const newParentItems = Array.from(items);
        const sourceParent = newParentItems[sourceParentIndex];
        const destinationParent = newParentItems[destinationParentIndex];
        const [removed] = sourceParent.pins.splice(source.index, 1);
        destinationParent.pins.splice(destination.index, 0, removed);

        setItems(newParentItems);
        dispatchEvent([{type: "FULL_REFRESH",newData: newParentItems}])
        dispatchEvent([{type: "UPDATED_PIN",id: draggableId, data: {
          layerId: parseInt(destination.droppableId)
        }}])

      }
    }
  };

  const snapshot = useRef(structuredClone({tempPins,items}))


return (
  <div className={styles.layerPanel}>
    <Header layerRef={layerPanelEl} />
    <div className={styles.layerSectionContainer}>
      <DragDropProvider
        onDragStart={() => {
          snapshot.current = structuredClone({tempPins,items})
        }}
        onDragEnd={(event) => {
          const { source, target } = event.operation;
          if (event.canceled) {
              setItems(snapshot.current.items);
              setTempPins(snapshot.current.tempPins);
              return;
          }
          if (!isSortable(source)) return;
          if (source.type == "layer") {
            const update = move(items, event);
            setItems(update);
            dispatchEvent([{ type: "FULL_REFRESH", newData: update }]);
            return;
          }
          const { group, initialGroup, initialIndex, index } = source;

          if (source.type == "pin") {
            console.log(tempPins);
            const newData = items.map(l => {
              const updatePins = tempPins[l.id].map(p => {
                return {...p,layerId:l.id}
              })
              return {...l, pins:updatePins}
            })
            console.log("test",newData);
            setItems(newData);
            dispatchEvent([{ type: "FULL_REFRESH", newData: newData }]);
          }

        }}
        onDragOver={(event) => {
          const { source,target } = event.operation;
          if (!isSortable(source)) return;

          if (target?.type == "empty-layer") {
            const { initialGroup, group, index, initialIndex } = source;
            const targetLayerId = Number(String(target.id).replace("empty-", ""));
              const sourceLayer = items.find(l => l.id === Number(initialGroup));
              const removed = findPin(String(source.id));

              if (!sourceLayer || !removed) return;

              const newData = items.map(l => {
                if (l.id === targetLayerId) {
                  return {
                    ...l,
                    pins: [{...removed,layerId:targetLayerId}]
                  };
                }

                if (l.id === sourceLayer.id) {
                  return {
                    ...l,
                    pins: l.pins.filter(p => String(p.id) !== String(source.id))
                  };
                }

                return l;
              });

              const newTempPins = formatTempPins(newData);

              setTempPins(newTempPins);
              setItems(newData);



              return;
          }
          if (target?.type == "pin") {
            const newPins = move(tempPins, event);
            setTempPins(current => move(current, event));
            setItems(prev => {
              return prev.map(l => {
                const updatePins = newPins[l.id].map(p => {
                  return {...p,layerId:l.id}
                })
                return { ...l,pins:updatePins }
              })
            })
          }
        }}
      >
        <div ref={layerPanelEl} className='outer-scrollable-container' style={{ overflowY: "auto", height: "100%", paddingTop: 10 }}>
          {items.map((layer,index) => {

            return<LayerSection key={layer.id} {...{layer,activeId,index}}>
              {(tempPins[layer.id] ?? []).map((p,index) => <PinItem key={p.id} {...{p,index:index,layer,isDragging:false}} />)}
            </LayerSection>
          })}



      </div>
    </DragDropProvider>
    </div>
    {(activeData.editingLayer!==null ) &&<LayerEdit   /> }
  </div>)
}

export default LayerPanel
