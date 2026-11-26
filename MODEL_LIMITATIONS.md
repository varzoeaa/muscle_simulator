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
- a felülnézet, az oldalnézet és a fekvenyomás oldalnézete sematikusabb, mint az elülső nézet. Az oldalnézetben a mellizomrészek egyszerű legyezőként (eredési vonal → tapadási vonal) jelennek meg, a mellkasfali izmok erősen sematikusak.

## Ábrázolásból kimaradt elemek

- **Idegek:** a külső és belső mellizomideg lefutásához nem áll rendelkezésre ellenőrzött geometria, ezért az ábrákon nem szerepelnek; a beidegzés szövegesen jelenik meg.
- A hasi rész felülnézetben nem látható, ezért ott nem szerepel.
- Az ín kétlemezes, U alakú csavarodása csak szövegesen jelenik meg.
- A hátulnézet (Biomechanics Lab kiegészítő nézete) saját szerkesztésű, sematikus; a nagy mellizom hátulról nem látható. Az oldalnézetből a külső ferde hasizom a jobb áttekinthetőség érdekében kimaradt.
- **Kiegészítő nézetek:** ahol a mozgás nem a nézet síkjában zajlik (pl. horizontális közelítés elölről/hátulról, hajlítás elölről), a kar egyszerű vetületi rövidüléssel (cos/sin szorzó a csont hossztengelye mentén) jelenik meg; a mélységi sorrendet (mi van elöl/hátul) ez nem kezeli.

## Mozgásanimációk egyszerűsítései

- Egy szabadsági fok mozog (a vállízület forgása az adott síkban). **A lapocka és a kulcscsont együttmozgása nincs ábrázolva** (scapulohumerális ritmus, protrakció stb.); ezért a hajlítás animációja 80°-nál megáll.
- **Befelé forgatás:** felülnézetben, a törzs mellett lógó karral; a felkarcsontfej körként, a forgatás az előre mutató alkarral látszik. A tartomány végét a valóságban a törzs korlátozza, az animáció rövidebb tartományt mutat.
- **Zárt lánc (húzódzkodás):** a kéz rögzített, a törzs függőlegesen emelkedik; a felkar és az alkar szögét kétszegmenses inverz kinematika számolja a rögzített fogásból. Csak a felső szakasz látszik: síkbeli vetületben a szegycsonti-bordai rész eredés–tapadás távolsága kb. 110° távolításnál a legnagyobb, ezért a teljesen nyújtott karú alsó helyzetet a 2D modell nem tudja hitelesen szemléltetni.
- **Járulékos belégzés:** a bordák, a bordaporcok és a szegycsont egyszerű függőleges eltolással emelkednek (a valódi bordamozgás forgással és oldalirányú tágulással jár). Csak koncentrikus működés jelenik meg.
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
