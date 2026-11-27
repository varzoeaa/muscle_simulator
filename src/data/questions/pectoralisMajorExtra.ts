import type { Flashcard, StudyQuestion } from '../../types';

/**
 * A nagy mellizom további tanulókártyái és feladatai. Minden feladat az alkalmazásban már
 * megjelenő, forrással ellátott tartalomra épül (anatómia, izomszerepek, mozgások,
 * gyakorlatváltozatok, nyújtás). A kutatási eredményekre vonatkozó kérdések a vizsgálatok
 * absztraktjában szereplő, minőségi eredményeket kérdezik.
 */
const M = 'muscle-pectoralis-major';
const ANAT = ['moore-coa', 'grays-anatomy', 'openstax-ap2e', 'statpearls-pectoral'];
const KIN = ['neumann-kinesiology', 'moore-coa'];

const mc = (
  id: string,
  topic: StudyQuestion['topic'],
  prompt: string,
  options: string[],
  correct: number,
  explanation: string,
  sourceIds: string[],
  relatedPath: string
): StudyQuestion => ({
  id,
  muscleId: M,
  topic,
  type: 'multiple-choice',
  prompt,
  options: options.map((text, i) => ({ id: String.fromCharCode(97 + i), text })),
  correctOptionId: String.fromCharCode(97 + correct),
  explanation,
  sourceIds,
  relatedPath
});

const fill = (
  id: string,
  topic: StudyQuestion['topic'],
  text: string,
  options: string[],
  answer: string,
  explanation: string,
  sourceIds: string[],
  relatedPath: string
): StudyQuestion => ({ id, muscleId: M, topic, type: 'fill-blank', prompt: 'Egészítsd ki a mondatot!', text, options, answer, explanation, sourceIds, relatedPath });

const match = (
  id: string,
  topic: StudyQuestion['topic'],
  prompt: string,
  pairs: [string, string][],
  explanation: string,
  sourceIds: string[],
  relatedPath: string
): StudyQuestion => ({
  id,
  muscleId: M,
  topic,
  type: 'matching',
  prompt,
  pairs: pairs.map(([left, right], i) => ({ id: `p${i + 1}`, left, right })),
  explanation,
  sourceIds,
  relatedPath
});

/* ------------------------------------------------------------------ */
/* Tanulókártyák                                                       */
/* ------------------------------------------------------------------ */

export const pmExtraFlashcards: Flashcard[] = [
  { id: 'fc-pm2-tendon', muscleId: M, topic: 'insertion', front: 'Milyen a nagy mellizom közös ínja?', back: 'Lapos, kétlemezes ín, amelynek lemezei U alakban csavarodnak: a kulcscsonti rostok disztálisabban, a legalsó rostok proximálisabban tapadnak. Emelt karnál a csavarodás kiegyenesedik.', sourceIds: ['grays-anatomy', 'moore-coa'] },
  { id: 'fc-pm2-fibres', muscleId: M, topic: 'regions', front: 'Merre futnak a rostok a három részben?', back: 'A kulcscsonti rész rostjai felülről-befelé (oldalra-lefelé a tapadás felé), a hasi rész rostjai alulról-befelé (felfelé-oldalra a tapadás felé) futnak; a szegycsonti-bordai rész rostjai a kettő között, közel vízszintesen.', sourceIds: ANAT },
  { id: 'fc-pm2-closed-chain', muscleId: M, topic: 'function', front: 'Mit tesz a nagy mellizom rögzített felkar mellett?', back: 'A törzset a kar felé húzhatja (pl. a húzódzkodás felső szakaszában); rögzített vállöv mellett járulékos belégzőizomként a bordákat emelheti.', sourceIds: ['grays-anatomy'] },
  { id: 'fc-pm2-ir-agonists', muscleId: M, topic: 'roles', front: 'Befelé forgatás: melyek az agonisták?', back: 'Lapocka alatti izom, nagy mellizom, széles hátizom, nagy görgetegizom, deltaizom elülső része.', sourceIds: KIN },
  { id: 'fc-pm2-flex-antagonists', muscleId: M, topic: 'roles', front: 'Vállízületi hajlítás: melyek az antagonisták?', back: 'Széles hátizom, nagy görgetegizom, deltaizom hátsó része, háromfejű karizom hosszú feje.', sourceIds: KIN },
  { id: 'fc-pm2-ecc-roles', muscleId: M, topic: 'contraction', front: 'Cserélődnek-e a szerepek a leengedő (excentrikus) szakaszban?', back: 'Nem. Ugyanazok az izmok dolgoznak: felfelé rövidülve mozgatnak, lefelé hosszabbodva fékeznek. Az antagonisták ilyenkor rövidülnek, de nem ők mozgatnak – a terhelés hozza létre a mozgást.', sourceIds: ['nsca-essentials', 'neumann-kinesiology'] },
  { id: 'fc-pm2-biceps', muscleId: M, topic: 'roles', front: 'Milyen szerepe van a kétfejű karizomnak fekvenyomásban?', back: 'A vállízületen szinergista (segíti a hajlítást/közelítést), a könyökízületen a háromfejű karizom antagonistája. A szerepek ízületenként értendők.', sourceIds: ['neumann-kinesiology'] },
  { id: 'fc-pm2-bench-angle', muscleId: M, topic: 'exercise', front: 'Fekvenyomás: mit mértek a pad dőlésszögével kapcsolatban?', back: 'A felső mellizomrész aktivitása 30°-nál volt a legnagyobb; vízszintes padon a középső és alsó rész; 45° felett a deltaizom elülső része aktívabb lett, a mellizom kevésbé. A háromfejű karizom aktivitása nem függött a dőléstől.', sourceIds: ['rodriguez-ridao-2020'] },
  { id: 'fc-pm2-db-vs-bb', muscleId: M, topic: 'exercise', front: 'Rúd vagy kézisúlyzó – mit mértek?', back: 'Kézisúlyzóval a maximális terhelés kb. 17%-kal kisebb volt; a nagy mellizom és a deltaizom elülső része aktivitása nem különbözött, a háromfejű karizomé kisebb, a kétfejű karizomé nagyobb volt.', sourceIds: ['saeterbakken-2011'] },
  { id: 'fc-pm2-pushup-support', muscleId: M, topic: 'exercise', front: 'Fekvőtámasz: hogyan változik a kézre jutó terhelés?', back: 'Lábemeléssel nő; kézemeléssel és térdelő változatban csökken. Alsó helyzetben több testtömeg jut a kézre, mint felsőben.', sourceIds: ['ebben-2011', 'suprak-2011'] },
  { id: 'fc-pm2-pushup-hands', muscleId: M, topic: 'exercise', front: 'Fekvőtámasz: keskeny vagy széles kéztartás?', back: 'Keskeny kéztartásnál a nagy mellizom és a háromfejű karizom EMG-aktivitása is nagyobb volt, mint széles kéztartásnál.', sourceIds: ['cogley-2005'] },
  { id: 'fc-pm2-pushup-plus', muscleId: M, topic: 'stabilization', front: 'Mi a fekvőtámasz plusz, és mire jó?', back: 'A felső helyzetben a lapocka előre csúszik a mellkasfalon (protrakció), ezt az elülső fűrészizom végzi. A vizsgált változatok közül ez adta az elülső fűrészizom legnagyobb aktivitását.', sourceIds: ['neumann-kinesiology', 'ludewig-2004'] },
  { id: 'fc-pm2-dips', muscleId: M, topic: 'exercise', front: 'Tolódzkodás: pad, korlát, gyűrű – mi a különbség?', back: 'Padon a legnagyobb a vállfeszítés (kb. az egyéni maximum), és a legtöbb izom aktivitása kisebb; korláton nagyobb az aktivitás; gyűrűn a legkisebb a vállfeszítés, és a nagy mellizom aktivitása itt volt a legnagyobb.', sourceIds: ['mckenzie-2022-variants'] },
  { id: 'fc-pm2-fly-moment', muscleId: M, topic: 'exercise', front: 'Kézisúlyzós tárogatás: hol a legnagyobb a terhelés a vállon?', back: 'Nyitott karnál, mert ekkor a legnagyobb az erőkar (a súlyzó messze van a vállízület függőlegesétől); a mellkas fölött közel nulla. Gépnél zárt helyzetben is van ellenállás.', sourceIds: ['neumann-kinesiology', 'nsca-essentials'] },
  { id: 'fc-pm2-stretch-regions', muscleId: M, topic: 'regions', front: 'Nyújtás: melyik karhelyzet melyik részt nyújtja jobban?', back: 'Kulcscsonti rész: főként 90°-os karemelésnél; szegycsonti rész: 90°-nál külső rotációval; hasi rész: 135°-nál medence-elfordítással és külső rotációval (nyírási modulus alapján).', sourceIds: ['umehara-2021'] },
  { id: 'fc-pm2-stretch-dose', muscleId: M, topic: 'exercise', front: 'Mennyi ideig nyújts? (ACSM)', back: 'Nagy izom-ín csoportonként összesen 60 másodpercig, legalább heti 2 napon.', sourceIds: ['garber-2011'] },
  { id: 'fc-pm2-stretch-acute', muscleId: M, topic: 'exercise', front: 'Mennyi ideig tart a nyújtás akut mozgástartomány-növelő hatása?', back: 'Jellemzően 30 percnél rövidebb ideig. 60 másodpercnél rövidebb statikus nyújtás után a teljesítménycsökkenés kisebb volt.', sourceIds: ['behm-2016'] },
  { id: 'fc-pm2-stabilizers', muscleId: M, topic: 'stabilization', front: 'Mely izmok stabilizálnak nyomó gyakorlatoknál a vállövben?', back: 'A rotátorköpeny (a felkarcsontfejet az ízületi árokban tartja), a rombuszizmok és a csuklyásizom (lapocka helyzete), az elülső fűrészizom (a lapockát a mellkasfalhoz rögzíti).', sourceIds: ['neumann-kinesiology', 'nsca-essentials'] },
  { id: 'fc-pm2-chain', muscleId: M, topic: 'exercise', front: 'Nyitott vagy zárt kinetikai lánc?', back: 'Zárt lánc: a kéz rögzített, a test mozog (fekvőtámasz, tolódzkodás, húzódzkodás). Nyitott lánc: a kéz/terhelés mozog, a törzs rögzített (fekvenyomás, tárogatás, gépes gyakorlatok).', sourceIds: ['neumann-kinesiology'] }
];

/* ------------------------------------------------------------------ */
/* Feladatok                                                           */
/* ------------------------------------------------------------------ */

export const pmExtraQuestions: StudyQuestion[] = [
  /* --- Elnevezés --- */
  mc('q-pm2-name-clav-la', 'name', 'Mi a nagy mellizom kulcscsonti részének latin neve?', ['Pars clavicularis', 'Pars sternocostalis', 'Pars abdominalis', 'Pars acromialis'], 0, 'A latin részelnevezések az eredési helyre utalnak: clavicula = kulcscsont. A „pars acromialis” a deltaizom egyik része.', ['fipat-ta2'], 'anatomia'),
  match('q-pm2-name-matching', 'name', 'Párosítsd a magyar és a latin részelnevezést!', [['Kulcscsonti rész', 'Pars clavicularis'], ['Szegycsonti-bordai rész', 'Pars sternocostalis'], ['Hasi rész', 'Pars abdominalis']], 'A részek neve az eredésükre utal: kulcscsont, szegycsont és bordaporcok, illetve a hasfal (a külső ferde hasizom bőnye).', ['fipat-ta2'], 'anatomia'),
  fill('q-pm2-name-en', 'name', 'A nagy mellizom angol neve: ___ major.', ['pectoralis', 'pectineus', 'deltoideus', 'serratus'], 'pectoralis', 'Latinul musculus pectoralis major; a „pectus” mellkast jelent.', ['fipat-ta2'], 'anatomia'),
  mc('q-pm2-name-meaning', 'name', 'Mire utal a nagy mellizom részeinek elnevezése?', ['Az eredésük helyére', 'A beidegző idegükre', 'A tapadásuk sorrendjére', 'A működésükre'], 0, 'Pars clavicularis (kulcscsont), pars sternocostalis (szegycsont és bordaporcok), pars abdominalis (hasfal) – mind az eredési helyet nevezi meg.', ['fipat-ta2', 'grays-anatomy'], 'anatomia'),

  mc('q-pm2-name-deltopectoral', 'name', 'Hogy hívják a nagy mellizom kulcscsonti része és a deltaizom közötti barázdát?', ['Sulcus deltoideopectoralis', 'Sulcus intertubercularis', 'Fossa infraclavicularis', 'Sulcus bicipitalis medialis'], 0, 'A kulcscsonti rész a deltaizommal határos; a határon fut a sulcus deltoideopectoralis. A sulcus intertubercularis a bicepsbarázda.', ANAT, 'anatomia'),

  /* --- Eredés --- */
  mc('q-pm2-origin-abd', 'origin', 'Honnan ered a nagy mellizom hasi része?', ['A külső ferde hasizom bőnyéjéről', 'Az egyenes hasizom hüvelyének hátsó lemezéről', 'A 7–9. borda csontos részéről', 'A csípőtaréjról'], 0, 'A hasi rész a külső ferde hasizom bőnyéjéről (aponeurosisáról) ered; ez a legkisebb, legalsó rész.', ANAT, 'anatomia'),
  mc('q-pm2-origin-not', 'origin', 'Melyik NEM eredése a nagy mellizomnak?', ['A hollócsőrnyúlvány', 'A kulcscsont mediális fele', 'A szegycsont elülső felszíne', 'A felső hat bordaporc'], 0, 'A hollócsőrnyúlvány a kis mellizom tapadása (és a hollócsőr-karizom, valamint a kétfejű karizom rövid fejének eredése) – a nagy mellizomhoz nincs köze.', ANAT, 'anatomia'),
  fill('q-pm2-origin-medial', 'origin', 'A kulcscsonti rész a kulcscsont ___ feléről ered.', ['mediális', 'laterális', 'hátsó', 'alsó'], 'mediális', 'A kulcscsont mediális (a szegycsont felőli) felén a nagy mellizom, a laterális harmadán a deltaizom elülső része ered.', ANAT, 'anatomia'),
  {
    id: 'q-pm2-diagram-clavicle',
    muscleId: M,
    topic: 'origin',
    type: 'diagram-identify',
    task: 'origin',
    viewId: 'anterior',
    prompt: 'Jelöld meg az ábrán azt a csontot, amelyről a kulcscsonti rész ered!',
    correctStructureIds: ['bone-clavicle'],
    selectableStructureIds: ['bone-sternum', 'bone-costal-cartilages', 'bone-clavicle', 'bone-humerus', 'bone-scapula', 'bone-ribs'],
    explanation: 'A kulcscsonti rész a kulcscsont mediális felének elülső felszínéről ered.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },
  mc('q-pm2-origin-variance', 'origin', 'A szegycsonti-bordai rész bordaporc-eredésénél a tankönyvek leggyakrabban az 1–6. bordaporcot adják meg. Mi a leggyakoribb eltérő leírás?', ['Az 1–7. bordaporc', 'A 2–4. bordaporc', 'A 8–10. borda', 'Csak az első bordaporc'], 0, 'Egyes leírások az 1–7. bordaporcot említik; az alkalmazás az 1–6. bordaporcot használja, és jelzi az eltérést.', ANAT, 'anatomia'),

  /* --- Tapadás --- */
  mc('q-pm2-insert-distal', 'insertion', 'Melyik rész rostjai tapadnak a legdisztálisabban (legalacsonyabban) a felkarcsonton?', ['A kulcscsonti rész rostjai', 'A hasi rész rostjai', 'A szegycsonti-bordai rész legalsó rostjai', 'Mind egy magasságban tapadnak'], 0, 'A közös ín két lemeze csavarodott: a kulcscsonti rostok disztálisabban, a legalsó rostok proximálisabban tapadnak.', ['grays-anatomy', 'moore-coa'], 'anatomia'),
  fill('q-pm2-insert-u', 'insertion', 'A közös ín két lemeze ___ alakban csavarodik.', ['U', 'V', 'X', 'L'], 'U', 'A lapos, kétlemezes ín U alakban csavarodik; emelt karnál a csavarodás kiegyenesedik.', ['grays-anatomy', 'moore-coa'], 'anatomia'),
  mc('q-pm2-insert-floor', 'insertion', 'Melyik izom tapad a bicepsbarázda alján?', ['A széles hátizom', 'A nagy mellizom', 'A nagy görgetegizom', 'A deltaizom'], 0, 'A barázda külső peremén a nagy mellizom, alján a széles hátizom, belső peremén a nagy görgetegizom tapad.', ANAT, 'anatomia'),
  mc('q-pm2-insert-raised', 'insertion', 'Mi történik a nagy mellizom ínjának csavarodásával, ha a kart magasra emeljük?', ['Kiegyenesedik', 'Fokozódik', 'Nem változik', 'Az ín két lemeze szétválik'], 0, 'Emelt karnál a csavarodás kiegyenesedik; ez a kétlemezes, csavarodott ín jellegzetessége.', ['grays-anatomy', 'moore-coa'], 'anatomia'),

  /* --- Beidegzés --- */
  mc('q-pm2-innerv-clav', 'innervation', 'Melyik ideg látja el főként a kulcscsonti részt?', ['A külső mellizomideg (n. pectoralis lateralis)', 'A belső mellizomideg (n. pectoralis medialis)', 'A hónaljideg (n. axillaris)', 'A hosszú mellkasi ideg (n. thoracicus longus)'], 0, 'A külső mellizomideg (C5–C7) főként a kulcscsonti részt, a belső (C8–T1) főként a szegycsonti-bordai és a hasi részt idegzi be.', ['moore-coa', 'statpearls-pectoral'], 'anatomia'),
  mc('q-pm2-innerv-long-thoracic', 'innervation', 'Melyik izmot idegzi be a n. thoracicus longus (hosszú mellkasi ideg)?', ['Az elülső fűrészizmot', 'A nagy mellizmot', 'A széles hátizmot', 'A deltaizmot'], 0, 'A n. thoracicus longus az elülső fűrészizom idege; a széles hátizmot a n. thoracodorsalis, a deltaizmot a n. axillaris látja el.', ['moore-coa', 'statpearls-pectoral'], 'anatomia'),
  fill('q-pm2-innerv-cord', 'innervation', 'A belső mellizomideg a plexus brachialis ___ kötegéből ered.', ['belső', 'külső', 'hátsó', 'felső'], 'belső', 'A külső mellizomideg a külső, a belső mellizomideg a belső kötegből ered – a nevük a kötegre utal, nem a helyzetükre az izomban.', ['moore-coa'], 'anatomia'),
  mc('q-pm2-innerv-segments', 'innervation', 'Mely gerincvelői szegmentumokból kap rostokat a belső mellizomideg?', ['C8–T1', 'C5–C7', 'C3–C5', 'T2–T4'], 0, 'Belső mellizomideg: C8–T1; külső mellizomideg: C5–C7.', ['moore-coa'], 'anatomia'),

  /* --- Funkció --- */
  mc('q-pm2-func-extension', 'function', 'Melyik rész feszíti a vállízületet hajlított karhelyzetből?', ['A szegycsonti-bordai rész', 'A kulcscsonti rész', 'Csak a hasi rész', 'Egyik sem; a nagy mellizom csak hajlít'], 0, 'A szegycsonti-bordai rész hajlított helyzetből az anatómiai helyzetig feszít; a kulcscsonti rész hajlító.', ['moore-coa', 'neumann-kinesiology'], 'biomechanika'),
  mc('q-pm2-func-not', 'function', 'Melyik mozgást NEM végzi a nagy mellizom?', ['Kifelé forgatás', 'Befelé forgatás', 'Közelítés', 'Horizontális közelítés'], 0, 'A nagy mellizom befelé forgató; a kifelé forgatás a tövis alatti izom és a kis görgetegizom feladata.', ['moore-coa', 'openstax-ap2e'], 'biomechanika'),
  mc('q-pm2-func-closed', 'function', 'Rögzített felkar mellett (pl. a húzódzkodás felső szakaszában) mit tehet a nagy mellizom?', ['A törzset a kar felé húzza', 'Kifelé forgatja a felkart', 'A lapockát emeli', 'A könyököt feszíti'], 0, 'Zárt kinetikai láncban az eredés és a tapadás szerepe megfordul: a rögzített felkar felé a törzs mozdul.', ['grays-anatomy'], 'biomechanika'),
  mc('q-pm2-func-inspiration', 'function', 'Mikor segítheti a nagy mellizom a belégzést?', ['Ha a felső végtag és a vállöv rögzített', 'Mindig, nyugodt légzésnél is', 'Csak kilégzéskor', 'Soha'], 0, 'Járulékos belégzőizomként csak rögzített felső végtag és vállöv mellett emelheti a bordákat (pl. kézzel megtámaszkodva).', ['grays-anatomy'], 'biomechanika'),
  fill('q-pm2-func-horizontal', 'function', 'Horizontális közelítéskor a kar a vízszintes síkban a test ___ felé mozog.', ['középvonala', 'háta', 'feje', 'lába'], 'középvonala', 'A horizontális közelítés a kar vízszintes síkú mozgása a test középvonala felé (pl. tárogatás zárása).', ['neumann-kinesiology'], 'biomechanika'),
  match('q-pm2-func-matching', 'function', 'Párosítsd a részt (vagy az egész izmot) a működésével!', [['Kulcscsonti rész', 'Vállízületi hajlítás'], ['Szegycsonti-bordai rész', 'Feszítés hajlított helyzetből'], ['Az egész izom', 'Befelé forgatás']], 'A kulcscsonti rész hajlít, a szegycsonti-bordai rész hajlított helyzetből feszít, az egész izom közelít és befelé forgat.', ['moore-coa', 'neumann-kinesiology'], 'biomechanika'),

  /* --- Érintett ízületek --- */
  mc('q-pm2-joint-which', 'joints', 'Melyik ízületen hat közvetlenül a nagy mellizom?', ['A vállízületen (glenohumeralis ízület)', 'A könyökízületen', 'A szegycsont-kulcscsonti ízületen', 'A vállcsúcs-kulcscsonti ízületen'], 0, 'Eredése a mellkasfalon és a kulcscsonton, tapadása a felkarcsonton van – így a vállízületen át hat.', ANAT, 'anatomia'),
  mc('q-pm2-joint-fly', 'joints', 'Hány ízületben történik fő mozgás a kézisúlyzós tárogatásnál?', ['Egyben: a vállízületben (közel állandó könyökszöggel)', 'Kettőben: a vállban és a könyökben', 'Háromban', 'Egyben sem; izometriás gyakorlat'], 0, 'A tárogatás egyízületi gyakorlat: horizontális közelítés és távolítás a vállízületben, közel állandó könyökszöggel – ezért a háromfejű karizom nem fő mozgató.', ['neumann-kinesiology'], 'gyakorlatok'),
  mc('q-pm2-joint-bench', 'joints', 'Fekvenyomásnál mely ízületekben történik fő mozgás?', ['A vállízületben és a könyökízületben', 'Csak a vállízületben', 'Csak a könyökízületben', 'A csuklóban és a könyökben'], 0, 'A vállízületben horizontális közelítés és hajlítás, a könyökben feszítés történik.', ['neumann-kinesiology', 'nsca-essentials'], 'gyakorlatok'),

  mc('q-pm2-joint-dips', 'joints', 'Tolódzkodás leengedésekor mely ízületekben történik fő mozgás?', ['A vállízületben (feszítés) és a könyökízületben (hajlítás)', 'Csak a könyökízületben', 'Csak a vállízületben (hajlítás)', 'A csuklóban'], 0, 'Leengedéskor a vállízület hátrafeszül, a könyök hajlik; feltoláskor fordítva.', ['neumann-kinesiology'], 'gyakorlatok'),
  mc('q-pm2-joint-plus', 'joints', 'Mi mozdul el a fekvőtámasz plusz „plusz” szakaszában, amikor a könyök már nyújtott?', ['A lapocka a mellkasfalon (előre csúszik)', 'A könyökízület', 'A csuklóízület', 'A gerinc'], 0, 'A plusz szakaszban a lapocka előre csúszik a mellkasfalon (protrakció); ezt az elülső fűrészizom végzi.', ['neumann-kinesiology'], 'gyakorlatok'),

  /* --- Izomrészek --- */
  mc('q-pm2-regions-count', 'regions', 'Hány részre tagolják a nagy mellizmot?', ['Háromra', 'Kettőre', 'Négyre', 'Nem tagolódik részekre'], 0, 'Kulcscsonti, szegycsonti-bordai és hasi rész (pars clavicularis, sternocostalis, abdominalis).', ['fipat-ta2', 'grays-anatomy'], 'anatomia'),
  mc('q-pm2-regions-fibres', 'regions', 'Melyik rész rostjai futnak alulról felfelé-oldalra a tapadás felé?', ['A hasi rész', 'A kulcscsonti rész', 'A szegycsonti-bordai rész felső rostjai', 'Egyik sem'], 0, 'A hasi rész rostjai alulról, a kulcscsonti rész rostjai felülről futnak a közös tapadáshoz; emiatt a karhelyzet határozza meg, melyik rész húz hatékonyabban.', ANAT, 'anatomia'),
  mc('q-pm2-regions-stretch-abd', 'regions', 'Egy elasztográfiás vizsgálatban melyik helyzetben nyúlt a leginkább a hasi rész?', ['135°-os karemelés, medence-elfordítás és külső rotáció mellett', '45°-os karemelésnél, semleges forgatással', '90°-os karemelésnél, semleges forgatással', 'Leengedett karral'], 0, 'A hasi rész nyírási modulusa 135°-os távolításnál, medence-elfordítással és külső rotációval volt magasabb – a felfelé futó rostokat a magasra emelt kar nyújtja.', ['umehara-2021'], 'gyakorlatok'),
  mc('q-pm2-regions-stretch-clav', 'regions', 'Ugyanebben a vizsgálatban melyik helyzet volt a kulcscsonti rész kiemelt nyújtási helyzetei között?', ['Horizontális távolítás 90°-os karemelésnél', 'Horizontális távolítás 135°-os karemelésnél, semleges forgatással', 'Vállízületi hajlítás', 'Befelé forgatás'], 0, 'A kulcscsonti résznél három helyzet emelkedett ki: 90°-nál (külső rotációval és anélkül), illetve 45°-nál medence-elfordítással és külső rotációval.', ['umehara-2021'], 'gyakorlatok'),

  /* --- Szerepek --- */
  mc('q-pm2-roles-add-antag', 'roles', 'A vállízületi közelítésben melyik izmok az antagonisták?', ['A deltaizom középső része és a tövis feletti izom', 'A széles hátizom és a nagy görgetegizom', 'A hollócsőr-karizom és a kétfejű karizom', 'A lapocka alatti izom és a kis görgetegizom'], 0, 'A deltaizom középső része és a tövis feletti izom távolítók, így a közelítés antagonistái. A széles hátizom és a nagy görgetegizom agonisták.', KIN, 'biomechanika'),
  mc('q-pm2-roles-add-ag', 'roles', 'A vállízületi közelítésben melyik két izom agonista a nagy mellizom mellett?', ['A széles hátizom és a nagy görgetegizom', 'A deltaizom középső része és a tövis feletti izom', 'Az elülső fűrészizom és a rombuszizmok', 'A kétfejű és a háromfejű karizom'], 0, 'A közelítés fő mozgatói: nagy mellizom, széles hátizom, nagy görgetegizom.', KIN, 'biomechanika'),
  mc('q-pm2-roles-ir-antag', 'roles', 'Befelé forgatásnál melyik izom antagonista?', ['A tövis alatti izom', 'A lapocka alatti izom', 'A nagy görgetegizom', 'A széles hátizom'], 0, 'A tövis alatti izom, a kis görgetegizom és a deltaizom hátsó része kifelé forgat – ők a befelé forgatás antagonistái.', KIN, 'biomechanika'),
  mc('q-pm2-roles-flex-antag', 'roles', 'Vállízületi hajlításnál melyik izom antagonista?', ['A széles hátizom', 'A deltaizom elülső része', 'A hollócsőr-karizom', 'A kulcscsonti rész'], 0, 'A hajlítás antagonistái a feszítők: széles hátizom, nagy görgetegizom, deltaizom hátsó része, háromfejű karizom hosszú feje.', KIN, 'biomechanika'),
  match('q-pm2-roles-bench', 'roles', 'Fekvenyomás, leengedés: párosítsd az izmot a szerepével!', [['Nagy mellizom', 'Agonista (hosszabbodva fékez)'], ['Deltaizom hátsó része', 'Antagonista'], ['Hollócsőr-karizom', 'Szinergista'], ['Rotátorköpeny', 'Stabilizáló']], 'A leengedésnél is ugyanazok az agonisták – hosszabbodva fékeznek. A horizontális távolítók antagonisták, a rotátorköpeny a felkarcsontfejet tartja.', ['nsca-essentials', 'neumann-kinesiology'], 'gyakorlatok'),
  mc('q-pm2-roles-swap', 'roles', 'Fekvenyomásnál a leengedő szakaszban melyik állítás igaz?', ['Ugyanazok az agonisták dolgoznak, hosszabbodva fékeznek', 'Az antagonisták válnak agonistává, ők húzzák le a rudat', 'Egyik izom sem aktív', 'Csak a stabilizálók dolgoznak'], 0, 'A szerepek nem cserélődnek meg: a leengedést a terhelés hozza létre, a mozgatóizmok excentrikusan fékezik.', ['nsca-essentials', 'neumann-kinesiology'], 'gyakorlatok'),
  mc('q-pm2-roles-biceps', 'roles', 'Fekvenyomásnál milyen szerepe van a kétfejű karizomnak?', ['A vállízületen szinergista, a könyökízületen antagonista', 'Fő mozgató mindkét ízületben', 'Csak stabilizáló', 'Nincs szerepe'], 0, 'A szerepek ízületenként értendők: a kétfejű karizom a vállon segít, a könyökön a háromfejű karizommal ellentétesen hat.', ['neumann-kinesiology'], 'gyakorlatok'),
  mc('q-pm2-roles-stretch', 'roles', 'Falnál végzett statikus mellizomnyújtásnál mi a nagy mellizom szerepe?', ['Nyújtott izom – ideális esetben ellazult, nem dolgozik aktívan', 'Agonista, koncentrikusan dolgozik', 'Antagonista, excentrikusan dolgozik', 'Stabilizáló, izometriásan dolgozik'], 0, 'A nyújtást a testhelyzet hozza létre; a nyújtott izom ideálisan ellazult, ezért ott nincs agonista.', ['neumann-kinesiology'], 'gyakorlatok'),

  /* --- Stabilizáló működés --- */
  mc('q-pm2-stab-serratus', 'stabilization', 'Horizontális közelítésnél mi az elülső fűrészizom stabilizáló feladata?', ['A lapockát a mellkasfalhoz rögzíti', 'A felkarcsontfejet befelé forgatja', 'A könyököt feszíti', 'A kulcscsontot emeli'], 0, 'Az elülső fűrészizom a lapockát a mellkasfalhoz rögzíti; így a vállöv stabil alapot ad a mozgáshoz.', KIN, 'biomechanika'),
  mc('q-pm2-stab-cuff', 'stabilization', 'Mi a rotátorköpeny stabilizáló szerepe nyomó gyakorlatoknál?', ['A felkarcsontfejet az ízületi árokban tartja (centrálja)', 'A lapockát lehúzza', 'A törzset egyenesen tartja', 'A könyököt rögzíti'], 0, 'A rotátorköpeny négy izma a felkarcsontfejet az ízületi árokban centrálja terhelés alatt.', KIN, 'biomechanika'),
  mc('q-pm2-stab-pushup-trunk', 'stabilization', 'Fekvőtámasznál melyik izmok tartják egyenesen a testet (a medence nem süllyed)?', ['A hasfal izmai (egyenes és külső ferde hasizom)', 'A nagy mellizom és a deltaizom', 'A kétfejű karizom', 'A rombuszizmok'], 0, 'A hasfal izmai tartják egy vonalban a vállat, a csípőt és a bokát; ez a fekvőtámasz törzsstabilizációs igénye.', ['nsca-essentials'], 'gyakorlatok'),
  mc('q-pm2-stab-plus', 'stabilization', 'A fekvőtámasz plusz „plusz” szakaszában melyik izom dolgozik leginkább?', ['Az elülső fűrészizom (a lapocka protrakciója)', 'A csuklyásizom felső része', 'A nagy mellizom hasi része', 'A széles hátizom'], 0, 'A vizsgált változatok közül a hagyományos fekvőtámasz plusz adta az elülső fűrészizom legnagyobb aktivitását és a csuklyásizom felső része / elülső fűrészizom legkisebb arányát.', ['ludewig-2004', 'neumann-kinesiology'], 'gyakorlatok'),

  mc('q-pm2-stab-pm-support', 'stabilization', 'Milyen stabilizáló szerepe van magának a nagy mellizomnak támaszhelyzetekben (fekvőtámasz, tolódzkodás)?', ['A kart a törzshöz rögzíti, miközben a testsúly a felső végtagon adódik át', 'A lapockát emeli', 'A könyököt feszíti', 'Nincs stabilizáló szerepe'], 0, 'A nagy mellizom támaszhelyzetekben a kart a törzshöz rögzíti, és a vállízület elülső oldalán dinamikus támaszt ad.', ['neumann-kinesiology'], 'anatomia'),
  mc('q-pm2-stab-scapula-bench', 'stabilization', 'Fekvenyomásnál mely izmok tartják a lapockát a hátra-lehúzott helyzetben?', ['A rombuszizmok és a csuklyásizom', 'A kétfejű és a háromfejű karizom', 'A nagy mellizom és a deltaizom elülső része', 'A hasizmok'], 0, 'A lapocka hátra-lehúzott helyzetét a lapockaizmok (rombuszizmok, csuklyásizom) rögzítik; ez stabil alapot ad a padon.', ['nsca-essentials', 'neumann-kinesiology'], 'gyakorlatok'),

  /* --- Izomműködési típusok --- */
  mc('q-pm2-contr-pushup-down', 'contraction', 'Fekvőtámasz leengedésekor milyen működést végez a nagy mellizom?', ['Excentrikus', 'Koncentrikus', 'Nem aktív', 'Csak izometriás'], 0, 'A test ereszkedését a mozgatóizmok hosszabbodva fékezik – excentrikus működés.', ['nsca-essentials'], 'gyakorlatok'),
  mc('q-pm2-contr-pecdeck-first', 'contraction', 'Gépes tárogatásnál (pec deck) a nyitott kiinduló helyzetből indulva melyik szakasz jön először?', ['A koncentrikus (zárás)', 'Az excentrikus (nyitás)', 'Az izometriás', 'A passzív nyújtás'], 0, 'A gépes és kábeles gyakorlatok a nyújtott (nyitott) helyzetből indulnak, ezért a zárás – koncentrikus szakasz – az első.', ['nsca-essentials'], 'gyakorlatok'),
  mc('q-pm2-contr-stretch', 'contraction', 'Statikus nyújtás tartásakor milyen a nyújtott nagy mellizom működése (ideális esetben)?', ['Passzív – nem húzódik össze aktívan, a hossza közel állandó', 'Izometriás összehúzódás', 'Excentrikus működés', 'Koncentrikus működés'], 0, 'A nyújtás passzív szakasz: a hosszváltozást a testhelyzet okozza, nem izomösszehúzódás.', ['neumann-kinesiology'], 'gyakorlatok'),
  fill('q-pm2-contr-dips-up', 'contraction', 'Tolódzkodás feltolásakor a háromfejű karizom ___ működik.', ['koncentrikusan', 'excentrikusan', 'passzívan', 'nem'], 'koncentrikusan', 'Feltoláskor a könyök feszül, a háromfejű karizom rövidül – koncentrikus működés.', ['neumann-kinesiology', 'nsca-essentials'], 'gyakorlatok'),
  match('q-pm2-contr-fly', 'contraction', 'Kézisúlyzós tárogatás: párosítsd a szakaszt a nagy mellizom hosszváltozásával!', [['Nyitás', 'Hosszabbodik (excentrikus)'], ['Megtartás nyitott karral', 'Közel változatlan (izometriás)'], ['Zárás', 'Rövidül (koncentrikus)']], 'A tárogatásnál is ugyanaz az izom dolgozik mindhárom szakaszban; csak a hosszváltozás iránya más.', ['nsca-essentials', 'neumann-kinesiology'], 'gyakorlatok'),

  /* --- Gyakorlatok --- */
  mc('q-pm2-ex-steep-incline', 'exercise', 'Fekvenyomásnál 45°-nál meredekebb padon mi változott az EMG-vizsgálatban?', ['A deltaizom elülső része aktívabb lett, a nagy mellizom kevésbé', 'A nagy mellizom alsó része lett a legaktívabb', 'A háromfejű karizom aktivitása megduplázódott', 'Semmi nem változott'], 0, 'Rodríguez-Ridao és mtsai szerint 45° felett a deltaizom elülső részének aktivitása jelentősen nőtt, a nagy mellizomé csökkent.', ['rodriguez-ridao-2020'], 'gyakorlatok'),
  mc('q-pm2-ex-triceps-angle', 'exercise', 'Hogyan függött a háromfejű karizom aktivitása a pad dőlésszögétől (0–60°)?', ['Minden dőlésszögnél hasonló volt', '0°-nál volt a legnagyobb', '60°-nál volt a legnagyobb', 'Negatív padon volt a legnagyobb'], 0, 'A vizsgálatban a háromfejű karizom aktivitása minden dőlésszögnél hasonló volt.', ['rodriguez-ridao-2020'], 'gyakorlatok'),
  mc('q-pm2-ex-lower-45', 'exercise', 'Lauver és mtsai vizsgálatában melyik pad mellett volt a legkisebb az alsó mellizomrész aktivitása?', ['45°-os ferde padon', 'Vízszintes padon', '−15°-os negatív padon', '30°-os ferde padon'], 0, 'Az alsó rész aktivitása −15°-nál, 0°-nál és 30°-nál nagyobb volt, mint 45°-nál.', ['lauver-2016'], 'gyakorlatok'),
  mc('q-pm2-ex-db-1rm', 'exercise', 'Kézisúlyzós és rudas fekvenyomást összehasonlítva mekkora volt a különbség a maximális terhelésben?', ['A két súlyzó együtt kb. 17%-kal kevesebb volt', 'Nem volt különbség', 'Kézisúlyzóval kb. 17%-kal több', 'Kézisúlyzóval a felére csökkent'], 0, 'Saeterbakken és mtsai vizsgálatában a kézisúlyzós terhelés 17%-kal volt kisebb a rúdénál.', ['saeterbakken-2011'], 'gyakorlatok'),
  mc('q-pm2-ex-db-emg', 'exercise', 'Ugyanebben a vizsgálatban melyik izom aktivitása volt NAGYOBB kézisúlyzóval, mint rúddal?', ['A kétfejű karizomé', 'A háromfejű karizomé', 'A nagy mellizomé', 'A deltaizom elülső részéé'], 0, 'A kétfejű karizom aktivitása a stabilitási igénnyel nőtt; a háromfejű karizomé kisebb volt, a nagy mellizom és a deltaizom elülső része nem különbözött.', ['saeterbakken-2011'], 'gyakorlatok'),
  mc('q-pm2-ex-pushup-feet', 'exercise', 'Melyik fekvőtámasz-változat adta a legnagyobb talajreakció-erőt a kézen?', ['Lábemeléses (láb dobozon)', 'Kézemeléses (kéz dobozon)', 'Térdelő', 'Mind egyforma volt'], 0, 'Ebben és mtsai szerint a lábemelés nagyobb, a kézemelés és a térdelő változat kisebb erőt adott, mint a többi változat.', ['ebben-2011'], 'gyakorlatok'),
  mc('q-pm2-ex-pushup-bottom', 'exercise', 'Fekvőtámasznál melyik helyzetben jut több testtömeg a kézre?', ['Az alsó helyzetben', 'A felső helyzetben', 'Mindkettőben ugyanannyi', 'Csak térdelő változatnál van különbség'], 0, 'Suprak és mtsai szerint hagyományos és térdelő fekvőtámasznál is az alsó helyzetben volt nagyobb a kézre jutó testtömeg-hányad.', ['suprak-2011'], 'gyakorlatok'),
  mc('q-pm2-ex-pushup-narrow', 'exercise', 'Fekvőtámasznál melyik kéztartásnál volt nagyobb a nagy mellizom és a háromfejű karizom EMG-aktivitása?', ['Keskeny kéztartásnál', 'Széles kéztartásnál', 'Nem volt különbség', 'Csak a háromfejű karizomnál volt különbség'], 0, 'Cogley és mtsai szerint keskeny kéztartásnál mindkét izom aktivitása nagyobb volt, mint széles kéztartásnál.', ['cogley-2005'], 'gyakorlatok'),
  mc('q-pm2-ex-dips-bench', 'exercise', 'Melyik tolódzkodás-változatnál volt a legnagyobb a vállfeszítés?', ['A padon végzettnél', 'A korláton végzettnél', 'A gyűrűn végzettnél', 'Mindháromnál azonos volt'], 0, 'McKenzie és mtsai szerint padon a vállfeszítés átlagosan elérte az egyéni maximum kb. 101%-át; korláton kb. 88%, gyűrűn kb. 69% volt.', ['mckenzie-2022-variants'], 'gyakorlatok'),
  mc('q-pm2-ex-dips-ring', 'exercise', 'Melyik tolódzkodás-változatnál volt a legnagyobb a nagy mellizom aktivitása?', ['A gyűrűn végzettnél', 'A padon végzettnél', 'A korláton végzettnél', 'Nem mérték'], 0, 'A gyűrűn végzett változatnál volt a legnagyobb a nagy mellizom, a széles hátizom és a kétfejű karizom aktivitása; a szerzők esésveszély esetén a korlátot javasolják.', ['mckenzie-2022-variants'], 'gyakorlatok'),
  mc('q-pm2-ex-dips-fatigue', 'exercise', 'Hogyan hatott a fáradás a korláton végzett tolódzkodásra?', ['A legnagyobb ízületi szögek nem változtak, de nőtt a nagy mellizom és a háromfejű karizom aktivitása', 'A mozgástartomány jelentősen csökkent', 'Minden izom aktivitása csökkent', 'Az ismétlések gyorsabbak lettek'], 0, 'McKenzie és mtsai szerint a fáradás nem változtatta meg a legnagyobb ízületi szögeket, de nőtt az ismétlésidő és a fő mozgatók aktivitása.', ['mckenzie-2022-fatigue'], 'gyakorlatok'),
  mc('q-pm2-ex-fly-moment', 'exercise', 'Kézisúlyzós tárogatásnál hol a legnagyobb az ellenállás a vállízületen?', ['Nyitott karnál (a súlyzó oldalt)', 'Zárt karnál (a súlyzó a mellkas fölött)', 'Az egész mozgás alatt azonos', 'Csak a megtartáskor'], 0, 'A nyomaték az erőkarral arányos: nyitott karnál a súlyzó messze van a vállízület függőlegesétől, a mellkas fölött az erőkar közel nulla.', ['neumann-kinesiology', 'nsca-essentials'], 'gyakorlatok'),
  mc('q-pm2-ex-cable-high', 'exercise', 'Csigás keresztbehúzásnál felső csigáról (felülről lefelé) húzva mi társul a horizontális közelítéshez?', ['A vállízület közelítése (a kar lefelé, a test felé mozog)', 'A vállízület hajlítása', 'Kifelé forgatás', 'Könyökhajlítás'], 0, 'Felülről lefelé húzásnál a kezek a has/csípő előtt találkoznak: a közelítés iránya társul a horizontális közelítéshez (anatómiai levezetés).', ['neumann-kinesiology'], 'gyakorlatok'),
  match('q-pm2-ex-chain', 'exercise', 'Párosítsd a gyakorlatot a kinetikai lánc típusával!', [['Fekvőtámasz', 'Zárt lánc'], ['Tolódzkodás', 'Zárt lánc'], ['Fekvenyomás', 'Nyitott lánc'], ['Gépes tárogatás', 'Nyitott lánc']], 'Zárt láncban a kéz rögzített és a test mozog; nyitott láncban a terhelés (rúd, gép karja) mozog.', ['neumann-kinesiology'], 'gyakorlatok'),
  mc('q-pm2-ex-stretch-dose', 'exercise', 'Az ACSM ajánlása szerint mennyi ideig érdemes egy nyújtó gyakorlatot végezni?', ['Gyakorlatonként összesen 60 másodpercig, legalább heti 2 napon', 'Gyakorlatonként 5 percig, naponta', '10 másodpercig, hetente egyszer', 'Amíg fájdalmat nem érzünk'], 0, 'Az ACSM állásfoglalása (Garber 2011) a nagy izom-ín csoportokra gyakorlatonként összesen 60 másodpercet, legalább heti 2 napot javasol.', ['garber-2011'], 'gyakorlatok'),
  mc('q-pm2-ex-stretch-acute', 'exercise', 'Mit állapított meg egy szisztematikus áttekintés a nyújtás akut mozgástartomány-növelő hatásáról?', ['Jellemzően 30 percnél rövidebb ideig tart', 'Legalább egy napig tart', 'Nincs ilyen hatás', 'Csak dinamikus nyújtás után jelentkezik'], 0, 'Behm és mtsai szerint minden nyújtásfajta növelte a mozgástartományt, de ez jellemzően 30 percnél rövidebb ideig tartott.', ['behm-2016'], 'gyakorlatok'),
  mc('q-pm2-ex-stretch-short', 'exercise', 'Közvetlenül teljesítmény előtt melyik statikus nyújtás okozott kisebb teljesítménycsökkenést?', ['Izomcsoportonként 60 másodpercnél rövidebb', 'Izomcsoportonként 60 másodperc vagy hosszabb', 'A hosszabb mindig jobb', 'Nincs különbség'], 0, 'A 60 másodpercnél rövidebb statikus nyújtás után kisebb volt a teljesítménycsökkenés, mint 60 másodperc vagy annál hosszabb nyújtás után.', ['behm-2016'], 'gyakorlatok'),

  /* --- Izomfelismerés az ábrán --- */
  {
    id: 'q-pm2-diagram-sterno',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'anterior',
    prompt: 'Kattints az ábrán a nagy mellizom szegycsonti-bordai részére!',
    correctStructureIds: ['muscle-pectoralis-major-sternocostal'],
    selectableStructureIds: ['muscle-pectoralis-major-clavicular', 'muscle-pectoralis-major-sternocostal', 'muscle-pectoralis-major-abdominal', 'muscle-deltoid-anterior', 'muscle-serratus-anterior', 'muscle-external-oblique', 'muscle-latissimus-dorsi'],
    explanation: 'A szegycsonti-bordai rész a legnagyobb rész; a szegycsontról és a bordaporcokról legyezőszerűen fut a felkarcsont felé.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pm2-diagram-abd',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'anterior',
    prompt: 'Kattints az ábrán a nagy mellizom hasi részére!',
    correctStructureIds: ['muscle-pectoralis-major-abdominal'],
    selectableStructureIds: ['muscle-pectoralis-major-clavicular', 'muscle-pectoralis-major-sternocostal', 'muscle-pectoralis-major-abdominal', 'muscle-serratus-anterior', 'muscle-external-oblique', 'muscle-latissimus-dorsi'],
    explanation: 'A hasi rész a legalsó, legkisebb rész, a külső ferde hasizom bőnyéje felől.',
    sourceIds: ANAT,
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pm2-diagram-serratus',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'anterior',
    prompt: 'Kattints arra az izomra, amely a lapockát a mellkasfalhoz rögzíti (horizontális közelítésnél stabilizáló)!',
    correctStructureIds: ['muscle-serratus-anterior'],
    selectableStructureIds: ['muscle-pectoralis-major-sternocostal', 'muscle-pectoralis-major-abdominal', 'muscle-serratus-anterior', 'muscle-external-oblique', 'muscle-latissimus-dorsi', 'muscle-deltoid-anterior'],
    explanation: 'Az elülső fűrészizom a mellkas oldalfalán, fűrészfogszerű eredéssel látszik; a lapockát a mellkasfalhoz rögzíti.',
    sourceIds: KIN,
    relatedPath: 'anatomia'
  },
  {
    id: 'q-pm2-diagram-lat',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'anterior',
    prompt: 'Kattints arra az izomra, amely a vállízületi közelítésben a nagy mellizommal együtt agonista, a hajlításban viszont antagonista!',
    correctStructureIds: ['muscle-latissimus-dorsi'],
    selectableStructureIds: ['muscle-latissimus-dorsi', 'muscle-serratus-anterior', 'muscle-deltoid-anterior', 'muscle-deltoid-middle', 'muscle-coracobrachialis', 'muscle-biceps-brachii'],
    explanation: 'A széles hátizom közelít és feszít a vállízületben – a közelítésben agonista, a hajlításban antagonista.',
    sourceIds: KIN,
    relatedPath: 'biomechanika'
  },
  {
    id: 'q-pm2-diagram-post-delt',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'lateral',
    prompt: 'Oldalnézet: kattints arra az izomra, amely a horizontális közelítés antagonistája!',
    correctStructureIds: ['muscle-deltoid-posterior'],
    selectableStructureIds: ['muscle-deltoid-anterior', 'muscle-deltoid-middle', 'muscle-deltoid-posterior', 'muscle-pectoralis-major-clavicular', 'muscle-pectoralis-major-sternocostal', 'muscle-biceps-brachii', 'muscle-triceps-long-head'],
    explanation: 'A deltaizom hátsó része horizontális távolítást végez, ezért a horizontális közelítés antagonistája.',
    sourceIds: KIN,
    relatedPath: 'biomechanika'
  },
  {
    id: 'q-pm2-diagram-infraspinatus',
    muscleId: M,
    topic: 'recognition',
    type: 'diagram-identify',
    task: 'muscle',
    viewId: 'posterior',
    prompt: 'Hátulnézet: kattints arra a rotátorköpeny-izomra, amely a befelé forgatás egyik antagonistája!',
    correctStructureIds: ['muscle-infraspinatus', 'muscle-teres-minor'],
    selectableStructureIds: ['muscle-infraspinatus', 'muscle-teres-minor', 'muscle-supraspinatus', 'muscle-teres-major', 'muscle-latissimus-dorsi', 'muscle-rhomboids', 'muscle-trapezius', 'muscle-deltoid-posterior'],
    explanation: 'A tövis alatti izom és a kis görgetegizom a rotátorköpeny kifelé forgató izmai – mindkettő elfogadott válasz. A nagy görgetegizom és a széles hátizom befelé forgat.',
    sourceIds: KIN,
    relatedPath: 'biomechanika'
  }
];
