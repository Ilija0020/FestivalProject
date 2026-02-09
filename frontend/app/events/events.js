const API_URL = "http://localhost:5065/api/Events";
const ARTISTS_API_URL = "http://localhost:5065/api/Artists";

document.addEventListener("DOMContentLoaded", () => {
  ucitajFestivale();
  document
    .getElementById("btn-create")
    .addEventListener("click", dodajFestival);
});

async function ucitajFestivale() {
  const grid = document.getElementById("events-grid");
  grid.innerHTML = "<p>Učitavam...</p>";

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    grid.innerHTML = "";
    data.forEach((event) => {
      const datumPrikaz = new Date(event.date).toLocaleDateString("sr-RS");
      const datumRaw = event.date.split("T")[0];

      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
                <h3>${event.name}</h3>
                <p>📍 ${event.city}</p>
                <p>📅 ${datumPrikaz}</p>
                <div class="card-actions">
                    <button class="btn-blue" onclick="otvoriLinkModal(${event.id}, '${event.name}')" title="Dodaj Izvođača">➕🎤</button>
                    
                    <button class="btn-edit" onclick="otvoriEditModal(${event.id}, '${event.name}', '${event.city}', '${datumRaw}')" title="Izmeni">✏️</button>
                    <button class="btn-red" onclick="obrisiFestival(${event.id})" title="Obriši">🗑️</button>
                </div>
            `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    grid.innerHTML = "<p>Greška pri učitavanju.</p>";
  }
}

async function dodajFestival() {
  const novi = {
    name: document.getElementById("novi-naziv").value,
    city: document.getElementById("novi-grad").value,
    date: document.getElementById("novi-datum").value,
  };

  if (!novi.name || !novi.city || !novi.date) {
    alert("Popuni sva polja!");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novi),
  });

  document.getElementById("novi-naziv").value = "";
  document.getElementById("novi-grad").value = "";
  document.getElementById("novi-datum").value = "";
  ucitajFestivale();
}

async function obrisiFestival(id) {
  if (confirm("Da li sigurno želiš da obrišeš ovaj festival?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    ucitajFestivale();
  }
}

function otvoriEditModal(id, naziv, grad, datum) {
  document.getElementById("edit-id").value = id;
  document.getElementById("edit-naziv").value = naziv;
  document.getElementById("edit-grad").value = grad;
  document.getElementById("edit-datum").value = datum;
  document.getElementById("modal-edit").style.display = "flex";
}

async function sacuvajIzmenu() {
  const id = document.getElementById("edit-id").value;
  const updateData = {
    id: id,
    name: document.getElementById("edit-naziv").value,
    city: document.getElementById("edit-grad").value,
    date: document.getElementById("edit-datum").value,
  };

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });

  zatvoriModale();
  ucitajFestivale();
}

async function otvoriLinkModal(eventId, eventName) {
  document.getElementById("link-event-id").value = eventId;
  document.getElementById("link-event-name").innerText = eventName;

  const select = document.getElementById("select-artist");
  select.innerHTML = "<option>Učitavam...</option>";

  try {
    const res = await fetch(ARTISTS_API_URL);
    const artists = await res.json();

    select.innerHTML = "";
    artists.forEach((artist) => {
      const option = document.createElement("option");
      option.value = artist.id;
      option.innerText = `${artist.name} (${artist.genre})`;
      select.appendChild(option);
    });

    document.getElementById("modal-link").style.display = "flex";
  } catch (err) {
    alert("Ne mogu da učitam izvođače.");
  }
}

async function sacuvajPovezivanje() {
  const eventId = document.getElementById("link-event-id").value;
  const artistId = document.getElementById("select-artist").value;

  if (!artistId) {
    alert("Moraš izabrati izvođača!");
    return;
  }

  try {
    const getRes = await fetch(`${API_URL}/${eventId}`);
    const event = await getRes.json();

    const vecPostoji = event.artists.some((a) => a.id == artistId);
    if (vecPostoji) {
      alert("Ovaj izvođač je već na listi za ovaj festival!");
      return;
    }

    event.artists.push({ id: parseInt(artistId) });

    const updateRes = await fetch(`${API_URL}/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    if (updateRes.ok) {
      alert("Uspešno povezano! 🎤🎉");
      zatvoriModale();
      ucitajFestivale();
    } else {
      alert("Greška pri čuvanju.");
    }
  } catch (err) {
    console.error(err);
    alert("Greška u komunikaciji.");
  }
}

function zatvoriModale() {
  document.getElementById("modal-edit").style.display = "none";
  document.getElementById("modal-link").style.display = "none";
}
window.onclick = function (event) {
  if (event.target.className === "modal-overlay") {
    zatvoriModale();
  }
};
