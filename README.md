# Festival Management System 🎸

> Full-stack aplikacija za upravljanje festivalskim nastupima, izvođačima i događajima.

## 📖 O Projektu

Ovaj sistem omogućava kompletnu organizaciju festivala. Povezuje izvođače sa događajima, omogućava kreiranje satnica i upravljanje binama. Projekat je dizajniran sa jasnom separacijom između **Backend** (API) i **Frontend** (Klijent) dela.

## 🛠 Tehnologije

### Backend

- **Framework:** ASP.NET Core Web API 8.0
- **Baza podataka:** SQLite
- **Princip:** ADO.NET (Sirovi SQL upiti za maksimalnu kontrolu)
- **Arhitektura:** RESTful API

### Frontend

- **Jezici:** HTML5, JavaScript (ES6+), SCSS
- **Komunikacija:** Fetch API (Asinhrona komunikacija sa backend-om)
- **Stilizacija:** Custom SCSS (Nema gotovih CSS framework-a)

## ✨ Ključne Funkcionalnosti

- **Upravljanje Festivalima:** Kreiranje, izmena i pregled festivala.
- **Organizacija Izvođača:** Evidencija bendova i solo izvođača.
- **Satnica i Raspored:** Dodeljivanje termina i bina izvođačima.
- **Pretraga i Filtriranje:** Brzo pronalaženje događaja.

## 📂 Struktura Projekta

```
FestivalProject/
├── backend/          # ASP.NET Core rešenje
│   ├── Controllers/  # API Endpoints
│   ├── Models/       # Domen modeli
│   └── Repositories/ # Logika za pristup bazi
├── frontend/         # Klijentska aplikacija
│   ├── css/          # Kompajlirani CSS
│   ├── scss/         # Izvorni stilovi
│   └── js/           # App logika
└── README.md
```

## 🚀 Kako Pokrenuti

### Preduslovi

Pre pokretanja, osigurajte da imate instalirano:

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) ili VS Code
- Browser po izboru

### Koraci za instalaciju

1. **Klonirajte repozitorijum:**

   ```bash
   git clone <url-do-repozitorijuma>
   ```

2. **Pokretanje Backend-a:**
   - Otvorite `FestivalProject.sln` rešenje.
   - Proverite `appsettings.json` za konekcioni string (SQLite baza se obično kreira automatski ili se nalazi u folderu).
   - Pokrenite projekat (**F5** ili `dotnet run`).
   - Swagger dokumentacija će biti dostupna na `https://localhost:7xxx/swagger`.

3. **Pokretanje Frontend-a:**
   - Otvorite `frontend` folder u VS Code-u.
   - Pokrenite **index.html** koristeći _Live Server_ ekstenziju (ili otvorite fajl direktno).

## 📝 Napomene

- Proverite da li frontend gađa ispravan port na backend-u (podesite `Base URL` u JS fajlovima ako je potrebno).
- Baza podataka je lokalna (SQLite), tako da nije potrebna instalacija SQL servera.
