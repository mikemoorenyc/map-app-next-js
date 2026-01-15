import Button, { TModOptions } from "@/_components/Button";
import { TButtonProps } from "@/_components/Button";


export default function ({className="",onClick,icon,href,children,target,modifiers=[]}: TButtonProps)  {
  const fabMods : TModOptions[] = ['raised',"md","pill","FAB"]
  const mods = [...fabMods, ...modifiers]
  return <Button onClick={onClick} icon={icon} modifiers={mods} className={` ${className}`} >{children}</Button>
}