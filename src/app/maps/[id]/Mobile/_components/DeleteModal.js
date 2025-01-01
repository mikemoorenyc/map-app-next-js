
import Button from "@/app/components/Button"
export default ({questionText,confirmFunction,cancelFunction}) => {
 return (
  <div className={`flex-center-center`} style={{position:"fixed",inset:"0px",background:"var(--screen-bg)",padding:16}}> 
    <div style={{paddingBottom: 36}}>
    <h2 style={{fontWeight:"bold",fontSize:26,marginBottom:16,textAlign:"center"}} >{questionText}</h2>
    <div><Button style={{width:"100%"}} modifiers={["big","caution"]} onClick={confirmFunction}>Yes</Button></div>
    <div  style={{marginTop:12}}><Button style={{width:"100%"}} onClick={cancelFunction} modifiers={["big","secondary"]}>No</Button></div>
    
    </div>
    </div>
 ) 
}

/*.deleteQuestion {
  font-weight: bold;
  font-size: 26px;
  margin-bottom: 16px; 
  text-align: center;
}
.deleteButton {
  width: 100%; 
}
*/