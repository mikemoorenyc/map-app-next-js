
import { TActiveData } from "./ActiveContext"

enum UserActionType {
    CAN_EDIT = "CAN_EDIT",
    EDITING_LAYER = "EDITING_LAYER",
    ACTIVE_LAYER = "ACTIVE_LAYER",
    UPDATE_ACTIVE_MODAL = "UPDATE_ACTIVE_MODAL",
    EDITING_PIN = "EDITING_PIN",
    ADD_PIN_REF = "ADD_PIN_REF",
    UPDATE_COLLAPSED_LAYER = "UPDATE_COLLAPSED_LAYER",
    SET_LAYER_PANEL_REF = "SET_LAYER_PANEL_REF",
    ADD_PIN_ITEM_REF = "ADD_PIN_ITEM_REF",
    UPDATE_HOVERING_PIN="UPDATE_HOVERING_PIN"
}
type UserAction = |
{type: UserActionType.CAN_EDIT; canEdit: boolean}|
{type: UserActionType.EDITING_LAYER; id: number}|
{type: UserActionType.ACTIVE_LAYER; id:number}|
{type: UserActionType.UPDATE_ACTIVE_MODAL; id:string;remove:boolean}|
{type: UserActionType.EDITING_PIN; id:string;noViewScroll:boolean}|
{type: UserActionType.ADD_PIN_REF; ref:HTMLDivElement;id:string|number}|
{type: UserActionType.UPDATE_COLLAPSED_LAYER; id:number;collapsed:boolean}|
{type: UserActionType.SET_LAYER_PANEL_REF; layerPanelRef: HTMLDivElement}|
{type: UserActionType.ADD_PIN_ITEM_REF; pinItemRef:{ref:HTMLDivElement,id:string|number}}|
{type: UserActionType.UPDATE_HOVERING_PIN; id: string}

export default (actives:TActiveData, action:UserAction) => {

    switch (action.type) {
        case UserActionType.CAN_EDIT: {
            return {...actives,...{canEdit:action.canEdit}}
        }
        case UserActionType.EDITING_LAYER: {
            const updated = {
                editingLayer : action.id
            }
            return {...actives,...updated}
        }
        case UserActionType.ACTIVE_LAYER : {
 
            return {...actives, ...{activeLayer:action.id}}
        }
        case UserActionType.UPDATE_ACTIVE_MODAL: {
            let newModalStack
            if(action.remove === true) {
                newModalStack = actives.activeModal.filter(m => m !== action.id);
            } else {
                newModalStack = [action.id, ...actives.activeModal.filter(x => x !== action.id)];
            }
            return {...actives,...{activeModal:newModalStack}}
        }
        case UserActionType.EDITING_PIN: {
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
        
        case UserActionType.ADD_PIN_REF : {
        const newPinRefs = [...actives.pinRefs, ...[{id:action.id,ref:action.ref}]]
        return {...actives,...{pinRefs:newPinRefs}};
        }
        case UserActionType.UPDATE_COLLAPSED_LAYER : {
            let newLayers ; 
            
            if(action.collapsed) {
                newLayers = [...actives.collapsedLayers, ...[action.id]]
                
            } else {
                newLayers = actives.collapsedLayers.filter(l => l != action.id);
            }
            return {...actives, ...{collapsedLayers: newLayers}}
            
        }
        case UserActionType.SET_LAYER_PANEL_REF : {
          
            return {...actives, ...{layerPanelRef: action.layerPanelRef }}
        }
        case UserActionType.ADD_PIN_ITEM_REF : {
            const newRefs = [...actives.pinItemsRef, ...[action.pinItemRef]];
            return {...actives, ...{pinItemsRef: newRefs}}
        }
        case UserActionType.UPDATE_HOVERING_PIN: {
            return {...actives, ...{hoveringPin: action.id}}
        }
        
      
    }

}