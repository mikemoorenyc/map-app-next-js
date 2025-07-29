export default function(data){
  const {icon="x",picker=false,favorited=false,visited=false,ld="light",hasIcon=true,color="#fff"} = data;
  return `/api/glyph/icon_${icon}__picker_${picker.toString()}__hasIcon_${hasIcon.toString()}__favorited_${favorited.toString()}__visited_${visited.toString()}__ld_${ld}__color_${color}`;
}
