
Seaside Invest v5.3 — FINAL (frontend demo)
===========================================
Innhold:
- index.html, okonomi.html, mal.html, health.html
- assets/style.css, js/app.js
- data/data.json (demo), data/sondre_msgs.json, data/stine_msgs.json

Nyheter i 5.3-final:
- Avatar-seksjon (initials, glossy bakgrunn)
- 100 motivasjonsmeldinger per person (Sondre og Stine) + "Neste"-knapp
- Oppgradert megler-stil (gradient, dybde, hover, animasjoner)
- Enkel cashflow-graf uten avhengigheter (canvas)

Slik tester du:
1) Last opp hele mappen til repoet som er koblet til Netlify
2) Åpne siden → trykk “Oppdater” for å hydrere data
3) Bytt bruker-tab (Sondre/Stine) og test "Neste"-knappen i motivasjonsfeltet

Klar for 5.4 (API):
- /data kan erstattes av Google Sheets/Apps Script endepunkt
- /js/app.js kan peke mot /api-ruter i Next.js for OpenAI

Build: 2025-08-09T11:43:40.815012
