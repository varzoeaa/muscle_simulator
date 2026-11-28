# Architektúra

## Technológiai stack

React 19 + TypeScript (strict, `noUncheckedIndexedAccess`) · Vite 8 · Tailwind CSS 4 · React Router 7 (HashRouter) · Zustand 5 (persist → LocalStorage) · Lucide ikonok · Vitest + jsdom · vite-plugin-pwa (Workbox). Animációk: tiszta SVG-transzformációk és `requestAnimationFrame`; külön animációs könyvtár nincs (nem volt rá szükség).

## Könyvtárstruktúra

```text
src/
├── app/                 App (router, hibahatár), modules.ts (a négy modul definíciója)
├── components/
│   ├── anatomy/         AnatomyViewer (rétegezett SVG-megjelenítő), BenchPressScene, RoleLegend
│   ├── animation/       AnimationControls (lejátszás, szünet, visszatekerés, idővonal, sebesség, alaphelyzet)
│   ├── layout/          AppShell (fejléc, témaváltás), MuscleLayout (izomválasztó + modulnavigáció)
│   └── ui/              Panel, TermBlock, EvidenceBadge, SourceList, Segmented, Toggle, Slider, Button, Disclaimer
├── features/            anatomy / biomechanics / exercises / study / home / sources – oldalszintű modulok
├── engines/
│   ├── animation/       animationEngine.ts (tiszta állapotgép), benchKinematics.ts (fekvenyomás 2D kinematika)
│   └── study/           studyEngine.ts (kiértékelés, pontszám, vizsga-összeállítás, hibás kérdések)
├── data/
│   ├── muscles/         izomadatlapok (pectoralisMajor.ts), kapcsolódó izmok névjegyzéke, közös registry
│   ├── bones/ joints/ nerves/ sources/
│   ├── geometry/        nézetenkénti 2D geometria (elülső, felül-, oldalnézet, kar a törzs mellett, zárt láncú és légzési változat)
│   ├── motions/         mozgásdefiníciók (MotionDefinition)
│   ├── exercises/       gyakorlatdefiníciók (Exercise)
│   └── questions/       kérdések és tanulókártyák
├── hooks/               useAnimationPlayer, useReducedMotion
├── stores/              settingsStore (téma, feliratok), studyStore (előrehaladás)
├── services/            storage.ts (tárolási adapter + hibatűrő LocalStorage)
├── types/               az összes adatmodell típusa
├── utils/               geometry.ts (mátrixok, frame-transzformációk, Catmull–Rom görbék)
└── tests/               Vitest egységtesztek
```

## Adat – geometria – megjelenítés szétválasztása

1. **Anatómiai adat** (`data/muscles`, `bones`, …): nevek (hu/en/la), eredés, tapadás, beidegzés, funkciók, szerepek mozgásonként. Minden állítás `Claim` – szöveg + `EvidenceLevel` + `sourceIds`.
2. **Geometria** (`data/geometry`): nézetenként `ViewGeometry`. A kulcselem a **frame-rendszer**: minden pont egy csont koordináta-rendszerében (`world`, `humerus`, `forearm`, `torso` …) van megadva. A frame-ek szülő–gyermek láncot alkotnak, és a póz (`Pose` – szögek kulcs szerint) forgatja őket.
   - Az izomkontúr pontjai vegyesen tartozhatnak a mellkashoz (eredés) és a felkarcsonthoz (tapadás); így a csont mozgatásakor az izom automatikusan nyúlik/rövidül.
   - Csontok: path a saját frame-jükben; izmok: zárt Catmull–Rom görbe; rostirányok: (eredés, tapadás) pontpárok, az izomkontúrra vágva.
   - Minden struktúra egyedi anatómiai azonosítót kap (`muscle-pectoralis-major-clavicular`, `bone-clavicle`, …), ezek az SVG `id`-jai.
3. **Mozgás** (`data/motions`): `MotionDefinition` = nézet + kiinduló/végső póz + működési típusok leírása + szerepek. Az `animationEngine.motionPose` a működési típus szerint interpolál; a `solvePose` (opcionális) a köztes pózból származtat teljes pózt (pl. a zárt láncú húzódzkodás inverz kinematikája), a `contractionTypes` pedig leszűkítheti a választható működési típusokat.
   - Frame-ek: forgatás (`angleKey`), vetületi rövidülés (`scaleYKey`) és eltolás (`translateYKey`, pl. a mellkas emelkedése belégzéskor).
   - Zárt lánc: a `ViewGeometry.sceneOffsetYKey` a teljes testet tolja el, a `fixtures` (pl. rúd) helyben marad.
   - Rajzolási sorrend oldalnézetben: a negatív `z` értékű izmok a `front` jelölésű csontok (felkar, alkar) mögé kerülnek.
4. **Megjelenítés** (`AnatomyViewer`): rétegek (csontok, mély izmok, felületes izmok, ízületek, eredés/tapadás, feliratok) kapcsolhatók; kiemelés, halványítás, izolálás, szerepkör-színezés (szín + mintázat + betűjel), nagyítás/pásztázás (gombok, Ctrl+görgő, húzás, nyílbillentyűk), billentyűzetes kiválasztás. A tükrözött oldal nem interaktív kontextus.

## Animációs motor

`engines/animation/animationEngine.ts` tiszta függvényekből áll (`tick`, `play`, `pause`, `rewind`, `reset`, `seek`, `setSpeed`, `setRange`), így teljesen egységtesztelt. A `useAnimationPlayer` hook köti `requestAnimationFrame`-hez; a ciklus csak lejátszás közben fut. A Gyakorlatok modul ugyanezt a motort használja ismétlődő lejátszással és szakasz-tartománnyal (`range`).

## Állapot és tárolás

- URL tartalmazza a kiválasztott izmot és modult (`#/izom/nagy-mellizom/biomechanika`) – modulváltáskor az izom megmarad.
- Zustand store-ok `persist` middleware-rel, a `services/storage.ts` hibatűrő adapterén keresztül (privát mód / tiltott tároló esetén memóriába esik vissza). A `StorageAdapter` felület később backendre cserélhető.

## Bővítés új izommal

1. Adatlap: `src/data/muscles/<izom>.ts` (a `Muscle` típus szerint), majd felvétel a `muscles` tömbbe (`status: 'available'`).
2. Geometria: új izomkontúr a meglévő nézetekben (a kontextusizmok egy része már szerepel), vagy új `ViewGeometry` + `viewGeometries` bejegyzés.
3. Mozgások: új `MotionDefinition`-ök; gyakorlatok: új `Exercise`; kérdések: új kérdésfájl és felvétel a `questions/index.ts`-be.
4. A `data.test.ts` automatikusan ellenőrzi a forrás- és struktúrahivatkozásokat.

A tartalmi modell később oktatási szintekkel bővíthető (pl. `Claim.level`), ez jelenleg szándékosan nincs implementálva.
