import type { MotionDefinition } from '../../types';
import { subclavius } from '../muscles/subclavius';

/**
 * A kulcscsont alatti izom funkcióinak animációi: a kulcscsont süllyesztése (emelt helyzetből),
 * a vállöv süllyesztése (alaphelyzet alá) – mindkettő a mozgó vállövű elölnézetben, ahol a
 * kulcscsont a szegycsont-kulcscsonti ízület körül fordul –, valamint a járulékos belégzés (az 1.
 * borda emelése rögzített kulcscsontnál) az emelkedő mellkasú elölnézetben.
 */
const M = 'muscle-subclavius';
/** A vállöv környéke mindkét oldalon (elölnézeti koordinátákban): a kis izom jól látsszon. */
const BOX_GIRDLE: [number, number, number, number] = [70, 20, 460, 300];

const rolesFor = (movementId: MotionDefinition['movementId']) => subclavius.roles.filter((r) => r.movementId === movementId);

/**
 * A modell három működési módja: az aktív izom rövidül, hosszabbodik vagy közel azonos hosszú marad.
 * Hogy a kulcscsont merre mozdul, azt a szegycsont-kulcscsonti ízület körüli eredő nyomaték
 * határozza meg (a többi izom, a külső terhelés és a mozgás állapota együtt), nem egyetlen izom
 * ereje; ezért a szöveg a hosszváltozást írja le, és a szemléltetett terhelést feltevésként jelöli.
 */
const contraction = (shortText: string, example: string): MotionDefinition['contraction'] => ({
  concentric: {
    summary: `Az aktív izom rövidül – ${shortText}.`,
    detail: `A tapadás (a kulcscsont alsó felszíne) az eredés (1. borda) felé közeledik, az izom rövidebb lesz. A kulcscsont mozgása a szegycsont-kulcscsonti ízület körüli eredő nyomatéktól függ: ehhez a többi izom, a külső terhelés és a mozgás állapota is hozzájárul. ${example}`
  },
  eccentric: {
    summary: 'Az aktív izom hosszabbodik – a kulcscsont laterális vége emelkedik.',
    detail: 'Az eredés és a tapadás távolodik, az izom hosszabb lesz, miközben a modell aktívnak tekinti. Ez akkor jön létre, ha a kulcscsontra ható eredő nyomaték emelő irányú. Az izom aktivitását ebben a szakaszban nem mérték – a szemléltetés feltevés.'
  },
  isometric: {
    summary: 'Az izom aktív, a hossza és a kulcscsont helyzete közel változatlan.',
    detail: 'Lehetséges stabilizáló működés: az izom a kulcscsontot az 1. borda felé húzva, elmozdulás nélkül rögzítheti. Hogy ez milyen gyakori, arra nincs közvetlen mérés.'
  }
});

export const subClavicularDepression: MotionDefinition = {
  id: 'sub-clavicular-depression',
  muscleId: M,
  movementId: 'clavicular-depression',
  name: { hu: 'A kulcscsont süllyesztése', en: 'Clavicular depression', la: 'Depressio claviculae' },
  viewId: 'anterior-girdle',
  viewBox: BOX_GIRDLE,
  startPose: { clavicleElevation: 14, scapularUpwardRotation: 0, shoulderAbduction: 12 },
  endPose: { clavicleElevation: 0, scapularUpwardRotation: 0, shoulderAbduction: 12 },
  durationMs: 2800,
  description:
    'A süllyesztés első tartománya: az emelt helyzetű kulcscsont (+14°) visszatér a semleges helyzetig (0°); a laterális vége lefelé fordul a szegycsont-kulcscsonti ízület körül. (A második animáció ugyanezt az irányt a semleges helyzet alatt mutatja.) A kulcscsont alatti izom az 1. bordától a kulcscsont alsó felszínéig fut, ezért rövidülésével a kulcscsontot lefelé, az 1. borda felé húzhatja. A szögek szemléltető modellértékek.',
  resistance:
    'Feltételezett terhelési helyzet: egy, a vállövet felfelé húzó erő, amellyel szemben a süllyesztők dolgoznak. Magából a mozdulatból – például a felhúzott vállak leengedéséből – nem következik, hogy az izom aktívan rövidül: a leengedést a gravitáció is létrehozhatja.',
  contraction: contraction('a kulcscsont laterális vége lefelé mozdul', 'Szemléltetett példa (a fenti terhelési feltevéssel): a felhúzott vállak lehúzása és lent tartása.'),
  roles: rolesFor('clavicular-depression'),
  regionNotes: [],
  claims: [
    { text: 'A kulcscsont alatti izom a kulcscsontot süllyeszti és rögzíti, így mozgás közben stabilizálja.', evidence: 'anatomical-fact', sourceIds: ['openstax-ap2e', 'moore-coa'] },
    { text: 'A vállöv süllyesztői (kis mellizom, csuklyásizom alsó része, széles hátizom) a kulcscsontot is lefelé viszik.', evidence: 'educational-model', sourceIds: ['neumann-kinesiology'] },
    {
      text: 'Az animáció a kulcscsontot merev testként, 2D-ben, a szegycsont-kulcscsonti ízület körüli fordulással mutatja; a lapocka vele együtt mozog, saját mozgása (a vállcsúcs-kulcscsonti ízületben) nincs ábrázolva. A kulcscsont saját tengelye körüli forgása – amely karemeléskor a szegycsont-kulcscsonti ízület jelentős mozgása – sem látszik.',
      evidence: 'educational-model',
      sourceIds: ['ludewig-2009']
    },
    {
      text: 'Egy 12 fős EMG-vizsgálat a kulcscsont alatti izom szegycsont-kulcscsonti ízületet stabilizáló szerepét támogatja (az absztrakt alapján).',
      evidence: 'documented-observation',
      sourceIds: ['reis-1979']
    },
    {
      text: 'A kulcscsont alatti izom hosszváltozása az animációban a geometriából adódik; az izom aktivitását a bemutatott helyzetben nem mérték.',
      evidence: 'educational-model',
      sourceIds: []
    }
  ]
};

export const subGirdleDepression: MotionDefinition = {
  id: 'sub-girdle-depression',
  muscleId: M,
  movementId: 'scapular-depression',
  name: { hu: 'A vállöv süllyesztése', en: 'Shoulder girdle depression' },
  viewId: 'anterior-girdle',
  viewBox: BOX_GIRDLE,
  startPose: { clavicleElevation: 0, scapularUpwardRotation: 0, shoulderAbduction: 12 },
  endPose: { clavicleElevation: -10, scapularUpwardRotation: 0, shoulderAbduction: 12 },
  durationMs: 2800,
  description:
    'A süllyesztés második tartománya: a semleges helyzetből (0°) az alá (−10°); a kulcscsont és vele a lapocka lefelé mozdul. Az első animáció ugyanezt az irányt az emelt helyzetből a semlegesig mutatja. A szemléltetett helyzetben a kis mellizom és a csuklyásizom alsó része a lapockára, a széles hátizom a felkarcsontra hat; a kulcscsont alatti izom közvetlenül a kulcscsontra, annak süllyesztésével és rögzítésével segíthet. A szögek szemléltető modellértékek.',
  resistance:
    'Feltételezett terhelési helyzet: a vállövet felfelé toló erő – például támaszban a testsúly a vállakat a fül felé tolja. Magából a korlátos támaszból nem következik, hogy a kulcscsont alatti izom aktívan rövidül vagy hosszabbodik; a modell ezt a terhelési feltevés alapján mutatja.',
  contraction: contraction('a vállöv lefelé mozdul', 'Szemléltetett példa (a fenti terhelési feltevéssel): támaszban a vállak lehúzása.'),
  roles: rolesFor('scapular-depression'),
  regionNotes: [],
  claims: [
    { text: 'A kulcscsont alatti izom a vállat (vállövet) süllyeszti.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral'] },
    { text: 'A vállöv süllyesztői más-más csontra hatnak: a kis mellizom a lapockára, a széles hátizom a felkarcsontra, a kulcscsont alatti izom a kulcscsontra.', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology', 'openstax-ap2e', 'statpearls-pectoral'] },
    { text: 'A szemléltetett helyzetben a kulcscsont alatti izmot szinergistaként, a kis mellizmot, a csuklyásizom alsó részét és a széles hátizmot agonistaként mutatjuk; ez a sorrend erre a helyzetre vonatkozó oktatási modell.', evidence: 'educational-model', sourceIds: ['neumann-kinesiology'] },
    { text: 'Az animáció a süllyesztést a kulcscsont merev, 2D-s, szegycsont-kulcscsonti ízület körüli fordulásaként mutatja; a kulcscsont saját tengely körüli forgása és a lapocka mellkasfalon való csúszása nincs ábrázolva.', evidence: 'educational-model', sourceIds: ['ludewig-2009'] }
  ]
};

export const subAccessoryInspiration: MotionDefinition = {
  id: 'sub-accessory-inspiration',
  muscleId: M,
  movementId: 'accessory-inspiration',
  name: { hu: 'Az 1. borda emelése rögzített kulcscsonttal', en: 'Elevation of the first rib with a fixed clavicle' },
  viewId: 'anterior-respiration',
  viewBox: BOX_GIRDLE,
  startPose: { shoulderAbduction: 30, ribLift: 0 },
  endPose: { shoulderAbduction: 30, ribLift: -10 },
  durationMs: 3000,
  contractionTypes: ['concentric'],
  description:
    'Ha a kulcscsont és a vállöv rögzített, a kulcscsont alatti izom „fordítva” működhet: a kulcscsont nem mozdul, az izom az 1. bordát emelheti a kulcscsont felé. Ez tankönyvi mechanizmus; az izom aktív rövidülése és a vállövet rögzítő izmok részvétele a bemutatott modell feltétele.',
  resistance:
    'Külső teher nincs. A nyugodt belégzést a fő belégzőizmok (rekeszizom, külső bordaközi izmok) végzik; ezek az ábrán nem szerepelnek.',
  contraction: {
    concentric: {
      summary: 'A modell feltétele: az izom aktív és rövidül – az 1. borda a rögzített kulcscsont felé emelkedik.',
      detail: 'Az eredés (1. borda) mozog a tapadás (kulcscsont) felé; a kulcscsont helyzete nem változik. A belégzés közbeni fázisonkénti izomaktivitást nem mérték.'
    },
    eccentric: { summary: 'Ennél a funkciónál nem szemléltetjük.', detail: '' },
    isometric: { summary: 'Ennél a funkciónál nem szemléltetjük.', detail: '' }
  },
  roles: rolesFor('accessory-inspiration'),
  regionNotes: [],
  claims: [
    { text: 'Rögzített kulcscsont mellett a kulcscsont alatti izom az 1. borda emelésében részt vehet (tankönyvi mechanizmus).', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral'] },
    {
      text: 'Az ábra az 1. borda emelkedését 2D-ben, az egész mellkas függőleges eltolásával szemlélteti. A valódi bordamozgás forgást és térbeli mellkastágulást (oldalra és előre) is tartalmaz.',
      evidence: 'educational-model',
      sourceIds: []
    }
  ]
};

export const subclaviusMotions: MotionDefinition[] = [subClavicularDepression, subGirdleDepression, subAccessoryInspiration];
