import Button from "@/app/components/Button";


export default function ({className="",onClick,icon,href,children,target,modifiers=[]})  {
  return <Button onClick={onClick} icon={icon} modifiers={[...['raised',"md","pill","FAB"], ...modifiers]} className={` ${className}`} >{children}</Button>
}