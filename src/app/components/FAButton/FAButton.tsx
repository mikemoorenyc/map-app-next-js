import Button, { TModOptions } from "@/app/components/Button";
import { TButtonProps } from "@/app/components/Button";


export default function ({className="",onClick,icon,href,children,target,modifiers=[]}: TButtonProps)  {
  const fabMods : TModOptions[] = ['raised',"md","pill","FAB"]
  const mods = [...fabMods, ...modifiers]
  return <Button onClick={onClick} icon={icon} modifiers={mods} className={` ${className}`} >{children}</Button>
}