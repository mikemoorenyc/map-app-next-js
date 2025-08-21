
/*
const url = 'https://api.content.tripadvisor.com/api/v1/location/search?key=054A75D2B0D34E329E4FEF053B7AD2E2&searchQuery=Hoboken&latLong=40.7363416%2C-74.0121544%2C14&radius=1&radiusUnit=km&language=en';
const options = {method: 'GET', headers: {accept: 'application/json'}};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));
  */


export default async function(pin){
  
  const photoArray = []; 
  const searchURL = `https://api.content.tripadvisor.com/api/v1/location/search?key=${key}&searchQuery=${pin.title}&latLong=${pin.location.lat}%2C${pin.location.lng}&radius=1&radiusUnit=km&language=en`;
const options = {method: 'GET', headers: {accept: 'application/json'}};

const search = await fetch(searchURL, options);
console.log(search);
if(search.ok);

const data = await search.json(); 
console.log(data);


}
