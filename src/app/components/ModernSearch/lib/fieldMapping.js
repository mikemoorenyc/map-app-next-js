
export const fieldMapping = [
  ["id","place_id"],
  ["displayName","name"],
  ["formattedAddress","formatted_address"],
  ["websiteURI","website"],
  ["googleMapsURI","url"],
  ["location","geometry",true],
  ["viewport","viewport",true],
  ["photos","photos"]
]

export const formatter = (newPlace) => {
  const formattedResult = {};
    fieldMapping.forEach((f)=> {
      if(f[2]) {
        return ; 
      }
      formattedResult[f[1]] = newPlace[f[0]]
    })
    formattedResult.geometry = {
      location: newPlace.location,
      viewport: newPlace.viewport
    }
    return formattedResult; 
}

export default fieldMapping
