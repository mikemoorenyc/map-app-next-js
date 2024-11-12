'use client'
import { useContext,useState,useRef,useEffect } from "react";
import DataContext from "@/app/contexts/DataContext";
import ActiveContext from "@/app/contexts/ActiveContext";
import Header from "./Header";
import styles from "./LayerPanel.module.css"
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import LayerSection from "./LayerSection";
import LayerEdit from "./LayerEdit";
const LayerPanel = ({id})=> {
  const {layerData, pageTitle,layerDispatch} = useContext(DataContext);
  const {activeData,activeDispatch} = useContext(ActiveContext);
  const [items,setItems] = useState([...layerData]);
  const [activeId, setActiveId] = useState(null);
  const layerPanelEl = useRef(null);

  useEffect(()=> {
    console.log(layerPanelEl);
    if(!layerPanelEl) return ; 
    activeDispatch({type: "SET_LAYER_PANEL_REF", layerPanelRef:layerPanelEl.current})
  },[layerPanelEl])

  useEffect(()=> {
    setItems(layerData)
  },[layerData])

  const handleDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) {
      return;
    }
    if (type === 'parent') {
      const newParentItems = Array.from(items);
      const [removed] = newParentItems.splice(source.index, 1);
      newParentItems.splice(destination.index, 0, removed);

      setItems(newParentItems);
      layerDispatch({type: "FULL_REFRESH",newData: newParentItems})
    }
    if(type == 'child') {
      const sourceParentIndex = items.findIndex((parent) => parent.id === parseInt(source.droppableId));
      const destinationParentIndex = items.findIndex((parent) => parent.id === parseInt(destination.droppableId));
      if (sourceParentIndex === destinationParentIndex) {
        const newParentItems = Array.from(items);
  
        const sourceParent = newParentItems[sourceParentIndex];
       
        const [removed] = sourceParent.pins.splice(source.index, 1);
        sourceParent.pins.splice(destination.index, 0, removed);
        setItems(newParentItems);
        layerDispatch({type: "FULL_REFRESH",newData: newParentItems})

      } else {
        const newParentItems = Array.from(items);
        const sourceParent = newParentItems[sourceParentIndex];
        const destinationParent = newParentItems[destinationParentIndex];
        const [removed] = sourceParent.pins.splice(source.index, 1);
        destinationParent.pins.splice(destination.index, 0, removed);
        setItems(newParentItems);
        layerDispatch({type: "UPDATED_PIN",id: parseInt(draggableId), data: {
          layerId: parseInt(destination.droppableId)
        }})
        layerDispatch({type: "FULL_REFRESH",newData: newParentItems})
      }
    }
  }

  return <div className={styles.layerPanel}>
  <Header  />
  <div className={styles.layerContainer}>
    <DragDropContext onDragEnd={handleDragEnd}>
      <div ref={layerPanelEl} style={{overflowY:"auto", height: "100%",paddingTop:10}}>
      <Droppable droppableId="parent-list" type="parent" >
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} >
          {items.map((l,parentIndex)=>(
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
                    id={l.id}
                    layerId={l.id}
                    activeId={activeId}
                  >
                    <Droppable droppableId={l.id.toString()} type="child">
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          {l.pins.map((p,childIndex)=>{
                            <Draggable draggableId={p.id.toString()} index={childIndex} key={p.id}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                <PinItem isDragging={snapshot.isDragging} layer={l} activeId={activeId} id={p.id} key={p.id} p={p} layerId={l.id} />
                                </div>
                              )}
                            
                            </Draggable>
                          })}
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
{activeData.editingLayer != null && <LayerEdit />}
  </div>
}    

export default LayerPanel 