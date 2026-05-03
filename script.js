const departures = [
  { time: "22:30", flight: "AZ2134", city: "Rome FCO", status: "ON TIME" },
  { time: "22:45", flight: "U23891", city: "Paris CDG", status: "BOARDING" },
  { time: "23:05", flight: "FR1452", city: "Catania", status: "DELAYED 15m" },
  { time: "23:20", flight: "BA0571", city: "London LHR", status: "ON TIME" }
];

const arrivals = [
  { time: "22:40", flight: "AZ1177", city: "Naples", status: "LANDED" },
  { time: "22:55", flight: "LH203", city: "Munich", status: "ON TIME" },
  { time: "23:10", flight: "IB3142", city: "Madrid", status: "ON TIME" },
  { time: "23:30", flight: "KL1601", city: "Amsterdam", status: "DELAYED" }
];

let showingDepartures = true;

function renderTable(data) {
  const table = document.getElementById("flightTable");
  table.innerHTML = "";

  data.forEach(f => {
    const row = `
      <tr>
        <td>${f.time}</td>
        <td>${f.flight}</td>
        <td>${f.city}</td>
        <td>${f.status}</td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

function switchBoard() {
  const title = document.getElementById("boardTitle");

  if (showingDepartures) {
    title.innerText = "ARRIVALS";
    renderTable(arrivals);
  } else {
    title.innerText = "DEPARTURES";
    renderTable(departures);
  }

  showingDepartures = !showingDepartures;
}

// inizializza
renderTable(departures);

// loop rotazione ogni 15 sec
setInterval(switchBoard, 15000);
