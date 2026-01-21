import Button from "@/app/components/Button"
import DataContext from "@/app/contexts/DataContext"
import { RiCheckFill, RiPencilFill } from "@remixicon/react"
import { SyntheticEvent, useContext } from "react"

export default () => {
    const {nonEditing,updateNonEditing} = useContext(DataContext)

    const onClick = (e:SyntheticEvent) => {
        e.preventDefault(); 
        if(!updateNonEditing) return ; 
        const switcher = !nonEditing?true:false
        updateNonEditing(switcher);
    }


    return <Button {...{onClick}} modifiers={["round","secondary","sm","icon"]} icon={nonEditing?<RiPencilFill/>:<RiCheckFill/>}></Button>
}