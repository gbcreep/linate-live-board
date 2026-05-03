const API_KEY = "b59f0c36027454ecc59c3915c56a4188";

const ENDPOINT = `https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=LIN&limit=10`;

let showingDepartures = true;

async function fetchFlights() {
  try {
    const res = await fetch(ENDPOINT);
    const data = await res.json();

    const flights = data.data || [];

    const departures = flights.map(f => ({
      time: f.departure?.scheduled?.substring(11, 16) || "--:--",
      flight: f.flight?.iata || "N/A",
      city: f.arrival?.airport || "Unknown",
      status: f.flight_status?.toUpperCase() || "UNKNOWN"
    }));

    renderTable(departures);
  } catch (err) {
    console.error("API error:", err);
    renderTable([]);
  }
}

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
    title.innerText = "ARRIVALS (LIVE LIN)";
  } else {
    title.innerText = "DEPARTURES (LIVE LIN)";
  }

  showingDepartures = !showingDepartures;
}

// INIT
fetchFlights();

// refresh dati ogni 2 minuti
setInterval(fetchFlights, 120000);

// switch schermo ogni 20 sec
setInterval(switchBoard, 20000);
