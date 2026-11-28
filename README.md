# Myo – interaktív anatómia és biomechanika

Interaktív, magyar nyelvű anatómiai és biomechanikai oktatási webalkalmazás (PWA) fitnessinstruktor-tanulóknak, személyi edzőknek, sporttudományi hallgatóknak és edzőtermi sportolóknak.

Az első verzió (vertikális prototípus) a **nagy mellizomhoz** (m. pectoralis major) tartalmaz teljes, négy modulból álló tananyagot:

| Modul | Alcím | Tartalom |
|---|---|---|
| Anatómia | Izmok, eredés, tapadás, beidegzés | interaktív 2D SVG-modell (elülső nézet, felülnézet), izomrészek, eredés/tapadás, beidegzés, funkciók, szerepek mozgásonként, források |
| Biomechanika | Izomműködés és mozgásanimációk | vállízületi közelítés és horizontális közelítés animációja; koncentrikus / excentrikus / izometriás működés; agonista / antagonista / szinergista megjelenítés |
| Gyakorlatok | Edzőtermi mozdulatok szakaszonként | fekvenyomás oldalnézeti animációja állítható mozgástartománnyal, paddőlésszöggel és szemléltető súllyal |
| Tanulás | Kártyák, gyakorlás, vizsga | tanulókártyák, gyakorlás azonnali visszajelzéssel, vizsgamód, hibás kérdések ismétlése, helyi eredménytárolás |

A kis mellizom, a kulcscsont alatti izom és az elülső fűrészizom kártyái „fejlesztés alatt” jelöléssel szerepelnek; az ábrákon kontextusként már megjelennek.

## Telepítés és futtatás

Előfeltétel: Node.js 20+ (fejlesztve: Node 24, npm 11).

```bash
npm install
npm run dev        # fejlesztői szerver: http://localhost:5173
npm test           # egységtesztek (Vitest)
npm run build      # típusellenőrzés + éles build a dist/ mappába (PWA service workerrel)
npm run preview    # az éles build helyi kiszolgálása
```

## Telepítés GitHub Pages-re

Az alkalmazás statikus, backend nélküli. A HashRouter miatt nincs szükség szerveroldali átirányításra.

```bash
npm run build              # relatív útvonalakkal (base: './') – bármely alkönyvtárban működik
# vagy explicit alútvonallal:
BASE_PATH=/musclelab/ npm run build
```

A `dist/` mappa tartalmát kell a `gh-pages` ágra vagy a Pages forrásmappájába feltölteni.

## Offline működés és adatok

- A teljes tananyag a build része; a service worker első betöltés után minden fájlt gyorsítótáraz.
- A témaválasztás, a tanulási előrehaladás, a vizsgaeredmények és a hibás válaszok a böngésző LocalStorage-ában tárolódnak (`musclelab:settings`, `musclelab:study`). Törlés: Tanulás → Eredmények → Tanulási adatok törlése.
- Nincs regisztráció, nincs külső API, nincs adatgyűjtés.

## Dokumentáció

- [PRODUCT_SPEC.md](PRODUCT_SPEC.md) – termékkövetelmények
- [ARCHITECTURE.md](ARCHITECTURE.md) – technikai architektúra
- [ROADMAP.md](ROADMAP.md) – fejlesztési szakaszok
- [SCIENTIFIC_SOURCES.md](SCIENTIFIC_SOURCES.md) – tudományos források
- [DATA_LICENSES.md](DATA_LICENSES.md) – adatforrások és licencek (Phase 0 kutatás)
- [MODEL_LIMITATIONS.md](MODEL_LIMITATIONS.md) – anatómiai és modellezési korlátok
- [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md) – elkészült és hiányzó funkciók

> A 2D ábrák és animációk egyszerűsített oktatási szemléltetések, nem klinikailag validált biomechanikai szimulációk. Az alkalmazás nem diagnosztikai és nem rehabilitációs eszköz.
