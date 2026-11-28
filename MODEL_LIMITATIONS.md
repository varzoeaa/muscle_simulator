# Anatómiai és modellezési korlátok

## Technikai akadály: nincs ellenőrzött, kész 2D geometria

A Phase 0 kutatás alapján (DATA_LICENSES.md) nem áll rendelkezésre olyan nyílt licencű, rétegezett és csontokhoz köthető 2D SVG-geometria, amely közvetlenül használható lenne. **Az ábrák ezért saját szerkesztésűek.** Ezt nyíltan jelezzük az alkalmazásban (az Anatómia modul alatti megjegyzés, Források oldal).

Ami az ábrákon tankönyvi leírásokon alapul:
- a csontos tájékozódási pontok egymáshoz viszonyított helyzete (szegycsont markolata és teste, 1–10. borda és bordaporcok, kulcscsont S-alakja, vállcsúcs, hollócsőrnyúlvány, felkarcsont feje és a nagy gumó taraja);
- a nagy mellizom három részének eredési területe (kulcscsont mediális fele; szegycsont és 1–6. bordaporc területként – egyes források 1–7.; a külső ferde hasizom bőnye) és közös tapadása a nagy gumó tarján (a bicepsbarázda laterális ajkán);
- a részek tapadási sorrendje a felkarcsonton a klasszikus leírás szerint (kulcscsonti rész disztálisabban, alsó rostok proximálisabban) – a boncolásos vizsgálatok a rétegekről és a csavarodásról eltérő eredményt adtak (Ganokroj és mtsai 2022);
- a kapcsolódó izmok (deltaizom elülső és középső része, kétfejű karizom, hollócsőr-karizom, háromfejű karizom hosszú feje, széles hátizom, elülső fűrészizom, kis mellizom, kulcscsont alatti izom) helyzete.

Ami **nem** mért vagy validált:
- a kontúrok pontos alakja és arányai (nem szkennelt, nem 3D-modellből vetített geometria);
- a rostirány-vonalak sematikusak (eredés–tapadás közötti egyenesek);
- a felülnézet, az oldalnézet és a fekvenyomás oldalnézete sematikusabb, mint az elülső nézet. Az oldalnézetben a mellizomrészek egyszerű legyezőként (eredési vonal → tapadási vonal) jelennek meg, a mellkasfali izmok erősen sematikusak.

## Kis mellizom (Anatómia)

- A kis mellizom az elülső, a felül- és az oldalnézetben mély rétegként jelenik meg; eredése a 3–5. bordán a borda-bordaporc határ közelében, tapadása a hollócsőrnyúlványon (StatPearls, OpenStax). A felül- és oldalnézeti kontúr sematikusabb, mint az elülső.
- Kiválasztásakor a fölötte fekvő felületes izmok (köztük a nagy mellizom) áttetszők lesznek – ez megjelenítési segítség, nem a valódi rétegrend megváltozása.
- A beidegzésnél a források eltérnek: a Moore főként a belső mellizomideget, a StatPearls a külső és a belső mellizomideget is megnevezi; az alkalmazás mindkettőt jelzi. Az eredésnél egyes tankönyvek a 2–4. bordát adják meg.
- A lapockamozgásokban betöltött szerepek (depresszió, protrakció, lefelé rotáció, előrebillentés) Neumann (2017) leírását követik; az előrebillentés antagonistái és a belégzés stabilizálói oktatási modell szintűek. A kis mellizom Tanulás modulja 57 feladatot és 15 tanulókártyát tartalmaz; a mély izomra kérdező ábrás feladatokban a felületes izmok áttetszők.

## Kis mellizom (Biomechanika)

- A lapockamozgásokhoz a nézetek „mozgó vállövű” változatai készültek: a kulcscsont és a lapocka saját frame-en mozog, a hozzájuk kötött izompontok (pl. a kis mellizom hollócsőrnyúlványi vége, a deltaizom, a hollócsőr-karizom) velük együtt. Alaphelyzetben a változatok pontosan fedik az eredeti nézeteket.
- Süllyesztés: a kulcscsont a szegycsont-kulcscsonti ízület körül fordul (−10°). Lefelé rotáció: a lapocka a vállcsúcs-kulcscsonti ízület körül fordul, miközben a kulcscsont is süllyed – a felfelé rotált, emelt helyzetből való visszatérésként; a valódi forgástengely a mozgás során vándorol. Protrakció: felülnézetben a kulcscsont előre fordul, a lapocka vele együtt mozog (a mellkas ívét követő csúszás és a lapocka elfordulása nincs ábrázolva). Előrebillenés: oldalnézetben a lapocka a felső részén átmenő tengely körül billen; a kulcscsont nem mozdul, ezért a vállcsúcs-kulcscsonti kapcsolat kissé elcsúszhat.
- A szögek szemléltetők, nem mért mozgástartományok. A felkar a lapockával együtt mozog (elölnézetben), a vállízület szöge közben változatlan.
- Szerepkör-megjelenítésben az agonisták kerülnek legfelülre, ezért a mély kis mellizom a felette fekvő nagy mellizom fölött látszik.

## Kis mellizom (Gyakorlatok)

- Három gyakorlat a mozgó vállövű nézetekben: lapocka-süllyesztés támaszban (elölnézet), a fekvőtámasz plusz „plusz” szakasza (felülnézet), egykaros kis mellizom-nyújtás (felülnézet). A zárt láncú gyakorlatoknál (támasz, fekvőtámasz) az ábra a vállöv törzshöz viszonyított mozgását mutatja; a valóságban a kéz rögzített, és a törzs mozog.
- A nyújtásnál a kar hátravitele (horizontális távolítás) a kis mellizom hosszát a modellben nem változtatja (az izom a lapockán tapad); a hosszváltozást a lapocka retrakciója adja. A mért hosszváltozások (Borstad és Ludewig 2006) és a nyújtási helyzetek (Umehara és mtsai 2017) szövegesen szerepelnek.

## Elülső fűrészizom (Anatómia)

- A három rész (felső, középső, alsó) eredése és tapadása a StatPearls külön fejezetét követi (felső: gyakran 1–2. borda, középső: 2–3. borda, alsó: 4–9. borda). A felső rostcsoport bordai eredése boncolásos mintákban változatos volt (Smith 2003, Webb 2018); a kontúrok az izom és a részek hozzávetőleges helyzetét szemléltetik, a bordánkénti eredés és a pontos részhatárok nem mért geometriák. A regionális EMG-eredmény (Ekstrom 2004: felfelé rotált lapockával az alsó részen nagyobb jel) a vizsgált feladatokra vonatkozik. Más források (OpenStax, StatPearls „Pectoral Muscles”) az egész izom eredését az 1–8. vagy 1–9. bordára teszik; a bordaszám egyénenként változik.
- Az izom nagy része a lapocka mögött, a mellkasfalon fekszik. Oldalnézetben a lapocka belső szélénél lévő tapadás a lapocka hátsó széle mentén jelenik meg (a valóságban a lapocka elülső, bordai felszínén van); elölnézetben a tapadás a lapocka mögé esik, ezért ott csak a bordai eredések vannak jelölve. Felülnézetben a részek egymást fedik, ezért ott az izom egyetlen alakzat.
- A kontúrok és a fűrészfogszerű nyúlványok helyzete sematikus, nem mért geometria. A kiválasztott izmot takaró izmok (deltaizom, széles hátizom, mellizmok, felkar izmai) áttetszővé válnak; a felkarcsont továbbra is eltakarja az izom középső részét oldalnézetben.
- A felső rész kettős beidegzése (független C4–C6 ág) és az alsó rész bordaközi idegága a StatPearls alapján szerepel. A hátrabillentésben betöltött szerep oktatási modell szintű (Neumann).

## Elülső fűrészizom (Biomechanika)

- A felfelé rotáció hátulnézetben jelenik meg: elölnézetben a vetület miatt a bordai eredések a lapocka alsó szögétől befelé esnének, így az izom a rövidülő mozgásban hosszabbodni látszana. Hátulnézetben az izom a lapocka mögött fekszik, ezért mély rétegként (áttetsző felületes izmokkal) látszik; a bordai eredés a mellkas oldalsó kontúrján van jelölve.
- A lapocka a vállcsúcs-kulcscsonti ízület körül fordul, a kulcscsont emelkedése nélkül; a forgástengely valódi vándorlása nincs ábrázolva. A 10°-os rotáció szemléltető: a keskeny sematikus mellkas miatt nagyobb szögnél az alsó szög túljutna a bordai eredéseken. A kar a lapockával együtt mozog, a vállízület szöge állandó.
- A protrakció a kis mellizomnál is használt felülnézetben, a kulcscsont előre fordulásaként; a hátrabillentés a billenő lapockás oldalnézetben (−10°) látszik. A belégzésnél a bordák egyszerű függőleges eltolással emelkednek, a fűrészfogszerű nyúlványok velük mozognak.

## Elülső fűrészizom (Gyakorlatok)

- A serratus-nyomás és a fekvőtámasz plusz a mozgó vállövű felülnézetben, a protrakció–retrakció szakaszával jelenik meg. A könyök közel nyújtott; az ábra a vállöv mozgásának egyik összetevőjét emeli ki – a lapocka közbeni forgása és billenése nem látszik. A fekvőtámasz plusz koncentrikus/excentrikus/izometriás címkéi a mechanikai modell feltevései: Ludewig és mtsai (2004) EMG-vizsgálata az izomhosszt nem mérte, és csak az elülső fűrészizmot és a felső csuklyásizmot vizsgálta. A fali változat kinematikája (Lunden 2010: belső rotáció és csökkenő felfelé rotáció) nem vihető át a talajon végzett változatra.
- A fej fölé emelésnél (scaption) a hátulnézetben a kar a vállízületben 150°-ig emelkedik, a lapocka közben 10°-ot fordul. A valódi lapocka–felkar ritmusban a lapocka ennél jóval többet fordul; a kis szög a sematikus mellkas miatt szükséges (lásd a Biomechanika modul megjegyzését). A kar a lapocka síkjában mozog; az ábra ezt hátulnézeti vetületként mutatja.
- Az EMG-eredmények az absztraktok alapján, csak minőségileg szerepelnek; a vizsgált gyakorlatváltozatok részletei (testhelyzet, ellenállás) eltérhetnek az ábrázolttól.

## Elülső fűrészizom (Tanulás)

- 55 feladat és 14 tanulókártya, kizárólag az alkalmazásban már forrással megjelenő tartalomból. Az ábrás felismerés elöl- és felülnézetben történik; oldalnézetben az izmot a felkar és a felületes izmok annyira takarják, hogy ott nincs felismerési feladat. Elölnézetben bármelyik rész elfogadott, ha az egész izomra kérdez a feladat.

## Kulcscsont alatti izom (Anatómia)

- Az elülső és az oldalnézetben mély rétegként jelenik meg; eredése az 1. borda és bordaporca határán, tapadása a kulcscsont alsó felszínén, a kulcscsont alatti izom barázdájában (StatPearls, OpenStax). A „középső harmad” tájékozódási leírás; a tapadás tényleges kiterjedése változhat, az ábra egy tipikus szakaszt mutat. Elölnézetben nagy része a kulcscsont mögé esik, ezért a kontúr a kulcscsont alsó széle alatt kilátszó részt hangsúlyozza; felülnézetben a kulcscsont teljesen takarja, ott nincs kontúrja.
- A beidegző ideg (n. subclavius) tipikus gerincvelői szegmentumai (C5–C6) és a felső törzsből való eredése a Moore tankönyv és a StatPearls (Sternoclavicular Joint) alapján szerepelnek. A szegycsont-kulcscsonti ízület stabilizálásában betöltött szerepét a StatPearls leírja, és egy 12 fős EMG-vizsgálat (Reis 1979, absztrakt) támogatja; a közel változatlan testhelyzet melletti aktív (izometriás) stabilizálás lehetséges működésként szerepel, gyakoriságára nincs közvetlen mérés.
- Ízületek: a szegycsont-kulcscsonti ízületnél közvetlen hatás, a vállcsúcs-kulcscsonti ízületnél közvetett érintettség (ízületenkénti megjegyzés az adatlapon).
- Változatok: a hollócsőrnyúlvány felé futó rostos nyúlvány (egy boncolásos mintában 52-ből 49), a rendhagyó izmos tapadás és a járulékos subclavius posticus külön állításként szerepel; az ábrán egyik sem jelenik meg.
- Kulcscsonttörés: a védőhatás lehetséges anatómiai védőrétegként szerepel, nem igazolt klinikai kimenetelként (Gill 2013 esetismertetés).
- A Tanulás modul 53 feladatot és 13 tanulókártyát tartalmaz; az ábrás feladatokban a kis izom miatt a nagyítás segíthet.

## Kulcscsont alatti izom (Biomechanika)

- Három animáció. Az első kettő ugyanannak a süllyesztési iránynak két tartománya: emelt helyzetből a semlegesig (+14° → 0°), majd a semlegesből az alá (0° → −10°). Mindkettő a mozgó vállövű elölnézetben, ahol a kulcscsont merev testként, 2D-ben a szegycsont-kulcscsonti ízület körül fordul; a saját tengelye körüli forgása (Ludewig 2009 szerint karemeléskor jelentős) és a lapocka saját mozgása nincs ábrázolva. A +14° és −10° szemléltető modellérték.
- A harmadik animáció az 1. borda lehetséges emelését mutatja rögzített kulcscsontnál, az egész mellkas függőleges eltolásával – ez 2D szemléltetés; a valós bordamozgás forgást és térbeli mellkastágulást is tartalmaz. Az izom aktív rövidülése és a vállövet rögzítő izmok részvétele a modell feltétele, a fázisonkénti aktivitást nem mérték.
- A koncentrikus/excentrikus/izometriás szöveg az aktív izom hosszváltozását írja le; a kulcscsont mozgását a szegycsont-kulcscsonti ízület körüli eredő nyomaték (többi izom, külső terhelés, mozgásállapot) határozza meg. A szemléltetett terhelés (vállvonogatás utáni leengedés, korlátos támasz) feltevés; ezekből önmagában nem következik, hogy az izom aktívan rövidül vagy hosszabbodik.
- A vállöv süllyesztésénél a kis mellizom a lapockára, a széles hátizom a felkarcsontra, a kulcscsont alatti izom a kulcscsontra hat; az agonista–szinergista sorrend a szemléltetett helyzetre vonatkozik. A kis mellizom moduljának megfelelő részei ugyanígy fogalmaznak.
- A kis izom miatt az animációk a vállöv környékére nagyított kivágásban jelennek meg.

## Kulcscsont alatti izom (Gyakorlatok)

- Kifejezetten erre az izomra épülő edzőtermi gyakorlatot nem találtunk. A három gyakorlatban (lapocka-süllyesztés támaszban – a kis mellizommal közös –, lapocka-lehúzás csigán nyújtott karral, vállvonogatás) a szerepe a forrásokban leírt működéséből (a kulcscsont és a vállöv süllyesztése, a kulcscsont rögzítése) és a vállöv-mozgások szerepeiből következik; aktivitását egyik gyakorlatnál sem mérték.
- A lehúzásnál a fej fölé emelt kar a lapockával együtt mozog (a vállízület szöge állandó); a lapocka felfelé rotációja szemléltető érték.

## Ábrázolásból kimaradt elemek

- **Idegek:** a külső és belső mellizomideg lefutásához nem áll rendelkezésre ellenőrzött geometria, ezért az ábrákon nem szerepelnek; a beidegzés szövegesen jelenik meg.
- A hasi rész felülnézetben nem látható, ezért ott nem szerepel.
- Az ín kétlemezes, U alakú csavarodása csak szövegesen, klasszikus leírásként jelenik meg; az „emelt karnál kiegyenesedik” állításhoz közvetlen forrást nem találtunk, ezért nem szerepel.
- A hasi rész külön régióként jelenik meg (Terminologia Anatomica); egyes felosztások a szegycsonti-bordai fejhez sorolják. A részenkénti szegmentális beidegzés tipikus, forrásfüggő leírás (a gyökök egyénenként változnak, Lee 2007).
- A hátulnézet (a Biomechanika modul kiegészítő nézete) saját szerkesztésű, sematikus; a nagy mellizom hátulról nem látható. Az oldalnézetből a külső ferde hasizom a jobb áttekinthetőség érdekében kimaradt.
- **Kiegészítő nézetek:** ahol a mozgás nem a nézet síkjában zajlik (pl. horizontális közelítés elölről/hátulról, hajlítás elölről), a kar egyszerű vetületi rövidüléssel (cos/sin szorzó a csont hossztengelye mentén) jelenik meg; a mélységi sorrendet (mi van elöl/hátul) ez csak egyszerűsítve kezeli: elölnézetben az alkar az izmok fölé kerül. A kiegészítő nézetek a vizsgált (jobb) oldalra vannak kivágva.

## Mozgásanimációk egyszerűsítései

- Egy szabadsági fok mozog (a vállízület forgása az adott síkban). **A lapocka és a kulcscsont együttmozgása nincs ábrázolva** (scapulohumerális ritmus, protrakció stb.). A hajlítás animációjának 80°-os végpontja ennek a modellnek a határa – a valóságban a lapocka már ezen a szögön belül is részt vesz a karemelésben.
- **Befelé forgatás:** felülnézetben, a törzs mellett lógó karral; a felkarcsontfej körként, a forgatás az előre mutató alkarral látszik. A tartomány végét a valóságban a törzs korlátozza, az animáció rövidebb tartományt mutat.
- **Zárt lánc (húzódzkodás):** a kéz rögzített, a törzs függőlegesen emelkedik; a valóságban a felkar, a könyök és a lapocka helyzete együtt változik, ezért ez nem egyszerűen a nyitott láncú közelítés megfordítása. A részek közelítésben betöltött erősorrendje nem mért; a felkar és az alkar szögét kétszegmenses inverz kinematika számolja a rögzített fogásból. Csak a felső szakasz látszik: síkbeli vetületben a szegycsonti-bordai rész eredés–tapadás távolsága kb. 110° távolításnál a legnagyobb, ezért a teljesen nyújtott karú alsó helyzetet a 2D modell nem tudja hitelesen szemléltetni.
- **Járulékos belégzés:** feltételes működés (rögzített felső végtag és vállöv); a régiók külön szerepét nem mérték, az ábra régiószövegei oktatási modellek. A bordák, a bordaporcok és a szegycsont egyszerű függőleges eltolással emelkednek (a valódi bordamozgás forgással és oldalirányú tágulással jár). Csak koncentrikus működés jelenik meg.
- Az izomkontúrok a csontokhoz kötött pontok között interpolálódnak; a „rövidülés” a geometriából adódó vizuális szemléltetés, **nem numerikus izomhossz-számítás**.
- Nincs erő, forgatónyomaték, erőkar, gravitáció vagy izomaktivációs érték. Az „aktív” jelzés minőségi.
- A koncentrikus/excentrikus/izometriás működéshez szemléltetett külső ellenállást (csigakábel) feltételezünk, ezt az alkalmazás szövegesen jelzi.

## Fekvenyomás-modell feltevései

- A rúd egyenes pályán mozog a vállízület fölötti felső helyzet és a mellkas között; a mellkasi érintési pont a paddőlésszöggel lineárisan tolódik (ferde padon felfelé, negatív padon lefelé) – **oktatási közelítés**.
- Az alkar mindvégig függőleges; a felkar szagittális vetületének rövidülése a vállízületi távolítás vetületi következménye.
- A testarányok, a fogásszélesség és a mozgás sebessége rögzített. A súly csak szemléltető paraméter (tárcsák megjelenítése), nem befolyásolja a modellt.
- Az EMG-vizsgálatok eredményeit szövegesen, forrással idézzük; nem jelenítünk meg aktivációs százalékot. A dőlésszöges vizsgálatok (Lauver 2016, Rodríguez-Ridao 2020) rudasak – kézisúlyzós nézetben is rudas eredményként jelöljük őket. A 30°-nál mért legnagyobb felső-EMG egy minta eredménye (a 0°-hoz képest nem szignifikáns), nem „optimális” szög; a deltaizomnál a vizsgált 45°-os és 60°-os beállítást nevezzük meg, nem egy „45° feletti” küszöböt. Az EMG, a külső terhelés (1-RM), az izomerő és a hipertrófia külön fogalmak.
- A kétfejű karizom könyökhajlító nyomatékát és a fekvenyomásban lehetséges vállízületi szerepét külön kezeljük; a nagyobb bicepsz-EMG (pl. kézisúlyzóval) önmagában nem bizonyít ízületi funkciót.

## További gyakorlatok modelljei (Gyakorlatok)

- **Kézisúlyzós fekvenyomás:** a rúddal végzett fekvenyomás modellje; a súlyzó a nézővel szemben (pronált fogás), a mélyebb mozgástartomány nincs külön modellezve.
- **Gépes mellnyomás, fekvőtámasz:** a fekvenyomás-modell a törzshöz rögzítve (az alkar merőleges a törzsre). A Smith-gépes (vezetett rudas) mérések nem vihetők át az ülő mellnyomógépekre. A gépes nyomásnál a törzs függőleges; a fekvőtámasznál a kéz és a lábujj a talajon rögzített, a test e két pont között billen (a valódi mozgásban a lapocka is mozog).
- **Fekvőtámasz-változatok:** a kéz és a láb alátámasztása (0–60 cm) és a térdelő változat állítható. A modellben az alkar a talajra merőleges, a kéz és a lábujj (térdnél a térd) a támaszon rögzített; a test dőlését iterációval számoljuk (a dőlés a kéz törzshöz viszonyított helyétől függ, és fordítva). A testdőlés-értékek a sematikus testarányokból adódnak, nem mértek. A kézen mért erőnek csak az irányát mutatjuk (Ebben 2011: csúcs talajreakció-erő; Suprak 2011: statikus helyzetekben a kézre jutó testtömeg-hányad) – ez nem az egyes izmok terhelése; a köztes magasságokra ugyanezt az irányt feltételezzük. A dőlésből levezetett regionális hatások oktatási hipotézisek. A kéztávolságból nem következik szükségszerű könyökszög vagy könyök-mozgástartomány. A kéztávolság (Cogley 2005, keskeny–széles összehasonlítás) és a fekvőtámasz plusz (Ludewig 2004) csak szövegesen és elölnézeti vázlaton jelenik meg; a lapocka mozgását az animáció nem ábrázolja.
- **Tolódzkodás:** a kéz a támaszon (korlát, gyűrű, pad), az alkar függőleges, a felkar a könyök körül fordul előre; a törzs előredőlése a mélységgel lineárisan nő (az alsó helyzetbeli érték állítható, a felső ennek kb. harmada) – oktatási közelítés, nem mért adat. A változatok (pad, korlát, gyűrű) felkarszögei és alapértelmezett törzsdőlései a McKenzie és mtsai (2022) által mért sorrendet szemléltetik (vállfeszítés: pad > korlát > gyűrű; törzsdőlés: pad a legkisebb), de nem a mért szögek. A gyűrű instabilitását a modell nem ábrázolja. A vállfeszítés %-értékei (kb. 101/88/69%) egy külön mozgástartomány-tesztben mért egyéni referenciaértékhez viszonyított csoportátlagok; a gyűrű nagyobb nagy mellizom-EMG-csúcsa erre a vizsgálatra vonatkozik, nagyobb izomnövekedésre vagy általános sérülésveszélyre nem következtetünk belőle. A törzsdőlés hatását mérő vizsgálatot nem találtunk; a vállfeszítés „felkarszög − törzsdőlés” közelítése a modell geometriai eredménye, fiziológiai küszöb (pl. 25°) nélkül, és nem állítjuk, hogy a törzs előredöntése önmagában növelné a mellizom terhelését. A fáradásnál a csúcs ízületi szögeket, a medence függőleges elmozdulását és a kezdő/véghelyzeti szögeket külön kezeljük (McKenzie 2022).
- **Tárogatás, pec deck, kereszthúzás, nyújtás:** a vállöv felülnézeti anatómiai ábráján a kar nyújtott könyökkel mozog (a valóságban enyhén hajlított). A kereszthúzás függőleges összetevője (felülről lefelé húzás) és a lapocka mozgása nem látszik. A nyújtásnál a törzs elfordulása helyett a törzshöz viszonyított karhelyzet változik; a másik kar lógó helyzetét a felülnézetben erős rövidülés jelzi.
- **Stabilizáló sorok:** a nyomó-, tárogató- és tolódzkodó gyakorlatoknál a felkarcsontfej centrálása (rotátorköpeny) és a lapocka helyzetének szabályozása (rombuszizmok, csuklyásizom, elülső fűrészizom) külön sorban szerepel; az elülső fűrészizomnak nem tulajdonítunk közvetlen felkarcsontfej-rögzítést vagy bizonyított vállsüllyesztést.
- **Izomszerepek:** az ízületi működések tankönyvi tények (Neumann 2017); a szinergisták, stabilizálók és a gyakorlatspecifikus szerepek oktatási modell szintűek (NSCA). A tolódzkodásban a szegycsonti-bordai rész pontos szerepe és a széles hátizom kettős (antagonista / stabilizáló) szerepe egyszerűsítve jelenik meg. A gyakorlattechnikai elvek NSCA-hivatkozását a nyomtatott kiadás alapján gyakorlatonként érdemes ellenőrizni.
- **Változatok összehasonlítása:** a fekvenyomásnál a dőlésszög és az eszköz (rúd / kézisúlyzó) szerinti különbségek három vizsgálat absztraktjára épülnek (Lauver 2016, Rodríguez-Ridao 2020, Saeterbakken 2011), minőségileg, EMG-százalék nélkül. A tárogatásnál dőlésszögeket összehasonlító, illetve a kézisúlyzós és a gépes tárogatást közvetlenül összevető lektorált vizsgálatot nem találtunk (2026-11-26); ott a különbségek anatómiai és mechanikai levezetések (oktatási modell). A gépes tárogatásnál a dőlésszög megfelelője az ülésmagasság (a felkar a vállhoz képest −20° … +20°); ezt is levezetésként, mérés nélkül mutatjuk. A csigás keresztbehúzásnál a csiga magassága (húzásirány −30° … +30°) szerepel ugyanígy; a „felső csiga – alsó rostok” szabályt csak edzői forrásokban találtuk, elsődleges EMG-vizsgálatban nem.
- **Ellenállási görbe (tárogatás):** relatív, minőségi ábra. Kézisúlyzónál a vállízületre ható külső nyomaték a súly függőleges hatásvonalának a vállízülettől vett vízszintes távolságával (a kar függőlegestől mért szögének szinuszával) arányos; a pec deck és a csigás változat ellenállásgörbéje gép- és geometriafüggő, az ábra állandó értéket feltételez. A pad dőléséből, az ülésmagasságból vagy a csigairányból levezetett regionális hatások oktatási hipotézisek. Nem mért és nem számszerű érték.
- **Nyújtás:** két nyújtó gyakorlat (falnál egykaros, hengeren kétkaros). A karhelyzet (45°, 90°, 135° távolítás), a külső rotáció és a törzs elfordítása szerinti regionális különbségek Umehara és mtsai (2021) absztraktjának kiemelt helyzeteit követik. Biztos kiemelést (✓, pulzálás) csak az absztraktban pontosan leírt kombináció kap: kulcscsonti rész – 90° medence-elfordítás nélkül (külső rotációval vagy anélkül), 45° + medence-elfordítás + külső rotáció; szegycsonti rész – 90° + külső rotáció; hasi rész – 135° + medence-elfordítás + külső rotáció. A szegycsonti „medence-elfordítás + külső rotáció” helyzet szögét az absztrakt nem adja meg, ezért bármely szögnél „bizonytalan”; a 90° + medence-elfordítás a kulcscsonti résznél szintén „bizonytalan”. A mért mennyiség a nyírási modulus, a nyúlás ebből közvetett becslés. A külső rotáció a felkar helyzete; a tenyér iránya az alkar forgatásától is változhat. A hengeren fekvő változatra az eredmények átvitele oktatási közelítés. A felülnézeti animáció a kar magasságát nem mutatja (elölnézeti vázlat szemlélteti), a hasi rész felülről nem látható. Az adagolás (a nagy izom–ín csoportokra végzett nyújtó gyakorlatonként összesen 60 s, heti ≥2 nap) az ACSM-állásfoglalás (Garber 2011), az akut hatások Behm és mtsai (2016) áttekintése alapján szerepelnek (dinamikus utómozgással „nem volt egyértelmű teljesítményhatás”, kevesebb vizsgálat alapján); a 2 × 30 s / 4 × 15 s felosztás csak számpélda. A két nyújtási mód összehasonlítása oktatási modell.
- Egyik gyakorlatnál sem jelenik meg EMG-, aktivációs vagy erőérték.

## Ellenőrzésre váró / pontosítandó információk

- Az izomrészek közelítésben betöltött eltérő szerepe, erősorrendje és a pontos agonista–szinergista–stabilizáló listák „oktatási modell” szinten, karhelyzethez és terheléshez kötve szerepelnek; Neumann (2017) nyomtatott kiadása alapján pontosítandók (oldalszámot nem adunk meg, mert nincs ellenőrzött).
- A szegycsonti-bordai rész eredése: a Moore az 1–6., az OpenStax az „1–6. vagy 1–7.” bordaporcot adja meg – a kvíz megnevezi a forrást.
- Csak absztraktból ellenőrzött állítások (a teljes szöveg nem volt hozzáférhető): Lauver 2016, Saeterbakken 2011 (pl. hogy az EMG-t az 1-RM-emeléseknél rögzítették-e), Umehara 2021 (a pontos helyzet-kombinációk és a szegycsonti helyzet szöge), Ebben 2011, Suprak 2011, Cogley 2005 (a könyökszöget kontrollálták-e), Ludewig 2004, Behm 2016, Garber 2011, Lee 2007.
- A tankönyvi tapadási sorrendet és csavarodást (Gray's, Moore) nyomtatott kiadás oldalszámával nem ellenőriztük; az eltérő boncolásos eredményeket Ganokroj és mtsai (2022) összefoglalója alapján jelezzük.
- A tankönyvek (Moore, Gray's, Neumann, NSCA) kiadási adatait nyomtatott példány alapján érdemes ellenőrizni (az alkalmazás „standard referenciamű” jelöléssel mutatja).
