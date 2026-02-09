const API_URL = "http://localhost:5065/api/Artists";
const EVENTS_API_URL = "http://localhost:5065/api/Events";

document.addEventListener("DOMContentLoaded", () => {
  ucitajIzvodjace();
  document
    .getElementById("btn-create")
    .addEventListener("click", dodajNovogIzvodjaca);
});

async function ucitajIzvodjace() {
  const grid = document.getElementById("artists-grid");
  grid.innerHTML = "<p>Učitavam...</p>";

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    grid.innerHTML = "";
    data.forEach((artist) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
                <h3>${artist.name}</h3>
                <p>🎭 ${artist.genre}</p>
                <p>📍 ${artist.country}</p>
                <div class="card-actions">
                    <button class="btn-purple" onclick="otvoriLinkModal(${artist.id}, '${artist.name}')" title="Dodaj Festival">➕📅</button>
                    <button class="btn-edit" onclick="otvoriEditModal(${artist.id}, '${artist.name}', '${artist.genre}', '${artist.country}')" title="Izmeni">✏️</button>
                    <button class="btn-red" onclick="obrisiIzvodjaca(${artist.id})" title="Obriši">🗑️</button>
                </div>
            `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    grid.innerHTML = "<p>Greška pri učitavanju.</p>";
  }
}

async function dodajNovogIzvodjaca() {
  const novi = {
    name: document.getElementById("novi-ime").value,
    genre: document.getElementById("novi-zanr").value,
    country: document.getElementById("novi-drzava").value,
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novi),
  });

  document.getElementById("novi-ime").value = "";
  document.getElementById("novi-zanr").value = "";
  document.getElementById("novi-drzava").value = "";
  ucitajIzvodjace();
}

async function obrisiIzvodjaca(id) {
  if (confirm("Da li sigurno želiš da obrišeš ovog izvođača?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    ucitajIzvodjace();
  }
}

function otvoriEditModal(id, ime, zanr, drzava) {
  document.getElementById("edit-id").value = id;
  document.getElementById("edit-ime").value = ime;
  document.getElementById("edit-zanr").value = zanr;
  document.getElementById("edit-drzava").value = drzava;
  document.getElementById("modal-edit").style.display = "flex";
}

async function sacuvajIzmenu() {
  const id = document.getElementById("edit-id").value;
  const updateData = {
    id: id,
    name: document.getElementById("edit-ime").value,
    genre: document.getElementById("edit-zanr").value,
    country: document.getElementById("edit-drzava").value,
  };

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });

  zatvoriModale();
  ucitajIzvodjace();
}

async function otvoriLinkModal(artistId, artistName) {
  document.getElementById("link-artist-id").value = artistId;
  document.getElementById("link-artist-name").innerText = artistName;

  const select = document.getElementById("select-festival");
  select.innerHTML = "<option>Učitavam...</option>";

  try {
    const res = await fetch(EVENTS_API_URL);
    const festivali = await res.json();

    select.innerHTML = "";
    festivali.forEach((fest) => {
      const option = document.createElement("option");
      option.value = fest.id;
      option.innerText = `${fest.name} (${fest.city})`;
      select.appendChild(option);
    });

    document.getElementById("modal-link").style.display = "flex";
  } catch (err) {
    alert("Ne mogu da učitam festivale.");
  }
}

async function sacuvajPovezivanje() {
  const artistId = document.getElementById("link-artist-id").value;
  const festivalId = document.getElementById("select-festival").value;

  if (!festivalId) {
    alert("Moraš izabrati festival!");
    return;
  }

  try {
    const getRes = await fetch(`${API_URL}/${artistId}`);
    const artist = await getRes.json();

    const vecPostoji = artist.events.some((e) => e.id == festivalId);
    if (vecPostoji) {
      alert("Ovaj izvođač već nastupa na tom festivalu!");
      return;
    }

    artist.events.push({ id: parseInt(festivalId) });

    const updateRes = await fetch(`${API_URL}/${artistId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(artist),
    });

    if (updateRes.ok) {
      alert("Uspešno povezano! 🎉");
      zatvoriModale();
      ucitajIzvodjace();
    } else {
      alert("Greška pri čuvanju.");
    }
  } catch (err) {
    console.error(err);
    alert("Došlo je do greške u komunikaciji sa serverom.");
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
