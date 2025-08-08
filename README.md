
# Seaside Invest v5.3 – Demo (static)

**Mål:** Vise en proff, megler-stil demo (mørkt tema) med personlige dashboards for Sondre og Stine + Seaside Health.
Dummy-tall brukes nå, men strukturen er klar for live-data senere.

## Innhold
- Broker-style UI (dark + neon accents)
- Dashboards: formue, lån (inkl. billån og Stines studielån), buffer, cashflow, utleie, budsjett, mål
- Seaside Health: matplan, trening, helseoversikt
- Boost motivator (100 meldinger)

## Kjør lokalt
1. Pakk ut zip.
2. Åpne `index.html` i nettleser.
   - Hvis du bruker Chrome og ser tomt innhold pga. `fetch` fra filsystemet, start en enkel server:
     ```
     # Python 3
     python -m http.server 8080
     # Gå til http://localhost:8080
     ```

## Bytte mellom Sondre og Stine
- Bruk lenkene i sidefeltet eller URL-hash: `#/switch/sondre` eller `#/switch/stine`.

## Struktur for live-data (forberedt)
- `assets/data/dummy.json` er dagens datakilde.
- Plan videre:
  - Google Sheets → JSON endpoint (AppScript/Netlify function) → erstatt `dummy.json`-fetch i `assets/js/app.js`.
  - Plassholdere for Airbnb/Booking.com: legg til ny `rentals.json` og slå sammen i `loadData()`.

## Skjermbilder
- Ligger i `screenshots/` som demo-plakater. Ta ekte skjermbilder ved å åpne siden i nettleser.

## Lisens og bruk
- Kun demo. Interne ressurser, ingen tredjepartsbibliotek nødvendig.
