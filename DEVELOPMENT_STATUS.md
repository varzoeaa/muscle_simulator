# Fejlesztési állapot

Utolsó frissítés: 2026-11-26 – Phase 0–5 vertikális prototípus a nagy mellizomhoz.

## Mi készült el és mi működik ténylegesen

| Terület | Funkció | Ellenőrzés |
|---|---|---|
| Alapok | Vite + React + TS strict, Tailwind 4 tokenek, világos/sötét mód egy gombbal (elmentve, villanásmentes betöltés), HashRouter | böngészőben ellenőrizve |
| Navigáció | Kezdőoldal 4 izomkártyával (3 „fejlesztés alatt”, nem kattintható), izomválasztó, modulnavigáció (asztali oldalsáv / mobil fülek), az izom modulváltáskor megmarad | böngészőben (1400 px és 820 px szélesség) |
| Anatómia | Elülső nézet és felülnézet; kattintással / listából választható izom és 3 izomrész; kiemelés, halványítás, izolálás; rétegek (csont, felületes, mély izmok, eredés/tapadás, ízületek, feliratok); eredés területként/sávként (E), tapadás szaggatott sávként (T); nagyítás, pásztázás; adatlap háromnyelvű terminusokkal, megbízhatósági jelvényekkel és forrásjegyzékkel; szerepek mozgásonként | böngészőben |
| Biomechanika | Az Anatómia modulban felsorolt minden funkció animálva: közelítés (elülső nézet), horizontális közelítés (felülnézet), befelé forgatás (felülnézet, kar a törzs mellett), hajlítás és feszítés hajlított helyzetből (oldalnézet), rögzített karú húzódzkodás (zárt lánc, inverz kinematika), járulékos belégzés rögzített felkarral; koncentrikus/excentrikus/izometriás mód; aktivitás és hosszváltozás külön jelölve; lejátszás, szünet, visszatekerés, idővonal, 0,25–2× sebesség, alaphelyzet; megjelenítési mód (kiválasztott / agonisták / antagonisták / szinergisták / minden) szín + mintázat + betűjel; a mozgások a fő nézet mellett elöl- és/vagy hátulnézetben is láthatók (egymás mellett, vetülettel; hátulnézet a hátsó vállövi izmokkal); szerepkör-módban a jelölt izmok előtérbe kerülnek és mindig feliratot kapnak (ütközéskerüléssel), az adott nézetből nem látható izmok (pl. rombuszizmok) listában, „nem látható” jelöléssel szerepelnek | böngészőben + egységtesztek |
| Kezdőoldal – felületes hátizmok | Külön szekció a mellizmok mellett: csuklyásizom (elérhető), lapockaemelő izom, rombuszizmok (közös kártya, a kis és nagy rombuszizom adatszinten külön), széles hátizom (fejlesztés alatt). A kártyák a muscleSections adatból készülnek. | böngészőben |
| Anatómia – csuklyásizom | Teljes adatlap hátulnézettel: a teljes izom és három régió (pars descendens, transversa, ascendens) eredéssel, tapadással, rostiránnyal és funkcióval; beidegzés (XI. agyideg, C3–C4), vállövi működés, a lapocka egyéb térbeli mozgásai, fej és nyak, ízületi kapcsolatok, szerepek, stabilizálás, forrásjegyzék; tájékozódási feliratok a hátsó ábrán. A Biomechanika, a Gyakorlatok és a Tanulás modul később készül. | böngészőben, `npm test` |
| Anatómia – elülső fűrészizom | Teljes adatlap három izomrésszel (felső: 1–2. borda → felső szög; középső: 2–3. borda → belső szél; alsó: 4–9. borda → alsó szög), részenkénti eredéssel, tapadással, beidegzéssel és funkcióval; beidegzés a hosszú mellkasi ideggel (C5–C7, új idegadat), funkciók, érintett ízületek, szerepek négy mozgásban (protrakció, felfelé rotáció, hátrabillentés, járulékos belégzés), stabilizáló funkció, nyálkatömlők, vérellátás, szárnyas lapocka és egyéb klinikai összefüggések, változatok. Oldalnézetben (alapnézet) mindhárom rész eredés- és tapadásjelöléssel, elölnézetben a részek és a bordai eredések, felülnézetben az egész izom eredéssel és tapadással. A más izmok által takart izom kiválasztásakor a fölötte fekvő izmok áttetszők. Biomechanika: négy animáció – protrakció (mozgó vállövű felülnézet), felfelé rotáció (új, mozgó lapockás hátulnézet, ahol az izom mély rétegként, a lapocka mögött látszik), hátrabillentés (billenő lapockás oldalnézet), a bordák emelése rögzített vállövvel (emelkedő mellkasú elölnézet) –, részenkénti megjegyzésekkel; tesztelve, hogy koncentrikus működésnél az eredés és a tapadás közeledik. Gyakorlatok: három gyakorlat – fekvő serratus-nyomás kézisúlyzóval (felülnézet), fekvőtámasz plusz (a kis mellizommal közös), karemelés a lapocka síkjában fej fölé (mozgó lapockás hátulnézet, a kar és a lapocka együtt mozog) – szakaszonkénti szerepekkel és minőségileg idézett EMG-eredményekkel (Decker 1999, Ekstrom 2003, Castelein 2016). Tanulás: 55 feladat minden témakörben (köztük ábrás felismerés elöl- és felülnézetben, részfelismerés, eredés és tapadás jelölése) és 14 tanulókártya; a takart izomra kérdező ábrás feladatban a takaró izmok áttetszők, a keresett izom felülre kerül, és a kijelölt izomrész az izom nevével együtt jelenik meg. | böngészőben + egységtesztek |
| Anatómia – kulcscsont alatti izom | Teljes adatlap (eredés, tapadás, beidegzés a kulcscsont alatti ideggel, funkciók, érintett ízületek, szerepek három mozgásban, stabilizáló funkció, klinikai összefüggések, vérellátás, változatok), elöl- és oldalnézetben eredés- és tapadásjelöléssel. Biomechanika: három animáció (kulcscsont süllyesztése, vállöv süllyesztése, az 1. borda emelése) nagyított vállöv-kivágásban. Gyakorlatok: három gyakorlat (lapocka-süllyesztés támaszban – közös a kis mellizommal –, lapocka-lehúzás csigán, vállvonogatás, ahol antagonista). Tanulás: 53 feladat minden témakörben (köztük ábrás felismerés elöl- és oldalnézetben) és 13 tanulókártya. | böngészőben + egységtesztek |
| Anatómia – kis mellizom | Teljes adatlap (eredés, tapadás, beidegzés, funkciók, érintett ízületek, szerepek öt lapockamozgásban, stabilizáló funkció, klinikai összefüggések, változatok), elülső nézetben eredés- és tapadásjelöléssel; mély izom kiválasztásakor a felületes izmok áttetszők. Biomechanika: öt animáció (süllyesztés, lefelé rotáció, protrakció, előrebillenés, járulékos belégzés) mozgó vállövű elöl-, felül- és oldalnézetben, szerepkör-megjelenítéssel. Gyakorlatok: három gyakorlat (lapocka-süllyesztés támaszban, fekvőtámasz plusz, egykaros nyújtás) szakaszonkénti szerepekkel. Tanulás: 57 feladat minden témakörben (köztük ábrás felismerés elöl- és oldalnézetben, áttetsző felületes réteggel) és 15 tanulókártya. | böngészőben + egységtesztek |
| Gyakorlatok | 10 nagy mellizom-gyakorlat (köztük két nyújtás), választható listából: fekvenyomás rúddal és kézisúlyzóval (oldalnézet, paddőlés), gépes mellnyomás, fekvőtámasz, tolódzkodás (oldalnézeti figura, zárt láncnál rögzített kéz), kézisúlyzós tárogatás, pec deck, csigás kereszthúzás, egykaros mellizomnyújtás (felülnézet az anatómiai ábrával). ROM, súly (rúd, kezenként, súlyoszlop), szakaszválasztás; izomszerepek (AG/SZ/AN/ST, nyújtásnál NY) szakaszonként a panelen és feliratként az animáción | böngészőben + egységtesztek |
| Tanulás | 30 tanulókártya, 93 kérdés minden témakörben legalább öttel (feleletválasztós, ábrás izomfelismerés elöl-, oldal- és hátulnézetben, eredés és tapadás jelölése, párosítás, hiányos szöveg, működési típusok, gyakorlatok); a válaszlehetőségek sorrendje véletlenszerű; gyakorlás azonnali visszajelzéssel, magyarázattal, kapcsolódó tananyag-linkkel; vizsgamód (témakör, kérdésszám, véletlen sorrend, pontszám, %, értékelés, áttekintés, hibás kérdések gyakorlása); eredmények és adattörlés | böngészőben + egységtesztek |
| PWA | manifest, service worker (Workbox precache), offline működés | `npm run preview` alatt: SW aktív, 7 fájl precache-elve |

## Tesztek

`npm test` – 5 tesztfájl, 52 teszt, mind sikeres: adatmodell-validálás (forrás- és struktúrahivatkozások, frame-ek, kérdés-konzisztencia), izomválasztás, animációs állapotgép (lejátszás, szünet, visszatekerés, loop, seek, reset), működési típusok, ROM, paddőlés-kinematika, tárcsaszámítás, témaváltás, helyi tárolás, pontszámítás, hibás kérdések ismétlése. `npm run build` – típusellenőrzés és build hibamentes.

## Mi nincs még implementálva

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
