export default (actives, action) => {
    switch (action.type) {
        case "EDITING_LAYER": {
            const updated = {
                editingLayer : action.id
            }
            return {...actives,...updated}
        }
        case "ACTIVE_LAYER" : {
 
            return {...actives, ...{activeLayer:action.id}}
        }
        case "UPDATE_ACTIVE_MODAL": {
            let newModalStack
            if(action.remove === true) {
                newModalStack = actives.activeModal.filter(m => m !== action.id);
            } else {
                newModalStack = [action.id, ...actives.activeModal.filter(x => x !== action.id)];
            }
            return {...actives,...{activeModal:newModalStack}}
        }
        case "EDITING_PIN": {
            //SCROLL TO PIN
        
            (function () {
                if(action.noViewScroll) return ;
                if(!actives.layerPanelRef) return ; 
                const pinRef = actives.pinItemsRef.find(p => p.id == action.id)?.ref;
                if(!pinRef) return ; 
                pinRef.scrollIntoView({block: "center"});

            })();



            return {...actives,...{editingPin: action.id}}
        }
        
        case "ADD_PIN_REF" : {
        const newPinRefs = [...actives.pinRefs, ...[{id:action.id,ref:action.ref}]]
        return {...actives,...{pinRefs:newPinRefs}};
        }
        case "UPDATE_COLLAPSED_LAYER" : {
            let newLayers ; 
            
            if(action.collapsed) {
                newLayers = [...actives.collapsedLayers, ...[action.id]]
                
            } else {
                newLayers = actives.collapsedLayers.filter(l => l != action.id);
            }
            return {...actives, ...{collapsedLayers: newLayers}}
            
        }
        case "SET_LAYER_PANEL_REF" : {
          
            return {...actives, ...{layerPanelRef: action.layerPanelRef }}
        }
        case "ADD_PIN_ITEM_REF" : {
            const newRefs = [...actives.pinItemsRef, ...[action.pinItemRef]];
            return {...actives, ...{pinItemsRef: newRefs}}
        }
        case "UPDATE_HOVERING_PIN": {
            return {...actives, ...{hoveringPin: action.id}}
        }
        
      
    }

    throw Error('Unknown action: ' + action.type);
}