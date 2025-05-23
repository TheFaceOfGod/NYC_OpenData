let data, info, output;

async function init(){
  let link = "https://data.cityofnewyork.us/resource/8m42-w767.json";
  info = await fetch(link);
  data = await info.json();
  alert("Data loaded");
}
let map;
async function displayLocation(){
  let lat;
  let lon;
  let address = document.getElementById("address");  
  if(address.value != ""){
    let location = await geocodeWithNominatim(address.value);
  }
  showMap(location);
}
function showMap(location){	
  if (map) {
    map.remove();
  }
  map = L.map("map").setView(location, 14);
  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(map);

  let marker = L.marker(location).addTo(map);
}     
const geocodeWithNominatim = async (address) => {
  const encoded = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json`;

  try {
    const response = await fetch(url);
    const results = await response.json();

    if (results.length > 0) {
    } else {
      console.log('No results found.');
    }
  } catch (err) {
    console.error('Error:', err);
  }
};
function FireIncident(){
  let bx = 0, br = 0, t = 0, q = 0, m = 0, si = 0;
  for( let i = 0; i < data.length; i++ ){
    if ( data[i].alarm_box_borough == "BRONX" ) {
      bx++;
    }else if ( data[i].alarm_box_borough == "BROOKLYN" ) {
      br++;
    }else if ( data[i].alarm_box_borough == "QUEENS" ) {
      q++;
    }else if ( data[i].alarm_box_borough == "MANHATTAN" ) {
      m++;
    }else {
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
