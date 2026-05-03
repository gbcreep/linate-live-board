const API_KEY = "b59f0c36027454ecc59c3915c56a4188";

const ENDPOINT =
  `https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=LIN&limit=15`;

let showingDepartures = true;

async function fetchFlights() {
  try {
    const res = await fetch(ENDPOINT);
    const data = await res.json();

    const flights = (data.data || []).slice(0, 8);

    const mapped = flights.map(f => {
      const status = (f.flight_status || "unknown").toLowerCase();

      return {
        time: f.departure?.scheduled?.substring(11, 16) || "--:--",
        flight: f.flight?.iata || "N/A",
        city: f.arrival?.airport || "Unknown",
        status: status
      };
    });

    renderTable(mapped);
  } catch (err) {
    console.error("API error", err);
    renderTable([]);
  }
}

function statusClass(status) {
  if (status === "landed") return "status-landed";
  if (status === "boarding") return "status-boarding";
  if (status === "delayed") return "status-delayed";
  return "status-on-time";
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
        <td class="${statusClass(f.status)}">${f.status.toUpperCase()}</td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

function switchBoard() {
  const title = document.getElementById("boardTitle");

  if (showingDepartures) {
    title.innerText = "ARRIVALS – LINATE";
  } else {
    title.innerText = "DEPARTURES – LINATE";
  }

  showingDepartures = !showingDepartures;
}

// INIT
fetchFlights();

// refresh dati ogni 90 sec (più stabile per free tier)
setInterval(fetchFlights, 90000);

// switch schermo ogni 20 sec
setInterval(switchBoard, 20000);
