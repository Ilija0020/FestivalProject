const API_URL = "http://localhost:5065/api/Artists";

document.addEventListener("DOMContentLoaded", () => {
  ucitajPodatke();
  setupModal();
});

async function ucitajPodatke() {
  const grid = document.getElementById("artists-grid");

  try {
    const odgovor = await fetch(API_URL);
    const izvodjaci = await odgovor.json();

    grid.innerHTML = "";

    izvodjaci.forEach((artist) => {
      const kartica = document.createElement("div");
      kartica.classList.add("card");

      kartica.innerHTML = `
                <h3>${artist.name}</h3>
                <p>📍 ${artist.country}</p>
                <span class="tag">🎵 ${artist.genre}</span>
            `;

      kartica.addEventListener("click", () => {
        otvoriModal(artist);
      });

      grid.appendChild(kartica);
    });
  } catch (greska) {
    console.error(greska);
    grid.innerHTML = "<p>Došlo je do greške pri učitavanju.</p>";
  }
}

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalGenre = document.getElementById("modal-genre");
const modalList = document.getElementById("modal-events-list");
const closeBtn = document.querySelector(".close-btn");

function otvoriModal(artist) {
  modalTitle.textContent = artist.name;
  modalGenre.textContent = `${artist.genre} | ${artist.country}`;

  modalList.innerHTML = "";

  if (artist.events && artist.events.length > 0) {
    artist.events.forEach((ev) => {
      let datum = "Nepoznat datum";
      if (ev.date) {
        datum = new Date(ev.date).toLocaleDateString("sr-RS");
      }

      const li = document.createElement("li");
      li.innerHTML = `<strong>${ev.name}</strong> (${ev.city}) <br> <small>📅 ${datum}</small>`;
      modalList.appendChild(li);
    });
  } else {
    modalList.innerHTML = "<li>❌ Nema zakazanih nastupa.</li>";
  }

  modal.style.display = "flex";
}

function setupModal() {
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  });
}
