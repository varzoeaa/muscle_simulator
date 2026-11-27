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

## Kis mellizom (Anatomy Lab)

- A kis mellizom az elülső, a felül- és az oldalnézetben mély rétegként jelenik meg; eredése a 3–5. bordán a borda-bordaporc határ közelében, tapadása a hollócsőrnyúlványon (StatPearls, OpenStax). A felül- és oldalnézeti kontúr sematikusabb, mint az elülső.
- Kiválasztásakor a fölötte fekvő felületes izmok (köztük a nagy mellizom) áttetszők lesznek – ez megjelenítési segítség, nem a valódi rétegrend megváltozása.
- A beidegzésnél a források eltérnek: a Moore főként a belső mellizomideget, a StatPearls a külső és a belső mellizomideget is megnevezi; az alkalmazás mindkettőt jelzi. Az eredésnél egyes tankönyvek a 2–4. bordát adják meg.
- A lapockamozgásokban betöltött szerepek (depresszió, protrakció, lefelé rotáció, előrebillentés) Neumann (2017) leírását követik; az előrebillentés antagonistái és a belégzés stabilizálói oktatási modell szintűek. A kis mellizom Study Mode-ja 57 feladatot és 15 tanulókártyát tartalmaz; a mély izomra kérdező ábrás feladatokban a felületes izmok áttetszők.

## Kis mellizom (Biomechanics Lab)

- A lapockamozgásokhoz a nézetek „mozgó vállövű” változatai készültek: a kulcscsont és a lapocka saját frame-en mozog, a hozzájuk kötött izompontok (pl. a kis mellizom hollócsőrnyúlványi vége, a deltaizom, a hollócsőr-karizom) velük együtt. Alaphelyzetben a változatok pontosan fedik az eredeti nézeteket.
- Süllyesztés: a kulcscsont a szegycsont-kulcscsonti ízület körül fordul (−10°). Lefelé rotáció: a lapocka a vállcsúcs-kulcscsonti ízület körül fordul, miközben a kulcscsont is süllyed – a felfelé rotált, emelt helyzetből való visszatérésként; a valódi forgástengely a mozgás során vándorol. Protrakció: felülnézetben a kulcscsont előre fordul, a lapocka vele együtt mozog (a mellkas ívét követő csúszás és a lapocka elfordulása nincs ábrázolva). Előrebillenés: oldalnézetben a lapocka a felső részén átmenő tengely körül billen; a kulcscsont nem mozdul, ezért a vállcsúcs-kulcscsonti kapcsolat kissé elcsúszhat.
- A szögek szemléltetők, nem mért mozgástartományok. A felkar a lapockával együtt mozog (elölnézetben), a vállízület szöge közben változatlan.
- Szerepkör-megjelenítésben az agonisták kerülnek legfelülre, ezért a mély kis mellizom a felette fekvő nagy mellizom fölött látszik.

## Kis mellizom (Exercise Lab)

- Három gyakorlat a mozgó vállövű nézetekben: lapocka-süllyesztés támaszban (elölnézet), a fekvőtámasz plusz „plusz” szakasza (felülnézet), egykaros kis mellizom-nyújtás (felülnézet). A zárt láncú gyakorlatoknál (támasz, fekvőtámasz) az ábra a vállöv törzshöz viszonyított mozgását mutatja; a valóságban a kéz rögzített, és a törzs mozog.
- A nyújtásnál a kar hátravitele (horizontális távolítás) a kis mellizom hosszát a modellben nem változtatja (az izom a lapockán tapad); a hosszváltozást a lapocka retrakciója adja. A mért hosszváltozások (Borstad és Ludewig 2006) és a nyújtási helyzetek (Umehara és mtsai 2017) szövegesen szerepelnek.

## Kulcscsont alatti izom (Anatomy Lab)

- Az elülső és az oldalnézetben mély rétegként jelenik meg; eredése az 1. borda és bordaporca határán, tapadása a kulcscsont alsó felszínének középső harmadán (StatPearls, OpenStax). Elölnézetben nagy része a kulcscsont mögé esik, ezért a kontúr a kulcscsont alsó széle alatt kilátszó részt hangsúlyozza; felülnézetben a kulcscsont teljesen takarja, ott nincs kontúrja.
- A beidegző ideg (n. subclavius) gerincvelői szegmentumai (C5–C6) és a felső törzsből való eredése a Moore tankönyv alapján szerepelnek (standard referenciamű). A szegycsont-kulcscsonti ízület stabilizálásában betöltött szerepe oktatási modell szintű.
- Gyakorlat és tanulási feladat még nincs hozzá.

## Kulcscsont alatti izom (Biomechanics Lab)

- Három animáció: a kulcscsont süllyesztése emelt helyzetből (+14° → 0°), a vállöv süllyesztése az alaphelyzet alá (0° → −10°) – mindkettő a mozgó vállövű elölnézetben, ahol a kulcscsont merev testként a szegycsont-kulcscsonti ízület körül fordul (a saját tengelye körüli forgása nincs ábrázolva) –, valamint az 1. borda emelése rögzített kulcscsontnál az emelkedő mellkasú elölnézetben (az egész mellkas függőleges eltolásával). A szögek szemléltetők.
- A kis izom miatt az animációk a vállöv környékére nagyított kivágásban jelennek meg.

## Ábrázolásból kimaradt elemek

- **Idegek:** a külső és belső mellizomideg lefutásához nem áll rendelkezésre ellenőrzött geometria, ezért az ábrákon nem szerepelnek; a beidegzés szövegesen jelenik meg.
- A hasi rész felülnézetben nem látható, ezért ott nem szerepel.
- Az ín kétlemezes, U alakú csavarodása csak szövegesen jelenik meg.
- A hátulnézet (Biomechanics Lab kiegészítő nézete) saját szerkesztésű, sematikus; a nagy mellizom hátulról nem látható. Az oldalnézetből a külső ferde hasizom a jobb áttekinthetőség érdekében kimaradt.
- **Kiegészítő nézetek:** ahol a mozgás nem a nézet síkjában zajlik (pl. horizontális közelítés elölről/hátulról, hajlítás elölről), a kar egyszerű vetületi rövidüléssel (cos/sin szorzó a csont hossztengelye mentén) jelenik meg; a mélységi sorrendet (mi van elöl/hátul) ez csak egyszerűsítve kezeli: elölnézetben az alkar az izmok fölé kerül. A kiegészítő nézetek a vizsgált (jobb) oldalra vannak kivágva.

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

## További gyakorlatok modelljei (Exercise Lab)

- **Kézisúlyzós fekvenyomás:** a rúddal végzett fekvenyomás modellje; a súlyzó a nézővel szemben (pronált fogás), a mélyebb mozgástartomány nincs külön modellezve.
- **Gépes mellnyomás, fekvőtámasz:** a fekvenyomás-modell a törzshöz rögzítve (az alkar merőleges a törzsre). A gépes nyomásnál a törzs függőleges; a fekvőtámasznál a kéz és a lábujj a talajon rögzített, a test e két pont között billen (a valódi mozgásban a lapocka is mozog).
- **Fekvőtámasz-változatok:** a kéz és a láb alátámasztása (0–60 cm) és a térdelő változat állítható. A modellben az alkar a talajra merőleges, a kéz és a lábujj (térdnél a térd) a támaszon rögzített; a test dőlését iterációval számoljuk (a dőlés a kéz törzshöz viszonyított helyétől függ, és fordítva). A testdőlés-értékek a sematikus testarányokból adódnak, nem mértek. A kézre jutó terhelésnek csak az irányát mutatjuk (Ebben 2011, Suprak 2011); a köztes magasságokra ugyanezt az irányt feltételezzük. A kéztávolság (Cogley 2005) és a fekvőtámasz plusz (Ludewig 2004) csak szövegesen és elölnézeti vázlaton jelenik meg; a lapocka mozgását az animáció nem ábrázolja.
- **Tolódzkodás:** a kéz a támaszon (korlát, gyűrű, pad), az alkar függőleges, a felkar a könyök körül fordul előre; a törzs előredőlése a mélységgel lineárisan nő (az alsó helyzetbeli érték állítható, a felső ennek kb. harmada) – oktatási közelítés, nem mért adat. A változatok (pad, korlát, gyűrű) felkarszögei és alapértelmezett törzsdőlései a McKenzie és mtsai (2022) által mért sorrendet szemléltetik (vállfeszítés: pad > korlát > gyűrű; törzsdőlés: pad a legkisebb), de nem a mért szögek. A gyűrű instabilitását a modell nem ábrázolja. A törzsdőlés hatását mérő vizsgálatot nem találtunk; a vállfeszítés „felkarszög − törzsdőlés” közelítése geometriai levezetés.
- **Tárogatás, pec deck, kereszthúzás, nyújtás:** a vállöv felülnézeti anatómiai ábráján a kar nyújtott könyökkel mozog (a valóságban enyhén hajlított). A kereszthúzás függőleges összetevője (felülről lefelé húzás) és a lapocka mozgása nem látszik. A nyújtásnál a törzs elfordulása helyett a törzshöz viszonyított karhelyzet változik; a másik kar lógó helyzetét a felülnézetben erős rövidülés jelzi.
- **Izomszerepek:** az ízületi működések tankönyvi tények (Neumann 2017); a szinergisták, stabilizálók és a gyakorlatspecifikus szerepek oktatási modell szintűek (NSCA). A tolódzkodásban a szegycsonti-bordai rész pontos szerepe és a széles hátizom kettős (antagonista / stabilizáló) szerepe egyszerűsítve jelenik meg. A gyakorlattechnikai elvek NSCA-hivatkozását a nyomtatott kiadás alapján gyakorlatonként érdemes ellenőrizni.
- **Változatok összehasonlítása:** a fekvenyomásnál a dőlésszög és az eszköz (rúd / kézisúlyzó) szerinti különbségek három vizsgálat absztraktjára épülnek (Lauver 2016, Rodríguez-Ridao 2020, Saeterbakken 2011), minőségileg, EMG-százalék nélkül. A tárogatásnál dőlésszögeket összehasonlító, illetve a kézisúlyzós és a gépes tárogatást közvetlenül összevető lektorált vizsgálatot nem találtunk (2026-11-26); ott a különbségek anatómiai és mechanikai levezetések (oktatási modell). A gépes tárogatásnál a dőlésszög megfelelője az ülésmagasság (a felkar a vállhoz képest −20° … +20°); ezt is levezetésként, mérés nélkül mutatjuk. A csigás keresztbehúzásnál a csiga magassága (húzásirány −30° … +30°) szerepel ugyanígy; a „felső csiga – alsó rostok” szabályt csak edzői forrásokban találtuk, elsődleges EMG-vizsgálatban nem.
- **Ellenállási görbe (tárogatás):** relatív, minőségi ábra. Kézisúlyzónál a vállízületre ható nyomaték az erőkarral, vagyis a kar függőlegestől mért szögének szinuszával arányos; a gépnél a profil gépfüggő, az ábra állandó értéket feltételez. Nem mért és nem számszerű érték.
- **Nyújtás:** két nyújtó gyakorlat (falnál egykaros, hengeren kétkaros). A karhelyzet (45°, 90°, 135° távolítás), a külső rotáció és a törzs elfordítása szerinti regionális különbségek Umehara és mtsai (2021) absztraktjának kiemelt helyzeteit követik; a „medence-elfordítás + külső rotáció” helyzet távolítási szögét az absztrakt nem adja meg, ezt „lehetséges” jelöléssel mutatjuk. A felülnézeti animáció a kar magasságát nem mutatja (elölnézeti vázlat szemlélteti), a hasi rész felülről nem látható. Az adagolás (gyakorlatonként 60 s, heti ≥2 nap) az ACSM-állásfoglalás (Garber 2011), az akut hatások Behm és mtsai (2016) áttekintése alapján szerepelnek; a 2 × 30 s / 4 × 15 s felosztás csak számpélda. A két nyújtási mód összehasonlítása oktatási modell.
- Egyik gyakorlatnál sem jelenik meg EMG-, aktivációs vagy erőérték.

## Ellenőrzésre váró / pontosítandó információk

- Az izomrészek közelítésben betöltött eltérő szerepe (szinergisták listája) „oktatási modell” szinten jelölt; Neumann (2017) nyomtatott kiadása alapján pontosítandó.
- A szegycsonti-bordai rész eredése: egyes források az 1–6., mások az 1–7. bordaporcot adják meg – a tesztkérdés magyarázata ezt jelzi.
- A tankönyvek (Moore, Gray's, Neumann, NSCA) kiadási adatait nyomtatott példány alapján érdemes ellenőrizni (az alkalmazás „standard referenciamű” jelöléssel mutatja).
