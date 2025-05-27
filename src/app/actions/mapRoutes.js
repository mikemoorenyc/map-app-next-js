const apiKey = process.env.ROUTES_API_KEY

export default async function(geolocation,pin,method,authenticated) {
  console.log(geolocation);
  if(!authenticated || !apiKey) return false ; 
 const data = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=${apiKey}
`)
  console.log(data);

}

