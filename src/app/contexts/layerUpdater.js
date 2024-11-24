import { arrayMoveImmutable } from "array-move"


export default (layers, action) => {
   console.log("reducerfire",action)
      switch (action.type) {
        case "REFRESH_LAYERS" : {
          return action.newLayers
        }
      case 'ADDED_LAYER': {
        const newA = [...layers, {
          title: "Untitled Layer",
          color: "#f0f0f0",
          id: Date.now(),
          lightOrDark: "light",
          pins: [],
         
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
      case "SORTED_LAYERS" : {
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
        const newPin = {...oldPin, ...newData};
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
      case "SORT_PINS" : {
        const layerToUpdate = layers.filter(layer => layer.id == action.layerId)[0];
      
        const itemToMoveIndex = layerToUpdate.pins.findIndex(p => p.id == action.id);
     
        const newLayer = {...layerToUpdate, ...{pins: arrayMoveImmutable(layerToUpdate.pins, itemToMoveIndex, itemToMoveIndex + action.dir)}}
        return layers.map(layer => {
          if(layer.id == newLayer.id) {
            return newLayer
          }
          return layer
        })

      }
      case "MOVE_LAYER": {
        const currentIndex = layers.findIndex()
        return ; 
      }
      case "FULL_REFRESH" : {
        return action.newData;
      }
      case "UPDATE_LAYERS" : {
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
  throw Error('Unknown action: ' + action.type);
  }