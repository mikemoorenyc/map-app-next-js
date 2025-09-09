import { TMap ,TLayer, TUser, TMapUpdateValues, TPin, TPinValues} from "@/projectTypes"
import { arrayMoveImmutable } from "array-move"
enum UserActionType {
    REFRESH_LAYERS="REFRESH_LAYERS",
    ADDED_LAYER="ADDED_LAYER",
    DELETED_LAYER="DELETED_LAYER",
    UPDATED_LAYER="UPDATED_LAYER",
    ADDED_PIN="ADDED_PIN",
    SORTED_LAYERS="SORTED_LAYERS",
    SPLICED_PIN="SPLICED_PIN",
    UPDATED_PIN="UPDATED_PIN",
    DELETED_PIN="DELETED_PIN",
    MOVE_ITEM="MOVE_ITEM",
    FULL_REFRESH="FULL_REFRESH",
    UPDATE_LAYERS="UPDATE_LAYERS"

}
export type UserActions = |
{type:"REFRESH_LAYERS",newLayers:TLayer[]}|
{type:"ADDED_LAYER",id?:number,user:TUser}|
{type:"DELETED_LAYER",id:number}|
{type:"UPDATED_LAYER",id:number, updatedData:TMapUpdateValues}|
{type:"ADDED_PIN",pinData:TPin,layerToAdd:number}|
{type:"SORTED_LAYERS",sortedLayers:TLayer[]}|
{type:"SPLICED_PIN",pin:TPin,spliceIndex:number}|
{type:"UPDATED_PIN",id:string|number,data:TPinValues}|
{type:"DELETED_PIN",id:string|number,layerId:number}|
{type:"MOVE_ITEM",itemType:"layer"|"pin",arrayId:number,goingUp:boolean,currentIndex:number}|
{type:"FULL_REFRESH",newData:TLayer[]}|
{type:"UPDATE_LAYERS",layers:TLayer[]}|
{type:"MOVE_LAYER",layerId:number,layerIndex:number}






export default (layers:TLayer[], action:UserActions):TLayer[] => {
   console.log("reducerfire",action)
      switch (action.type) {
        case "REFRESH_LAYERS" : {
          return action.newLayers
        }
      case "MOVE_LAYER": {
        const currentIndex = layers.findIndex(l => l.id == action.layerId);
        if(currentIndex < 0) {
          throw new Error("couldn't find it");
        }
        const updatedLayers = [...layers]; 
        const [removed]= updatedLayers.splice(currentIndex,1);
        updatedLayers.splice(action.layerIndex,0,removed);
        return updatedLayers;
      }
      case "ADDED_LAYER": {
        
        const newA = [...layers, {
          title: "Untitled Layer",
          color: "#f0f0f0",
          id: action?.id || Date.now(),
          lightOrDark: "light",
          pins: [] as TPin[],
          createdBy: action?.user,
          created:action.user
        }]
        
        return newA;

      }
      case "DELETED_LAYER": {
        const newA = layers.filter(e => e.id !== action.id);
        return newA
      }
      case "UPDATED_LAYER": {
        const newA = layers.map(e => {
            if(e.id !== action.id) {
                return e
            }
       
            return {...e, ...action.updatedData}
            
        })
       
        return newA
      }
      case "SORTED_LAYERS": {
        console.log(action.sortedLayers)
        return action.sortedLayers
      }
      case "ADDED_PIN": {
       console.log("pin dispacth")
        const layerToAdd = layers.filter(e=> e.id == action.layerToAdd)[0];
        layerToAdd.pins = [...layerToAdd.pins, ...[action.pinData]];
        return layers.map(e => {
            if(e.id != action.layerToAdd) {
                return e; 
            }
            return layerToAdd; 
        })
      }
      case "SPLICED_PIN" : {
        console.log("spliced")
        const p = action.pin;
        const layerToAdd = layers.filter(l => l.id == p.layerId)[0];
        layerToAdd.pins.splice(action.spliceIndex, 0, p);
        return layers.map(layer => {
          if(layer.id == layerToAdd.id) {
            return layerToAdd;
          }
          return layer;
        })
      }
      case "UPDATED_PIN" : {
        const pId = action.id;
        const newData = action.data;
        const oldPin = layers.map(layer => layer.pins).flat().find(pin => pin.id == pId);
        const newPin = {...oldPin, ...newData} as TPin;
        console.log(newPin)
        const layerToUpdate = layers.filter(layer => layer.id == newPin.layerId)[0]
        const updatedPinArray = layerToUpdate.pins.map(pin => {
          if(pin.id == newPin.id) {
            return newPin;
          }
          return pin
        })
      
        return layers.map(layer => {
          if(layer.id == layerToUpdate.id) {
            return {...layerToUpdate, ...{pins: updatedPinArray}}
          }
          return layer
        })
      }
      case "DELETED_PIN": {
      
        const layerToDeleteFrom = layers.filter(e=> e.id == action.layerId)[0];

        console.log('layertodeletefrom',layerToDeleteFrom);

        const newPins = layerToDeleteFrom.pins.filter((e) => e.id != action.id );
      console.log("newPin",newPins);
        const newLayer = {...layerToDeleteFrom, ...{pins:newPins}};
      console.log("newLayer",newLayer);
      const updatedLayerData = layers.map (e => {
            if(e.id !== newLayer.id) {
                return e
            }
            return newLayer;
        })
        console.log("updatedlayerdata",updatedLayerData)
        return updatedLayerData;
      }

      case "MOVE_ITEM" : {
        
        const {itemType,arrayId,goingUp,currentIndex} = action; 
        const arrSplicer = <T extends TPin | TLayer>(arr: T[]) :T[]=> {
          let spliced = [...arr];
          var itemToMove = spliced.splice(currentIndex,1)[0]
          spliced.splice(goingUp? currentIndex-1 : currentIndex+1 ,0,itemToMove)
          return spliced; 
        }
      
        
        const newLayers =  layers.map(l => {
          if(itemType == "pin" && l.id === arrayId) {
            const pinLayer = layers.find(n => n.id === arrayId);
            if(!pinLayer) {
              throw Error("no pin")
            }
            const mutedPins = arrSplicer(pinLayer.pins)
     
            return {...l, ...{pins:mutedPins}};
          }
          return l 
        })
        if(!newLayers) {
          throw Error(); 
        }
        if(itemType == "layer") {
          return arrSplicer(newLayers);
        }
        return newLayers; 
        
      }
      case"FULL_REFRESH": {
        return action.newData;
      }
      case UserActionType.UPDATE_LAYERS : {
        const newLayerState = layers.map(currentLayer => {
          
          let sendLayer = currentLayer; 
          action.layers.forEach(updatedLayer => {
            if(currentLayer.id == updatedLayer.id) {
              sendLayer = updatedLayer 
            }
          })
          return sendLayer;
        })
        console.log(newLayerState);
        return newLayerState
      }
      
    }
  throw Error('Unknown action: ' + action);
  }