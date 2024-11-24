export default function detectEscape(e,callBack) {
  if(e.code === "Escape") {
          callBack(); 
  } 
}