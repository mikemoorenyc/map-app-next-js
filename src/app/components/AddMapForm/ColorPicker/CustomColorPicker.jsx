import {useState} from "react"
//import Button
//import useKeyPress

export default function CustomColorPicker(props) {
  const {updateFunction,closeFunction,currentColor,isCustom} = props;
  const [tempColor,updateTempColor] = useState(currentColor); 
  const save = () => {
    updateFunction(tempColor);
    closeFunction();
  }
  const cancel = () => {
    closeFunction();
  }
  const saveOnEnter = useKeyPress("Enter",save);
  
  return (<>
    <HexColorPicker color={tempColor} onChange={updateTempColor} />
    <HexColorInput color={tempColor} onChange={updateTempColor} />
    <div className={buttonsstyles}>
    <Button
      onClick={cancel}
      modifiers={["sm","secondary"]}
    >
      Cancel
    </Button>
    <Button
      onClick={save}
      modifiers={["sm"]}
    >
      Save
    </Button>
    </div>
    
  </>)
}
