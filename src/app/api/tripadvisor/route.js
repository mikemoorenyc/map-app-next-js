export  async function GET(req, res) {
  // Set CORS headers
  /*res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle the actual request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }*/
  const {searchParams} = req.nextUrl
  const title = searchParams.get("title");
  const coords = searchParams.get("coords");
  const addr= searchParams.get('addr');
  const key = process.env.NEXT_PUBLIC_TRIPADVISOR_KEY;
  console.log(title);
  console.log(coords);
  console.log(addr);
  const goodResponse = (photoArray) => {
    return new Response(
       JSON.stringify({photos:photoArray})
      ,{
      status:200,
      headers: {
        "Content-Type": "application/json"
      }
    }
    )
  }
  const url = `https://api.content.tripadvisor.com/api/v1/location/search?key=${key}&searchQuery=${encodeURIComponent(title)}&latLong=${encodeURIComponent(coords)}&language=en`
  console.log(url);
  const testData = await fetch(url);
  const {data} = await testData.json();

  if(data.length <1) {
    return goodResponse([]);
  }
  const location = data[0];
  if(location.distance > .3) {
    console.log("no close matches");
    return goodResponse([]);
  }

  //const location = data[0].location_id;
  const locationQuery = await fetch(`https://api.content.tripadvisor.com/api/v1/location/${location.location_id}/photos?key=${key}&language=en`)
  if(!locationQuery.ok) {
    return new Response({status:404})
  }
  let locationData = await locationQuery.json(); 
  locationData = locationData.data;
  if(locationData.length < 1) {
    return goodResponse([]);
  }
  const photoList = locationData.map(p => {
    const {images} = p;
    const {large,original} = images;
    if(original.width < 2000 && original.height < 2000) {
      return original.url
    } 
    return large.url; 
  })

  return goodResponse(photoList);



  // Your API logic here
}

/*

curl --request GET \
     --url 'https://api.content.tripadvisor.com/api/v1/location/search?key=054A75D2B0D34E329E4FEF053B7AD2E2&searchQuery=Radio%20Bakery&address=135%20India%20Street%2C%20Brooklyn%2C%20NY%2011222&latLong=40.7323915%2C-73.9550678&radius=1&radiusUnit=m&language=en' \
     --header 'accept: application/json'

     */

/*curl --request GET \
     --url 'https://api.content.tripadvisor.com/api/v1/location/28190981/photos?key=054A75D2B0D34E329E4FEF053B7AD2E2&language=en' \
     --header 'accept: application/json'*/