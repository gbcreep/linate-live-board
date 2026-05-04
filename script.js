const BASE = "https://api.aviationstack.com/v1/flights";
const KEY = "INSERISCI_API_KEY";

async function fetchDepartures() {
  const res = await fetch(`${BASE}?access_key=${KEY}&dep_iata=LIN&limit=10`);
  const data = await res.json();
  return data.data || [];
}

async function fetchArrivals() {
  const res = await fetch(`${BASE}?access_key=${KEY}&arr_iata=LIN&limit=10`);
  const data = await res.json();
  return data.data || [];
}

function formatTime(dt) {
  if (!dt) return "--:--";
  return dt.substring(11, 16);
}

function normalizeStatus(status) {
  switch ((status || "").toLowerCase()) {
    case "landed": return "landed";
    case "boarding": return "boarding";
    case "delayed": return "delayed";
    case "scheduled": return "on-time";
    case "active": return "on-time";
    default: return "on-time";
  }
}

async function fetchFlights() {
  try {
    const res = await fetch(ENDPOINT);
    const data = await res.json();

    const flights = (data.data || []).slice(0, 8);

    const mapped = flights.map(f => ({
      time: formatTime(f.departure?.scheduled),
      flight: f.flight?.iata || "N/A",
      city: f.arrival?.city || "Unknown",
      airport: f.arrival?.airport || "Unknown",
      status: normalizeStatus(f.flight_status)
    }));

    renderTable(mapped);
  } catch (err) {
    console.error("API error", err);

    // fallback elegante (mai schermata vuota)
    renderTable([
      { time: "--:--", flight: "SYSTEM", city: "LIVE DATA TEMPORARILY UNAVAILABLE", status: "delayed" }
    ]);
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
    table.innerHTML += `
      <tr>
        <td>${f.time}</td>
        <td>${f.flight}</td>
        <td>${f.city}</td>
        <td class="${statusClass(f.status)}">${f.status.toUpperCase()}</td>
      </tr>
    `;
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

// refresh intelligente (hotel-safe)
setInterval(fetchFlights, 120000);

// switch board
setInterval(switchBoard, 20000);

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const el = document.getElementById("liveClock");
  if (el) el.innerText = `LOCAL TIME: ${time}`;
}

setInterval(updateClock, 1000);
updateClock();
