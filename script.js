let data, info, build;
async function init(){
  let link = "https://data.cityofnewyork.us/resource/8m42-w767.json?$limit=1000";
  info = await fetch(link);
  data = await info.json();
}
let map = undefined;
async function displayLocation(){
  let lat = document.getElementById("lat").value;
  let lon = document.getElementById("lon").value;
  let location = [lat, lon];
  let address = document.getElementById("address");  
  if(address.value != ""){
    location = await geocodeWithNominatim(address.value);
  }
  showMap(location);
}
function showMap(location){	
  let output = document.getElementById("output")
  let output2 = document.getElementById("output2")
  let address = document.getElementById("address")
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
    let complaint = data[i];
    if(complaint.incident_borough = address){
      build += `<div class="fitted card">
                  <h3>Borough:${complaint.alarm_box_borough}</h3>    
                  <p>Incident:${complaint.incident_classification}</p>
                  <h4>Location of alarm:${complaint.alarm_box_location}</h4>
                </div>`;
    }
   output.innerHTML=build;
   output2.innerHTML=`<div id="output2" class="container" >
                        <input style="font-size:1px;width:1px;text-align:right;" type="text" id="lat"> &nbsp; 
                        <input style="font-size:1px;width:1px;text-align:right;" type="text" id="lon"> &nbsp;
                        <select id="address" style="width:100px;flex:1000;text-align:center;">&nbsp;
                          <option value="RICHMOND / STATEN ISLAND">RICHMOND / STATEN ISLAND</option>
                          <option value="BROOKLYN">BROOKLYN</option>
                          <option value="BRONX">BRONX</option>
                          <option value="QUEENS">QUEENS</option>
                          <option value="MANHATTAN">MANHATTAN</option>
                        </select>
                        <input type="button" onclick="displayLocation()" value="View">
                      </div>`
  }
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
  let bx = 0, br = 0, t = 0, q = 0, m = 0, si = 0;
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
