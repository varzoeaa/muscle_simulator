import type { MotionDefinition } from '../../types';
import { pectoralisMajor } from '../muscles/pectoralisMajor';
import { solveClosedChain } from '../geometry/anteriorVariants';

const rolesFor = (movementId: MotionDefinition['movementId']) => pectoralisMajor.roles.filter((r) => r.movementId === movementId);

export const pmAdduction: MotionDefinition = {
  id: 'pm-adduction',
  muscleId: 'muscle-pectoralis-major',
  movementId: 'shoulder-adduction',
  name: { hu: 'Vállízületi közelítés', en: 'Shoulder adduction', la: 'Adductio' },
  viewId: 'anterior',
  startPose: { shoulderAbduction: 95 },
  endPose: { shoulderAbduction: 8 },
  durationMs: 3200,
  description:
    'A felkar a frontális síkban, oldalsó emelt helyzetből a törzs mellé mozog. A szegycsonti-bordai és a hasi rész rostjai a mellkastól a felkarcsont felé futnak, így rövidülésükkel a tapadást (a nagy gumó tarajat) az eredés felé húzzák.',
  resistance:
    'Szemléltetett külső ellenállás: magasról, oldalról érkező csigakábel, amely a kart távolító irányba húzza. Ezért kell a közelítő izmoknak dolgozniuk. (Álló helyzetben, csiga nélkül a kar leengedését a gravitáció végezné, és a távolító izmok dolgoznának excentrikusan.)',
  contraction: {
    concentric: {
      summary: 'Az aktív izom rövidül – a kar a törzs felé mozog.',
      detail:
        'A nagy mellizom által kifejtett húzóerő meghaladja a csigakábel ellenállását, ezért az eredés és a tapadás közelebb kerül egymáshoz. Edzőtermi példa: egykezes csigás közelítés felhúzó irányú kábellel.'
    },
    eccentric: {
      summary: 'Az aktív izom terhelés alatt hosszabbodik – a kar fékezetten távolodik.',
      detail:
        'A kábel ellenállása nagyobb, mint az izom által kifejtett erő, ezért a kar távolító irányba mozdul, de az izom aktív marad és fékezi a mozgást. Az eredés és a tapadás távolodik egymástól.'
    },
    isometric: {
      summary: 'Az izom aktív, de a kar helyzete közel változatlan.',
      detail:
        'Az izom erőkifejtése és a külső ellenállás egyensúlyban van. Az izom-ín egység hossza és az ízületi szög megközelítőleg állandó, az izom mégis aktívan feszül.'
    }
  },
  roles: rolesFor('shoulder-adduction'),
  regionNotes: [
    {
      regionId: 'muscle-pectoralis-major-sternocostal',
      text: 'A fő közelítő rész: rostjai emelt karnál a közelítés irányába húznak.'
    },
    {
      regionId: 'muscle-pectoralis-major-abdominal',
      text: 'A legalsó rostok emelt karhelyzetből lefelé-befelé húzzák a kart, a szegycsonti-bordai résszel együtt.'
    },
    {
      regionId: 'muscle-pectoralis-major-clavicular',
      text: 'Közelítő szerepe kisebb, és a karhelyzettől függ; elsősorban a vállízület hajlításában jelentős.'
    }
  ],
  claims: [
    { text: 'A nagy mellizom a vállízület közelítő izma.', evidence: 'anatomical-fact', sourceIds: ['moore-coa', 'openstax-ap2e'] },
    { text: 'Az izomrészek közelítésben betöltött eltérő szerepe a rostirányból következik.', evidence: 'educational-model', sourceIds: ['neumann-kinesiology'] },
    { text: 'Az animáció a frontális síkú mozgás egyszerűsített 2D vetülete; a lapocka együttmozgását nem ábrázolja.', evidence: 'educational-model', sourceIds: [] }
  ]
};

export const pmHorizontalAdduction: MotionDefinition = {
  id: 'pm-horizontal-adduction',
  muscleId: 'muscle-pectoralis-major',
  movementId: 'shoulder-horizontal-adduction',
  name: { hu: 'Horizontális közelítés', en: 'Horizontal adduction' },
  viewId: 'superior',
  startPose: { shoulderHorizontalAbduction: 108 },
  endPose: { shoulderHorizontalAbduction: 4 },
  durationMs: 3200,
  description:
    'A 90°-ban emelt felkar a vízszintes síkban, oldalról előre mozog. Felülnézetben jól látszik, hogy a nagy mellizom rostjai a mellkas elülső falától a felkarcsont elülső felszínéig futnak, ezért rövidülésük a kart előre-befelé fordítja.',
  resistance:
    'Szemléltetett külső ellenállás: hátulról-oldalról húzó csigakábel vagy kézisúlyzó hanyatt fekve (tárogatás). Az ellenállás a kart horizontális távolítás irányába húzza.',
  contraction: {
    concentric: {
      summary: 'Az aktív izom rövidül – a kar előre-befelé mozog.',
      detail: 'Például a csigás kereszthúzás vagy a pec deck összezáró szakasza. Az eredés (szegycsont, kulcscsont) és a tapadás közelebb kerül.'
    },
    eccentric: {
      summary: 'Az aktív izom terhelés alatt hosszabbodik – a kar fékezetten nyílik oldalra.',
      detail:
        'Például a kézisúlyzós tárogatás leengedő szakasza: a súly a kart lefelé-oldalra viszi, a nagy mellizom aktívan fékezi a mozgást, miközben hossza nő.'
    },
    isometric: {
      summary: 'Az izom aktív, a kar helyzete közel változatlan.',
      detail: 'Például a tárogatás tartása egy adott szögben. Az izom feszül, de az ízületi szög és az izom-ín egység hossza megközelítőleg állandó.'
    }
  },
  roles: rolesFor('shoulder-horizontal-adduction'),
  regionNotes: [
    { regionId: 'muscle-pectoralis-major-clavicular', text: 'A kulcscsonti rész rostjai felülről-befelé futnak; a mozgásban a szegycsonti-bordai résszel együtt dolgozik.' },
    { regionId: 'muscle-pectoralis-major-sternocostal', text: 'A szegycsonti-bordai rész rostjai a vízszintes síkhoz közel futnak, ezért ebben a mozgásban jelentős a húzásuk.' }
  ],
  claims: [
    { text: 'A horizontális közelítés fő izmai a nagy mellizom és a deltaizom elülső része.', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology'] },
    { text: 'A hasi rész felülnézetben nem látható, ezért nem szerepel ezen az ábrán.', evidence: 'educational-model', sourceIds: [] },
    { text: 'Az animáció egyszerűsített 2D vetület; a lapocka protrakcióját és a könyök helyzetváltozását nem ábrázolja.', evidence: 'educational-model', sourceIds: [] }
  ]
};

export const pmInternalRotation: MotionDefinition = {
  id: 'pm-internal-rotation',
  muscleId: 'muscle-pectoralis-major',
  movementId: 'shoulder-internal-rotation',
  name: { hu: 'Befelé forgatás', en: 'Internal (medial) rotation', la: 'Rotatio medialis' },
  viewId: 'superior-arm-at-side',
  startPose: { shoulderInternalRotation: -45 },
  endPose: { shoulderInternalRotation: 35 },
  durationMs: 3200,
  description:
    'A felkar a törzs mellett lóg, a könyök 90°-ban hajlított. Felülről a felkarcsontot a hossztengelye mentén látjuk: befelé forgatáskor a csont a saját tengelye körül fordul, az előre mutató alkar a has felé mozdul. A nagy mellizom a felkarcsont elülső felszínén, a nagy gumó taraján tapad, ezért rövidülése a csont elülső felszínét befelé, a mellkas felé fordítja.',
  resistance:
    'Szemléltetett külső ellenállás: oldalról (laterálisan) húzó csigakábel vagy gumiszalag, amely az alkart kifelé, a kifelé forgatás irányába húzza.',
  contraction: {
    concentric: {
      summary: 'Az aktív izom rövidül – az alkar befelé, a has felé fordul.',
      detail: 'Például a csigás befelé forgatás húzó szakasza. A tapadás (nagy gumó taraja) a felkarcsonttal együtt befelé fordul, közelebb kerül az eredéshez.'
    },
    eccentric: {
      summary: 'Az aktív izom terhelés alatt hosszabbodik – az alkar fékezetten kifelé fordul.',
      detail: 'A kábel ellenállása nagyobb az izom erőkifejtésénél: a kar kifelé fordul, a befelé forgató izmok aktívan fékezik a mozgást.'
    },
    isometric: {
      summary: 'Az izom aktív, a kar helyzete közel változatlan.',
      detail: 'A forgatás egy adott szögben megtartva: az izom feszül, az ízületi szög megközelítőleg állandó.'
    }
  },
  roles: rolesFor('shoulder-internal-rotation'),
  regionNotes: [
    { regionId: 'muscle-pectoralis-major-clavicular', text: 'A teljes izommal együtt részt vesz a befelé forgatásban.' },
    { regionId: 'muscle-pectoralis-major-sternocostal', text: 'A teljes izommal együtt részt vesz a befelé forgatásban.' }
  ],
  claims: [
    { text: 'A nagy mellizom a felkar befelé forgató izma.', evidence: 'anatomical-fact', sourceIds: ['moore-coa', 'openstax-ap2e'] },
    {
      text: 'A befelé forgatásban a lapocka alatti izom, a széles hátizom, a nagy görgetegizom és a deltaizom elülső része is agonista.',
      evidence: 'anatomical-fact',
      sourceIds: ['neumann-kinesiology']
    },
    {
      text: 'Az ábrán csak a lapocka alatti izom, a tövis alatti izom és a nagy mellizom látszik; a többi forgató izom ebből a nézetből takarásban van. A befelé forgatás tartományának végét a valóságban a törzs korlátozza, ezért az animáció rövidebb tartományt mutat.',
      evidence: 'educational-model',
      sourceIds: []
    }
  ]
};

export const pmFlexion: MotionDefinition = {
  id: 'pm-flexion',
  muscleId: 'muscle-pectoralis-major',
  movementId: 'shoulder-flexion',
  name: { hu: 'Vállízületi hajlítás', en: 'Shoulder flexion', la: 'Flexio' },
  viewId: 'lateral',
  startPose: { shoulderFlexion: -15 },
  endPose: { shoulderFlexion: 80 },
  durationMs: 3200,
  description:
    'A felkar a szagittális síkban, a törzs mellől előre-felfelé emelkedik. Oldalnézetben látszik, hogy a kulcscsonti rész rostjai a kulcscsonttól lefelé-kifelé futnak a felkarcsont elülső felszínéig, ezért rövidülésük a kart előre emeli. A szegycsonti-bordai rész rostjai lejjebb erednek, így anatómiai helyzetből indulva nem emelik a kart.',
  resistance:
    'Szemléltetett külső ellenállás: kézisúlyzó álló helyzetben (előreemelés). A gravitáció a kart lefelé, a feszítés irányába húzza, ezért a hajlító izmoknak kell dolgozniuk.',
  contraction: {
    concentric: {
      summary: 'Az aktív izom (kulcscsonti rész) rövidül – a kar előre-felfelé emelkedik.',
      detail: 'A kézisúlyzós előreemelés emelő szakasza. A kulcscsonti rész tapadása közelebb kerül a kulcscsonti eredéshez.'
    },
    eccentric: {
      summary: 'Az aktív izom terhelés alatt hosszabbodik – a kar fékezetten ereszkedik.',
      detail: 'Az előreemelés leengedő szakasza: a gravitáció lefelé viszi a kart, a hajlító izmok aktívan fékezik.'
    },
    isometric: {
      summary: 'Az izom aktív, a kar adott magasságban megáll.',
      detail: 'Az előreemelés tartása: az izom feszül, az ízületi szög megközelítőleg állandó.'
    }
  },
  roles: rolesFor('shoulder-flexion'),
  regionNotes: [
    { regionId: 'muscle-pectoralis-major-clavicular', text: 'A hajlításban részt vevő mellizom-rész; különösen anatómiai helyzetből indulva.' },
    { regionId: 'muscle-pectoralis-major-sternocostal', text: 'Anatómiai helyzetből indulva nem hajlít; hajlított karhelyzetből éppen feszítőként működik.' }
  ],
  claims: [
    { text: 'A nagy mellizom kulcscsonti része a vállízület hajlító izma.', evidence: 'anatomical-fact', sourceIds: ['moore-coa', 'neumann-kinesiology'] },
    { text: 'A hajlítás agonistái a deltaizom elülső része és a nagy mellizom kulcscsonti része.', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology'] },
    {
      text: 'Az animáció 80°-ig mutatja a mozgást. A magasabb karemeléshez a lapocka felfelé rotációja is szükséges, ezt az ábra nem mutatja.',
      evidence: 'educational-model',
      sourceIds: []
    }
  ]
};

export const pmExtension: MotionDefinition = {
  id: 'pm-extension',
  muscleId: 'muscle-pectoralis-major',
  movementId: 'shoulder-extension',
  name: { hu: 'Feszítés hajlított helyzetből', en: 'Extension from a flexed position', la: 'Extensio' },
  viewId: 'lateral',
  startPose: { shoulderFlexion: 110 },
  endPose: { shoulderFlexion: 0 },
  durationMs: 3200,
  description:
    'Az előre-felfelé emelt kar a szagittális síkban lefelé, a törzs mellé mozog. Ebben a karhelyzetben a szegycsonti-bordai rész rostjai a mellkastól felfelé futnak a felkarcsontig, ezért rövidülésük lefelé húzza a kart. A feszítő hatás az anatómiai helyzetig tart.',
  resistance:
    'Szemléltetett külső ellenállás: elölről-felülről húzó csigakábel (egyenes karos lehúzás). A kábel a kart előre-felfelé, a hajlítás irányába húzza.',
  contraction: {
    concentric: {
      summary: 'Az aktív izom rövidül – a kar lefelé, a törzs mellé mozog.',
      detail: 'Az egyenes karos lehúzás húzó szakasza. A szegycsonti-bordai rész tapadása közelebb kerül a szegycsonti és bordai eredéshez.'
    },
    eccentric: {
      summary: 'Az aktív izom terhelés alatt hosszabbodik – a kar fékezetten emelkedik.',
      detail: 'A lehúzás visszaengedő szakasza: a kábel felfelé viszi a kart, a feszítő izmok aktívan fékezik.'
    },
    isometric: {
      summary: 'Az izom aktív, a kar helyzete közel változatlan.',
      detail: 'A lehúzás megtartása egy adott szögben: az izom feszül, az ízületi szög megközelítőleg állandó.'
    }
  },
  roles: rolesFor('shoulder-extension'),
  regionNotes: [
    { regionId: 'muscle-pectoralis-major-sternocostal', text: 'Hajlított karhelyzetből a vállízület feszítője, az anatómiai helyzetig.' },
    { regionId: 'muscle-pectoralis-major-abdominal', text: 'A legalsó rostok emelt karhelyzetből szintén lefelé húzzák a kart, a szegycsonti-bordai résszel együtt.' },
    { regionId: 'muscle-pectoralis-major-clavicular', text: 'Nem feszít: hajlító rész, ebben a mozgásban az antagonisták közé tartozik.' }
  ],
  claims: [
    {
      text: 'A nagy mellizom szegycsonti-bordai része hajlított karhelyzetből feszíti a vállízületet az anatómiai helyzetig.',
      evidence: 'anatomical-fact',
      sourceIds: ['moore-coa', 'neumann-kinesiology']
    },
    { text: 'A feszítés agonistái között van a széles hátizom és a nagy görgetegizom is.', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology'] },
    {
      text: 'Az anatómiai helyzeten túli hátranyújtásban a nagy mellizom nem feszít, ezért az animáció az anatómiai helyzetben áll meg.',
      evidence: 'educational-model',
      sourceIds: ['moore-coa']
    }
  ]
};

export const pmClosedChain: MotionDefinition = {
  id: 'pm-closed-chain',
  muscleId: 'muscle-pectoralis-major',
  movementId: 'shoulder-adduction',
  name: { hu: 'Rögzített kar: a törzs a kar felé (húzódzkodás)', en: 'Fixed arm: trunk drawn towards the arm (pull-up)' },
  viewId: 'anterior-closed-chain',
  startPose: { lift: 0.4 },
  endPose: { lift: 1 },
  solvePose: solveClosedChain,
  durationMs: 3600,
  description:
    'Zárt kinetikai lánc: a kéz a rúdon rögzített, ezért nem a kar mozog a törzs felé, hanem a törzs a kar felé. Az ízületben ugyanaz a közelítés zajlik, de a nagy mellizom a mozgó eredést (mellkas) húzza a rögzített tapadás (felkarcsont) felé. Az animáció a széles fogású húzódzkodás felső szakaszát mutatja elölről, sematikusan.',
  resistance: 'Ellenállás: a testsúly. A gravitáció a törzset lefelé húzza, a karokat a távolítás irányába viszi.',
  contraction: {
    concentric: {
      summary: 'Az aktív izom rövidül – a törzs felemelkedik a rúd felé.',
      detail: 'A húzódzkodás felhúzó szakasza. A felkar a törzshöz képest közelít, miközben a test emelkedik.'
    },
    eccentric: {
      summary: 'Az aktív izom terhelés alatt hosszabbodik – a test fékezetten ereszkedik.',
      detail: 'A húzódzkodás leengedő szakasza: a testsúly lefelé viszi a törzset, a közelítő izmok aktívan fékezik.'
    },
    isometric: {
      summary: 'Az izom aktív, a test egy adott magasságban megáll.',
      detail: 'Tartás a rúdon (pl. felső helyzetben). Az izom feszül, az ízületi szögek megközelítőleg állandók.'
    }
  },
  roles: rolesFor('shoulder-adduction'),
  regionNotes: [
    { regionId: 'muscle-pectoralis-major-sternocostal', text: 'A közelítés fő mellizom-része; rögzített karnál a mellkast húzza a felkar felé.' },
    { regionId: 'muscle-pectoralis-major-abdominal', text: 'A legalsó rostok a szegycsonti-bordai résszel együtt húznak.' },
    { regionId: 'muscle-pectoralis-major-clavicular', text: 'Közelítő szerepe kisebb, és a karhelyzettől függ.' }
  ],
  claims: [
    { text: 'Rögzített felkar esetén (pl. a húzódzkodás felső szakaszában) a nagy mellizom a törzset a kar felé húzhatja.', evidence: 'anatomical-fact', sourceIds: ['grays-anatomy'] },
    { text: 'Nyitott és zárt láncban ugyanaz az ízületi mozgás zajlik; a különbség az, hogy melyik csontvég mozog.', evidence: 'educational-model', sourceIds: ['neumann-kinesiology'] },
    {
      text: 'Az ábra a könyökhajlító izmok munkáját és a lapocka mozgását nem mutatja; a kar helyzetét egyszerű kétszegmenses geometria számolja a rögzített fogásból.',
      evidence: 'educational-model',
      sourceIds: []
    }
  ]
};

export const pmAccessoryInspiration: MotionDefinition = {
  id: 'pm-accessory-inspiration',
  muscleId: 'muscle-pectoralis-major',
  movementId: 'accessory-inspiration',
  name: { hu: 'Járulékos belégzés rögzített felkarral', en: 'Accessory inspiration with a fixed arm' },
  viewId: 'anterior-respiration',
  startPose: { shoulderAbduction: 30, ribLift: 0 },
  endPose: { shoulderAbduction: 30, ribLift: -12 },
  durationMs: 3000,
  contractionTypes: ['concentric'],
  description:
    'Ha a felső végtag és a vállöv rögzített (pl. a kéz egy asztalon vagy a térden támaszkodik), a nagy mellizom „fordítva” működhet: a felkar nem mozdul, az izom a szegycsontot és a bordákat emeli a felkar felé. Így járulékos belégzőizomként segítheti a mellkas tágulását.',
  resistance:
    'Külső teher nincs. A nyugodt belégzést a fő belégzőizmok (rekeszizom, külső bordaközi izmok) végzik; ezek az ábrán nem szerepelnek.',
  contraction: {
    concentric: {
      summary: 'Az izom aktív és rövidül – a bordák és a szegycsont a rögzített felkar felé emelkednek.',
      detail: 'Az eredés (szegycsont, bordaporcok) mozog a tapadás (felkarcsont) felé, a felkar helyzete nem változik.'
    },
    eccentric: { summary: 'Ennél a funkciónál nem szemléltetjük.', detail: '' },
    isometric: { summary: 'Ennél a funkciónál nem szemléltetjük.', detail: '' }
  },
  roles: rolesFor('accessory-inspiration'),
  regionNotes: [
    { regionId: 'muscle-pectoralis-major-sternocostal', text: 'Eredése a szegycsonton és a bordaporcokon van, ezért ez a rész emelheti a bordákat.' },
    { regionId: 'muscle-pectoralis-major-abdominal', text: 'A szegycsonti-bordai résszel együtt húzhat.' },
    { regionId: 'muscle-pectoralis-major-clavicular', text: 'A kulcscsonton ered, ezért a bordák emelésében nem vesz részt.' }
  ],
  claims: [
    { text: 'Rögzített vállöv mellett a nagy mellizmot járulékos belégzőizomként is leírják.', evidence: 'anatomical-fact', sourceIds: ['grays-anatomy'] },
    {
      text: 'Az ábra a bordák emelkedését egyszerű függőleges eltolással szemlélteti. A valódi bordamozgás összetettebb: a bordák forognak, és a mellkas oldalra és előre is tágul.',
      evidence: 'educational-model',
      sourceIds: []
    },
    { text: 'Az animáció nem mutatja a légzés mértékét és az izom aktivitásának nagyságát.', evidence: 'educational-model', sourceIds: [] }
  ]
};

export const motions: MotionDefinition[] = [pmAdduction, pmHorizontalAdduction, pmInternalRotation, pmFlexion, pmExtension, pmClosedChain, pmAccessoryInspiration];
export const motionById = (id: string | undefined) => motions.find((m) => m.id === id);
