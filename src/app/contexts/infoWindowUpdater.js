export default (infoState, action) => {

    switch(action.type) {
      case "UPDATE_TEMP_REF" :{
        return {...infoState, ...{tempRef: action.tempRef}}
      }
      case "UPDATE_TEMP_MARKER_POSITION": {
        console.log(action)
        return {...infoState,...{tempMarkerPosition:action.position}}
      }
      case "UPDATE_ANCHOR": {
        return {...infoState, ...{anchor:action.anchor}}
      }
      case "UPDATE_CONTENT": {
        const newContent = {...infoState.infoWindowContent, ...action.newContent}
        return {...infoState, ...{infoWindowContent: newContent}}
      }
      case "OPEN_WINDOW": {
    
        if (action.callback) {
          action.callback(); 
        }
        return {...infoState,...{infoWindowShown: true,
        infoWindowPosition: action.position || null ,
          infoWindowAnchor: action.anchor || infoState.tempRef,
          infoWindowContent : action.content}}
      }
      
      case "CLOSE_WINDOW" : {
        if(action.callback) {
          action.callback()
        }
        return {...infoState,...{
          infoWindowShown:false, 
          infoWindowAnchor: null,
          tempMarkerPosition: null,
          infoWindowContent: {
            body:null,
            content:null
          }}
        }
      }
    }
  }