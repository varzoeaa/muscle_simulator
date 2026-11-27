# Fejlesztési állapot

Utolsó frissítés: 2026-11-26 – Phase 0–5 vertikális prototípus a nagy mellizomhoz.

## Mi készült el és mi működik ténylegesen

| Terület | Funkció | Ellenőrzés |
|---|---|---|
| Alapok | Vite + React + TS strict, Tailwind 4 tokenek, világos/sötét mód egy gombbal (elmentve, villanásmentes betöltés), HashRouter | böngészőben ellenőrizve |
| Navigáció | Kezdőoldal 4 izomkártyával (3 „fejlesztés alatt”, nem kattintható), izomválasztó, modulnavigáció (asztali oldalsáv / mobil fülek), az izom modulváltáskor megmarad | böngészőben (1400 px és 820 px szélesség) |
| Anatomy Lab | Elülső nézet és felülnézet; kattintással / listából választható izom és 3 izomrész; kiemelés, halványítás, izolálás; rétegek (csont, felületes, mély izmok, eredés/tapadás, ízületek, feliratok); eredés területként/sávként (E), tapadás szaggatott sávként (T); nagyítás, pásztázás; adatlap háromnyelvű terminusokkal, megbízhatósági jelvényekkel és forrásjegyzékkel; szerepek mozgásonként | böngészőben |
| Biomechanics Lab | Az Anatomy Labban felsorolt minden funkció animálva: közelítés (elülső nézet), horizontális közelítés (felülnézet), befelé forgatás (felülnézet, kar a törzs mellett), hajlítás és feszítés hajlított helyzetből (oldalnézet), rögzített karú húzódzkodás (zárt lánc, inverz kinematika), járulékos belégzés rögzített felkarral; koncentrikus/excentrikus/izometriás mód; aktivitás és hosszváltozás külön jelölve; lejátszás, szünet, visszatekerés, idővonal, 0,25–2× sebesség, alaphelyzet; megjelenítési mód (kiválasztott / agonisták / antagonisták / szinergisták / minden) szín + mintázat + betűjel; a mozgások a fő nézet mellett elöl- és/vagy hátulnézetben is láthatók (egymás mellett, vetülettel; hátulnézet a hátsó vállövi izmokkal); szerepkör-módban a jelölt izmok előtérbe kerülnek és mindig feliratot kapnak (ütközéskerüléssel), az adott nézetből nem látható izmok (pl. rombuszizmok) listában, „nem látható” jelöléssel szerepelnek | böngészőben + egységtesztek |
| Anatomy Lab – kulcscsont alatti izom | Teljes adatlap (eredés, tapadás, beidegzés a kulcscsont alatti ideggel, funkciók, érintett ízületek, szerepek három mozgásban, stabilizáló funkció, klinikai összefüggések, vérellátás, változatok), elöl- és oldalnézetben eredés- és tapadásjelöléssel. Biomechanics Lab: három animáció (kulcscsont süllyesztése, vállöv süllyesztése, az 1. borda emelése) nagyított vállöv-kivágásban. Az Exercise Lab és a Study Mode „fejlesztés alatt” üzenetet ad. | böngészőben + egységtesztek |
| Anatomy Lab – kis mellizom | Teljes adatlap (eredés, tapadás, beidegzés, funkciók, érintett ízületek, szerepek öt lapockamozgásban, stabilizáló funkció, klinikai összefüggések, változatok), elülső nézetben eredés- és tapadásjelöléssel; mély izom kiválasztásakor a felületes izmok áttetszők. Biomechanics Lab: öt animáció (süllyesztés, lefelé rotáció, protrakció, előrebillenés, járulékos belégzés) mozgó vállövű elöl-, felül- és oldalnézetben, szerepkör-megjelenítéssel. Exercise Lab: három gyakorlat (lapocka-süllyesztés támaszban, fekvőtámasz plusz, egykaros nyújtás) szakaszonkénti szerepekkel. Study Mode: 57 feladat minden témakörben (köztük ábrás felismerés elöl- és oldalnézetben, áttetsző felületes réteggel) és 15 tanulókártya. | böngészőben + egységtesztek |
| Exercise Lab | 10 nagy mellizom-gyakorlat (köztük két nyújtás), választható listából: fekvenyomás rúddal és kézisúlyzóval (oldalnézet, paddőlés), gépes mellnyomás, fekvőtámasz, tolódzkodás (oldalnézeti figura, zárt láncnál rögzített kéz), kézisúlyzós tárogatás, pec deck, csigás kereszthúzás, egykaros mellizomnyújtás (felülnézet az anatómiai ábrával). ROM, súly (rúd, kezenként, súlyoszlop), szakaszválasztás; izomszerepek (AG/SZ/AN/ST, nyújtásnál NY) szakaszonként a panelen és feliratként az animáción | böngészőben + egységtesztek |
| Study Mode | 30 tanulókártya, 93 kérdés minden témakörben legalább öttel (feleletválasztós, ábrás izomfelismerés elöl-, oldal- és hátulnézetben, eredés és tapadás jelölése, párosítás, hiányos szöveg, működési típusok, gyakorlatok); a válaszlehetőségek sorrendje véletlenszerű; gyakorlás azonnali visszajelzéssel, magyarázattal, kapcsolódó tananyag-linkkel; vizsgamód (témakör, kérdésszám, véletlen sorrend, pontszám, %, értékelés, áttekintés, hibás kérdések gyakorlása); eredmények és adattörlés | böngészőben + egységtesztek |
| PWA | manifest, service worker (Workbox precache), offline működés | `npm run preview` alatt: SW aktív, 7 fájl precache-elve |

## Tesztek

`npm test` – 5 tesztfájl, 52 teszt, mind sikeres: adatmodell-validálás (forrás- és struktúrahivatkozások, frame-ek, kérdés-konzisztencia), izomválasztás, animációs állapotgép (lejátszás, szünet, visszatekerés, loop, seek, reset), működési típusok, ROM, paddőlés-kinematika, tárcsaszámítás, témaváltás, helyi tárolás, pontszámítás, hibás kérdések ismétlése. `npm run build` – típusellenőrzés és build hibamentes.

## Mi nincs még implementálva

- Kis mellizom, kulcscsont alatti izom, elülső fűrészizom önálló moduljai (az ábrán kontextusként szerepelnek); az elülső fűrészizom rostcsoportjai.
- Hátulsó anatómiai nézet; a lapocka együttmozgása az animációkban.
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
