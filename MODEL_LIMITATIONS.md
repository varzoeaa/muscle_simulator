# Anatómiai és modellezési korlátok

## Technikai akadály: nincs ellenőrzött, kész 2D geometria

A Phase 0 kutatás alapján (DATA_LICENSES.md) nem áll rendelkezésre olyan nyílt licencű, rétegezett és csontokhoz köthető 2D SVG-geometria, amely közvetlenül használható lenne. **Az ábrák ezért saját szerkesztésűek.** Ezt nyíltan jelezzük az alkalmazásban (Anatomy Lab alatti megjegyzés, Források oldal).

Ami az ábrákon tankönyvi leírásokon alapul:
- a csontos tájékozódási pontok egymáshoz viszonyított helyzete (szegycsont markolata és teste, 1–10. borda és bordaporcok, kulcscsont S-alakja, vállcsúcs, hollócsőrnyúlvány, felkarcsont feje és a nagy gumó taraja);
- a nagy mellizom három részének eredési területe (kulcscsont mediális fele; szegycsont és 1–6. bordaporc területként; a külső ferde hasizom bőnye) és közös tapadása a nagy gumó tarján;
- a részek tapadási sorrendje a felkarcsonton (kulcscsonti rész disztálisabban, alsó rostok proximálisabban);
- a kapcsolódó izmok (deltaizom elülső és középső része, kétfejű karizom, hollócsőr-karizom, háromfejű karizom hosszú feje, széles hátizom, elülső fűrészizom, kis mellizom, kulcscsont alatti izom) helyzete.

Ami **nem** mért vagy validált:
- a kontúrok pontos alakja és arányai (nem szkennelt, nem 3D-modellből vetített geometria);
- a rostirány-vonalak sematikusak (eredés–tapadás közötti egyenesek);
- a felülnézet és a fekvenyomás oldalnézete sematikusabb, mint az elülső nézet.

## Ábrázolásból kimaradt elemek

- **Idegek:** a külső és belső mellizomideg lefutásához nem áll rendelkezésre ellenőrzött geometria, ezért az ábrákon nem szerepelnek; a beidegzés szövegesen jelenik meg.
- A hasi rész felülnézetben nem látható, ezért ott nem szerepel.
- Az ín kétlemezes, U alakú csavarodása csak szövegesen jelenik meg.
- Nincs hátulsó és oldalsó anatómiai nézet (a fekvenyomás oldalnézete gyakorlat-szemléltetés).

## Mozgásanimációk egyszerűsítései

- Egy szabadsági fok mozog (a vállízület forgása az adott síkban). **A lapocka, a kulcscsont és a könyök együttmozgása nincs ábrázolva** (scapulohumerális ritmus, protrakció stb.).
- Az izomkontúrok a csontokhoz kötött pontok között interpolálódnak; a „rövidülés” a geometriából adódó vizuális szemléltetés, **nem numerikus izomhossz-számítás**.
- Nincs erő, forgatónyomaték, erőkar, gravitáció vagy izomaktivációs érték. Az „aktív” jelzés minőségi.
- A koncentrikus/excentrikus/izometriás működéshez szemléltetett külső ellenállást (csigakábel) feltételezünk, ezt az alkalmazás szövegesen jelzi.

## Fekvenyomás-modell feltevései

- A rúd egyenes pályán mozog a vállízület fölötti felső helyzet és a mellkas között; a mellkasi érintési pont a paddőlésszöggel lineárisan tolódik (ferde padon felfelé, negatív padon lefelé) – **oktatási közelítés**.
- Az alkar mindvégig függőleges; a felkar szagittális vetületének rövidülése a vállízületi távolítás vetületi következménye.
- A testarányok, a fogásszélesség és a mozgás sebessége rögzített. A súly csak szemléltető paraméter (tárcsák megjelenítése), nem befolyásolja a modellt.
- Az EMG-vizsgálatok eredményeit szövegesen, forrással idézzük; nem jelenítünk meg aktivációs százalékot.

## Ellenőrzésre váró / pontosítandó információk

- Az izomrészek közelítésben betöltött eltérő szerepe (szinergisták listája) „oktatási modell” szinten jelölt; Neumann (2017) nyomtatott kiadása alapján pontosítandó.
- A szegycsonti-bordai rész eredése: egyes források az 1–6., mások az 1–7. bordaporcot adják meg – a tesztkérdés magyarázata ezt jelzi.
- A tankönyvek (Moore, Gray's, Neumann, NSCA) kiadási adatait nyomtatott példány alapján érdemes ellenőrizni (az alkalmazás „standard referenciamű” jelöléssel mutatja).
