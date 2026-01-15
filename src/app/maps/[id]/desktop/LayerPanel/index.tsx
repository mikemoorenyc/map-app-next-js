'use client'
import { useContext,useState,useRef,useEffect } from "react";
import useLiveEditing from "@/_lib/useLiveEditing";
import DataContext from "@/_contexts/DataContext";

import Header from "./Header";
import styles from "./LayerPanel.module.css"
import { DragDropContext, Droppable, Draggable, OnDragEndResponder } from '@hello-pangea/dnd';
import LayerSection from "./LayerSection";
import PinItem from "./PinItem";
import LayerEdit from "./LayerEdit";

import useActiveStore from "@/_contexts/useActiveStore";
import { useLayers } from "@/_lib/dataHooks";


type TDraggableObject = {
  index:number,
  id:string, 
  droppableId:string, 

}

const LayerPanel = ()=> {
  const setLayerPanelRef = useActiveStore(set => set.setLayerPanelRef);
  const layerPanelRef = useActiveStore(set => set.layerPanelRef);
  const editingLayer = useActiveStore(set =>set.editingLayer);
  
  const dispatchEvent = useLiveEditing(); 
  
    const layerData = useLayers();
   
    const [items,setItems] = useState([...layerData]);
    const [activeId, setActiveId] = useState<number|null>(null);
    const layerPanelEl = useRef<HTMLDivElement>(null);

    useEffect(()=> {

      if(layerPanelEl.current===null) return ; 
      setLayerPanelRef(layerPanelEl.current);
    

    },[layerPanelEl])

    useEffect(()=> {
 
      if(!layerData.length) return ;
    
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



   
return ( 
  <div className={styles.layerPanel}>
    <Header layerRef={layerPanelEl} />
    <div className={styles.layerSectionContainer}>
      <DragDropContext onDragEnd={handleDragEnd}>
      <div ref={layerPanelEl} className='outer-scrollable-container' style={{overflowY:"auto", height: "100%",paddingTop:10}}>
      <Droppable droppableId="parent-list" type="parent" >
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} >
            {items.map((l, parentIndex) => (
              <Draggable draggableId={l.id.toString()} index={parentIndex} key={l.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <LayerSection
                    key={l.id}
                    layer={l}
                  
                    activeId={activeId}
                    >
                    <Droppable droppableId={l.id.toString()} type="child">
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                        {!l.pins.length && <div style={{height: 50}}/>}
                          {l.pins.map((p, childIndex) => (
                            <Draggable draggableId={p.id.toString()} index={childIndex} key={p.id}>
                              {(provided, snapshot) => (
                                <div
                                  
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <PinItem isDragging={snapshot.isDragging} layer={l}  key={p.id} p={p}  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                        
                      )}
                      
                    </Droppable>
                    </LayerSection>
                    
                  </div>
                )} 
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      </div>
    </DragDropContext>  
    </div>  
    {(editingLayer!==null ) &&<LayerEdit   /> }
  </div>)
}    

export default LayerPanel 
