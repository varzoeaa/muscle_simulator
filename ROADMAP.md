# Fejlesztési ütemterv

| Szakasz | Tartalom | Állapot |
|---|---|---|
| Phase 0 – Technikai kutatás | API-k és nyílt források, licencek, geometria- és animációterv | ✅ kész (DATA_LICENSES.md) |
| Phase 1 – Alapok | Vite + React + TS, könyvtárstruktúra, design tokenek, világos/sötét mód, izomközpontú navigáció, helyi tárolás, PWA | ✅ kész |
| Phase 2 – Anatomy Lab | Nagy mellizom adatmodell, interaktív SVG (elülső + felülnézet), eredés/tapadás, beidegzés, izomrészek, funkciók, szerepek | ✅ kész a nagy mellizomhoz · ⏳ további három izom |
| Phase 3 – Biomechanics Lab | Animációs motor, közelítés és horizontális közelítés, koncentrikus/excentrikus/izometriás működés, szerepkör-megjelenítés, vezérlők | ✅ kész a nagy mellizomhoz (2 mozgás) · ⏳ befelé forgatás, hajlítás, feszítés (oldalnézet szükséges) |
| Phase 4 – Exercise Lab | Fekvenyomás (ROM, paddőlés, súly) | ✅ 1 gyakorlat · ⏳ további 10 nagy mellizom-gyakorlat, a többi izom gyakorlatai |
| Phase 5 – Study Mode | Kártyák, feleletválasztós, ábrás, párosítós, hiányos szöveg; gyakorlás, vizsga, hibás kérdések | ✅ kész a nagy mellizomhoz (18 kérdés, 11 kártya) |
| Phase 6 – Véglegesítés | Tudományos lektorálás, funkcionális és mobil tesztelés, teljesítmény, telepítési doksi | 🔶 részben (egységtesztek, build, PWA-ellenőrzés kész) |

## Következő lépések (javasolt sorrend)

1. Szakmai (anatómus) lektorálás az elülső nézet geometriájára; szükség esetén BodyParts3D-hálók offline vetítése referenciaként.
2. Oldalnézet (szagittális) a vállízületi hajlításhoz/feszítéshez és a kulcscsonti / szegycsonti-bordai rész eltérő funkciójának bemutatásához; felülnézetben befelé forgatás.
3. Kis mellizom integrálása (a geometria már szerepel kontextusként): lapocka-frame bevezetése (protrakció, depresszió, lefelé rotáció, előrebillenés).
4. Kulcscsont alatti izom és elülső fűrészizom (rostcsoportok külön kontúrral).
5. Exercise Lab bővítése (kézisúlyzós változatok, tárogatás, gépes gyakorlatok, fekvőtámasz, push-up plus).

A későbbi irányok (fizikai motor, oktatási szintek, fiókok stb.) a PRODUCT_SPEC.md szerint az első verzión kívül esnek.
