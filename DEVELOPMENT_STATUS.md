# Fejlesztési állapot

Utolsó frissítés: 2026-11-26 – Phase 0–5 vertikális prototípus a nagy mellizomhoz.

## Mi készült el és mi működik ténylegesen

| Terület | Funkció | Ellenőrzés |
|---|---|---|
| Alapok | Vite + React + TS strict, Tailwind 4 tokenek, világos/sötét mód egy gombbal (elmentve, villanásmentes betöltés), HashRouter | böngészőben ellenőrizve |
| Navigáció | Kezdőoldal 4 izomkártyával (3 „fejlesztés alatt”, nem kattintható), izomválasztó, modulnavigáció (asztali oldalsáv / mobil fülek), az izom modulváltáskor megmarad | böngészőben (1400 px és 820 px szélesség) |
| Anatomy Lab | Elülső nézet és felülnézet; kattintással / listából választható izom és 3 izomrész; kiemelés, halványítás, izolálás; rétegek (csont, felületes, mély izmok, eredés/tapadás, ízületek, feliratok); eredés területként/sávként (E), tapadás szaggatott sávként (T); nagyítás, pásztázás; adatlap háromnyelvű terminusokkal, megbízhatósági jelvényekkel és forrásjegyzékkel; szerepek mozgásonként | böngészőben |
| Biomechanics Lab | Vállízületi közelítés (elülső nézet) és horizontális közelítés (felülnézet); koncentrikus/excentrikus/izometriás mód; aktivitás és hosszváltozás külön jelölve; lejátszás, szünet, visszatekerés, idővonal, 0,25–2× sebesség, alaphelyzet; megjelenítési mód (kiválasztott / agonisták / antagonisták / szinergisták / minden) szín + mintázat + betűjel | böngészőben + egységtesztek |
| Exercise Lab | Fekvenyomás oldalnézetben: ROM-csúszka (25–100%), paddőlés (−15° … 60°, a test és a pad geometriája ténylegesen változik), súly (20–180 kg, tárcsák oldalanként kirajzolva), szakaszválasztás (teljes / excentrikus / izometriás / koncentrikus) | böngészőben + egységtesztek |
| Study Mode | 11 tanulókártya, 18 kérdés (feleletválasztós, ábrás izomfelismerés, eredés és tapadás jelölése, párosítás, hiányos szöveg, működési típusok, gyakorlatok); gyakorlás azonnali visszajelzéssel, magyarázattal, kapcsolódó tananyag-linkkel; vizsgamód (témakör, kérdésszám, véletlen sorrend, pontszám, %, értékelés, áttekintés, hibás kérdések gyakorlása); eredmények és adattörlés | böngészőben + egységtesztek |
| PWA | manifest, service worker (Workbox precache), offline működés | `npm run preview` alatt: SW aktív, 7 fájl precache-elve |

## Tesztek

`npm test` – 4 tesztfájl, 41 teszt, mind sikeres: adatmodell-validálás (forrás- és struktúrahivatkozások, frame-ek, kérdés-konzisztencia), izomválasztás, animációs állapotgép (lejátszás, szünet, visszatekerés, loop, seek, reset), működési típusok, ROM, paddőlés-kinematika, tárcsaszámítás, témaváltás, helyi tárolás, pontszámítás, hibás kérdések ismétlése. `npm run build` – típusellenőrzés és build hibamentes.

## Mi nincs még implementálva

- Kis mellizom, kulcscsont alatti izom, elülső fűrészizom önálló moduljai (az ábrán kontextusként szerepelnek); az elülső fűrészizom rostcsoportjai.
- Befelé forgatás, vállízületi hajlítás és feszítés animációja; oldalsó és hátulsó anatómiai nézet.
- A nagy mellizom további 10 gyakorlata (a listában „tervezett” jelöléssel, nem kattinthatók).
- Idegek ábrázolása (ellenőrzött geometria hiányában).
- Automatizált komponens- / E2E-tesztek (jelenleg egységtesztek + kézi böngészős ellenőrzés).

## Felmerült technikai problémák

- Nincs nyílt licencű, rétegezett 2D anatómiai geometria → saját szerkesztésű ábrák (MODEL_LIMITATIONS.md).
- Az animációs motor első verziója az első képkockán megállt (határfeltétel-hiba) – javítva, egységteszt fedi.
- A beágyazott fejlesztői böngészőpanel a `requestAnimationFrame`-et ~2 fps-re lassítja; a képkocka-delta korlátja ezért 250 ms (normál böngészőben 60 fps).

## Ellenőrzésre váró anatómiai információk

Lásd MODEL_LIMITATIONS.md – szinergista szerepek pontosítása, bordaporc-szám (1–6 vs. 1–7), tankönyvi kiadási adatok, és az ábrák szakmai lektorálása.

## Következő implementációs lépés

Szakmai lektorálás az elülső nézetre, majd oldalnézet (vállízületi hajlítás/feszítés) és a kis mellizom integrálása lapocka-frame-mel (ROADMAP.md).
