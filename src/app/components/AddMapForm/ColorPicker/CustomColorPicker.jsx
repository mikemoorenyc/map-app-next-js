import {useState} from "react"
import Button from "../../Button";

import { HexColorPicker,HexColorInput } from "react-colorful";
import styles from "./ColorPickerStyles.module.css"

export default function CustomColorPicker(props) {
  const {updateFunction,closeFunction,currentColor,isCustom} = props;
  const [tempColor,updateTempColor] = useState(currentColor); 
  const save = () => {
    console.log(tempColor)
    updateFunction(tempColor);
    closeFunction();
  }
  const cancel = () => {
    closeFunction();
  }

  
  return (
    <div className={styles.colorPickerContainer}>
    <HexColorPicker className={styles.pickerPalette} color={tempColor} onChange={updateTempColor} />
    <HexColorInput color={tempColor} className={styles.hexInput} onChange={updateTempColor} onFocus={(e)=>{e.target.select()}}/>
    <div className={`${styles.pickerButtonContainer} flex-center`}>
    <Button
      className={`${styles.pickerButton} flex-1`}
      onClick={cancel}
      modifiers={["sm","secondary"]}
    >
      Cancel
    </Button>
    <Button
      className={`${styles.pickerButton} flex-1`}
      onClick={save}
      modifiers={["sm"]}
    >
      Save
    </Button>
    </div>
    </div>
  )
}
