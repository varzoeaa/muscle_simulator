# Adatforrások és licencek – Phase 0 technikai kutatás

Kutatás dátuma: 2026-11-26. Módszer: webes keresés a fejlesztői környezetből. **Az alábbi megállapítások keresési találatokon és a projektoldalak kivonatain alapulnak; a licencfájlokat és a modelleket nem töltöttük le és nem nyitottuk meg.** Ahol ez szükséges, a táblázat „ellenőrizendő” jelölést tartalmaz.

## Összefoglaló döntés

**Nincs olyan ingyenes, kulcs nélküli, CORS-kompatibilis API, amely rétegezett, animálható 2D SVG-geometriát adna a négy mellizomhoz.** A létező nyílt források 3D hálók (BodyParts3D, Z-Anatomy), biomechanikai modellek (OpenSim) vagy szöveges/képi tananyagok (OpenStax, Wikimedia Commons). Ezért **hibrid megoldást** választottunk:

1. saját szerkesztésű, rétegezett, csontokhoz kötött koordinátájú 2D geometria TypeScript-adatfájlokban (`src/data/geometry/`),
2. saját strukturált anatómiai adatállományok forrásmegjelöléssel (`src/data/`),
3. későbbi lépésként a CC BY 4.0 licencű BodyParts3D-hálók offline 2D vetítése a geometria pontosítására.

Az alkalmazás működése nem függ külső szolgáltatástól.

## Vizsgált források

| Forrás | Típus | Elérhetőség / dokumentáció | API-kulcs, limit, CORS | Licenc | Mellizmok / kapcsolódó struktúrák | SVG / animálhatóság | Felhasználás a projektben |
|---|---|---|---|---|---|---|---|
| **Anatome API** | – | Ilyen nevű API-t a keresés nem talált. | – | – | – | – | Nem használjuk. Nem állítjuk, hogy létezik. |
| AnatomyFYI (keresés közben talált) | REST API + kliensek | anatomyfyi.com, OpenAPI-séma | Díjazás / limit nem tisztázott | Nem ellenőrzött | Szöveges struktúra-adatok | Nincs SVG | Nem használjuk (külső függőség, tisztázatlan feltételek). |
| **BodyParts3D** (DBCLS) | 3D hálók (OBJ/STL), FMA-alapú | dbarchive.biosciencedbc.jp, letölthető ZIP (pl. ~136 MB) | Nincs API; statikus letöltés | Jelenleg **CC BY 4.0** (régebbi kiadások: CC BY-SA 2.1 JP – kiadásonként ellenőrizendő) | Izmok és csontok 3D-ben | 3D háló; 2D-hez vetítés kell | Tervezett: offline 2D vetítés referenciaként (Phase 6+). Forrásmegjelölés: „BodyParts3D, © The Database Center for Life Science, CC BY 4.0”. |
| **Z-Anatomy** | Blender-sablon, 3D atlasz | GitHub (Z-Anatomy/The-blend, Models-of-human-anatomy) | Nincs API | **CC BY-SA 4.0** (share-alike – a származékos geometriára is kiterjedne) | Teljes izomrendszer 3D-ben | 3D; vetítés szükséges | Nem építjük be: a CC BY-SA a saját ábráinkra is kiterjedne. Vizuális referenciaként használható. |
| **OpenSim** modellek (pl. Holzbaur 2005 upper extremity, Seth 2019 shoulder) | Muszkuloszkeletális modellek (.osim) | simtk.org projektoldalak | Nincs web API | Licenc **nem ellenőrzött** (a „szabadon elérhető” nem azonos nyílt licenccel) | Váll izmai, útvonalpontok | Nem SVG; később útvonal-referencia | Nem használjuk; a jövőbeni biomechanikai fejlesztéshez megvizsgálandó. |
| **OpenStax** Anatomy & Physiology 2e | Nyílt tankönyv (HTML/PDF), ábrák | openstax.org | Nincs API | **CC BY 4.0** | Táblázatok a mellöv izmairól | Raszteres ábrák | Szöveges forrásként hivatkozzuk (`openstax-ap2e`). |
| **Wikimedia Commons** | Képek, néhány SVG | commons.wikimedia.org (MediaWiki API, CORS-képes) | Kulcs nélkül | Fájlonként eltérő (CC BY, CC BY-SA, PD) | Számos mellizom-ábra | Egyes SVG-k léteznek, de nem rétegezettek / nem animálhatók csontokhoz kötve | Nem használjuk; fájlonkénti licencvizsgálat kellene. |
| **PubMed / PMC** | Bibliográfiai adatbázis | pubmed.ncbi.nlm.nih.gov, E-utilities | Kulcs nélkül, limitált | Cikkenként eltérő | EMG-vizsgálatok, StatPearls | – | Forrásellenőrzéshez (Lauver 2016, Rodríguez-Ridao 2020, StatPearls). |
| **Gray's Anatomy, 20. kiadás (1918)** – Internet Archive | Digitalizált tankönyv (szöveg, képek) | archive.org/details/anatomyofhumanbo1918gray | Nincs API | **Közkincs** | A csuklyásizom és a vállövi izmok szöveges leírása | Raszteres ábrák | Csak szöveges forrásként (`grays-1918`); ábrát nem veszünk át. |
| **FIPAT – Terminologia Anatomica 2 (TA2)** | Terminológia | fipat.library.dal.ca/TA2, PDF | Nincs API | Kiadvány: **CC BY-ND 4.0**; a terminusok közkincs | Latin terminusok | – | A latin nevek hivatkozási alapja. |

## A saját geometria licence

A `src/data/geometry/` alatti 2D geometria e projekt saját munkája, harmadik féltől származó vektoros vagy raszteres ábrát nem tartalmaz és nem követ le.

## Kód- és könyvtárlicencek

Minden futásidejű függőség nyílt forráskódú: React (MIT), React Router (MIT), Zustand (MIT), Lucide (ISC), Tailwind CSS (MIT), vite-plugin-pwa / Workbox (MIT).
