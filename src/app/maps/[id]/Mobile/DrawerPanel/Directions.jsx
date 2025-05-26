import { RiCarLine, RiRidingLine, RiTrainLine, RiWalkLine } from "@remixicon/react"
import styles from "./styles.module.css"

export default function () {

  const Button = ({icon,text}) => {
    return <button className={styles.dirButton}><span>{icon}</span><span>{text}</span></button>
  }
  
  return <div className={styles.dirButtons}>
    <Button text={`30 min`} icon={<RiTrainLine />}/>
    <Button text={`2.5 hr`} icon={<RiWalkLine />} />
    <Button text={`35 min`} icon={<RiCarLine />} />
    <Button text={`12 min`} icon={<RiRidingLine />} />
  </div>
}