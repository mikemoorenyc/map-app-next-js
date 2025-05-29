import Button from "@/app/components/Button";


export default function ({className="",onClick,icon,href,children,target})  {
  return <Button onClick={onClick} icon={icon} modifiers={['raised',"md","pill","FAB"]} className={` ${className}`} >{children}</Button>
}