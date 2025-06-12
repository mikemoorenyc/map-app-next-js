import {useState} from "react" 



export default function ColorPicker ({initColor, saveColor}) {
  const [color,updateColor] = useState(initColor); 

  return <div>
    <HexColorPicker color={color} onChange={setColor} />
    <HexColorInput color={color} onChange={setColor} />
    
  </div>

  



}
