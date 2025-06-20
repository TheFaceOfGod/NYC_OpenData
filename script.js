let data, info;
async function init(){
  let link = "https://data.cityofnewyork.us/resource/8m42-w767.json?$limit=1000";
  info = await fetch(link);
  data = await info.json();
}
let map = "";
async function displayLocation(){
  let address = document.getElementById("address").value;  
  let lat = document.getElementById("lat").value;
  let lon = document.getElementById("lon").value;
  let location = [lat, lon];
  if(address != ""){
    location = await geocodeWithNominatim(address);
  }
  showMap(location);
}
function showMap(location){	
  let output = document.getElementById("output")
  let address = document.getElementById("address").value
  let build = ""
  if (map) {
    map.remove();
  }
  map = L.map("map").setView(location, 14);
  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(map);
  let marker = L.marker(location).addTo(map);
  for(let i = 0; i < data.length; i++){
    let c = data[i];
    if(c.alarm_box_borough === address){
      if(c.zipcode != undefined){
      build += `<div class="fitted card">
                  <h3>Date: ${c.incident_datetime}</h3>    
                  <p>Incident: ${c.incident_classification}</p>
                  <h4>Location of alarm: ${c.alarm_box_location}</h4>
                  <h4>Zipcode: ${c.zipcode}</h4>
                </div>&nbsp`;
      }
    }
  }
  output.innerHTML = build;
}     
const geocodeWithNominatim = async (address) => {
  const encoded = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json`;
  try {
    const response = await fetch(url);
    const results = await response.json();
    if (results.length > 0) {
      const { lat, lon } = results[0];
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);
      return [lat,lon];
    } else {
      console.log('No results found.');
    }
  } catch (err) {
    console.error('Error:', err);
  }
};
function FireIncident(){
  let bx = 0, br = 0, q = 0, m = 0, si = 0;
  let a = document.getElementById("alarm").value;
  for( let i = 0; i < data.length; i++ ){
    if ( data[i].alarm_box_borough == "BRONX" && data[i].alarm_source_description_tx == a) {
      bx++;
    }else if ( data[i].alarm_box_borough == "BROOKLYN" && data[i].alarm_source_description_tx == a) {
      br++;
    }else if ( data[i].alarm_box_borough == "QUEENS" && data[i].alarm_source_description_tx == a) {
      q++;
    }else if ( data[i].alarm_box_borough == "MANHATTAN" && data[i].alarm_source_description_tx == a) {
      m++;
    }else if ( data[i].alarm_box_borough == "RICHMOND / STATEN ISLAND" && data[i].alarm_source_description_tx == a) {
      si++;
    }
  }
  let chartData = [
    ["BRONX",bx],
    ["BROOKLYN",br],
    ["QUEENS",q],
    ["MANHATTAN",m],
    ["RICHMOND / STATEN ISLAND",si]
  ];
  let chartType = document.getElementById("chartType").value;
  displayChart(chartData,"chart", chartType);
}
function displayChart( data, id, type ){
  let chart = c3.generate({
    bindto: '#' + id,
    data: {
      columns: data,
      type:type
    }
  });
}
