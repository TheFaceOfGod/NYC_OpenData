let data;

async function init(){
  let link = "https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=100";
  info = await fetch(link);
  data = await info.json();
  alert("Data loaded");
}

function getComplaints(){
  let borough = document.getElementById("borough").value;
  for(let i = 0; i < data.length; i++){
    let complaint = data[i];
    if(complaint.borough == borough){
      let front = "";
      front += `<div class="fitted card" style="height:300px;">`;
      front += `     <h3>${complaint.complaint_type}</h3>`;
      front += `     <p>${complaint.borough}</p>`;
      front += `     <p>${complaint.incident_zip}</p>`;
      front += `     <p>${complaint.descriptor}</p><hr>`;
      front += `     <p>${complaint.agency_name}<br>(${complaint.status})</p>`;
      front += `</div>`;

      let back = `<div class="map" id=${complaint.unique_key} > ${complaint.unique_key}</div>` 

      let flipcard = new FlipCard(front, back);
      flipcard.render("output");
      
      //Produce Map after the div for the map on the flipcard is rendered
      showMap(complaint.latitude,complaint.longitude,complaint.unique_key )

    }
  }
}

function showMap(lat,lon,id){
  let location = [lat,lon]
  map = L.map(id).setView(location, 14);
  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(map);

  let marker = L.marker(location).addTo(map);// ******** places marker on map
} 
