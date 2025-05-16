let data;

async function init(){
  let link = "https://data.cityofnewyork.us/resource/8m42-w767.json";
  info = await fetch(link);
  data = await info.json();
  alert("Data loaded");
}

function showMap(lat,lon,id){
  let location = [lat,lon]
  map = L.map(id).setView(location, 14);
  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(map);

  let marker = L.marker(location).addTo(map);
} 
