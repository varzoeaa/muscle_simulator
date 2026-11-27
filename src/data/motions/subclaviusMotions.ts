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

const contraction = (shortText: string, example: string): MotionDefinition['contraction'] => ({
  concentric: {
    summary: `Az aktív izom rövidül – ${shortText}.`,
    detail: `A kulcscsont alatti izom húzóereje meghaladja a külső ellenállást, ezért a tapadás (a kulcscsont alsó felszíne) az eredés (1. borda) felé közeledik. ${example}`
  },
  eccentric: {
    summary: 'Az aktív izom terhelés alatt hosszabbodik – a kulcscsont fékezetten emelkedik.',
    detail: 'A külső ellenállás nagyobb, mint az izom ereje, ezért a kulcscsont laterális vége emelkedik, de az izom aktív marad és fékez. Az eredés és a tapadás távolodik.'
  },
  isometric: {
    summary: 'Az izom aktív, a kulcscsont helyzete közel változatlan.',
    detail: 'Az izom a kulcscsontot az 1. borda felé húzva rögzíti, elmozdulás nélkül – ez stabilizáló működésének leggyakoribb formája.'
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
    'A felhúzott (emelt) helyzetű kulcscsont visszatér: a laterális vége lefelé fordul a szegycsont-kulcscsonti ízület körül. A kulcscsont alatti izom az 1. bordától a kulcscsont alsó felszínéig fut, ezért rövidülésével a kulcscsontot lefelé, az 1. borda felé húzza.',
  resistance:
    'Szemléltetett ellenállás: a vállövet felfelé húzó erő – például vállvonogatás (felhúzott vállak) után, vagy amikor a kar emelésekor a vállöv megemelkedik. A süllyesztők ezzel szemben dolgoznak.',
  contraction: contraction('a kulcscsont laterális vége lefelé mozdul', 'Példa: a felhúzott vállak kontrollált leengedése és lent tartása.'),
  roles: rolesFor('clavicular-depression'),
  regionNotes: [],
  claims: [
    { text: 'A kulcscsont alatti izom a kulcscsontot süllyeszti és rögzíti, így mozgás közben stabilizálja.', evidence: 'anatomical-fact', sourceIds: ['openstax-ap2e', 'moore-coa'] },
    { text: 'A vállöv süllyesztői (kis mellizom, csuklyásizom alsó része, széles hátizom) a kulcscsontot is lefelé viszik.', evidence: 'educational-model', sourceIds: ['neumann-kinesiology'] },
    {
      text: 'Az animáció a kulcscsontot merev testként, a szegycsont-kulcscsonti ízület körüli fordulással mutatja; a lapocka vele együtt mozog. A kulcscsont saját tengelye körüli forgása nincs ábrázolva.',
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
    'A vállöv az alaphelyzet alá süllyed: a kulcscsont és vele a lapocka lefelé mozdul. A fő mozgatók a kis mellizom, a csuklyásizom alsó része és a széles hátizom; a kulcscsont alatti izom a kulcscsont süllyesztésével és rögzítésével segít.',
  resistance:
    'Szemléltetett ellenállás: a vállövet felfelé toló erő – például támaszhelyzetben (tolódzkodás, támasz a korláton) a testsúly a vállakat a fül felé tolja.',
  contraction: contraction('a vállöv lefelé mozdul', 'Példa: támaszban a vállak aktív lehúzása.'),
  roles: rolesFor('scapular-depression'),
  regionNotes: [],
  claims: [
    { text: 'A kulcscsont alatti izom a vállat (vállövet) süllyeszti.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral'] },
    { text: 'A vállöv süllyesztésében szinergista: a fő mozgatók a kis mellizom, a csuklyásizom alsó része és a széles hátizom.', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology', 'openstax-ap2e'] },
    { text: 'Az animáció a süllyesztést a kulcscsont szegycsont-kulcscsonti ízület körüli fordulásaként mutatja; a lapocka mellkasfalon való csúszása nincs ábrázolva.', evidence: 'educational-model', sourceIds: [] }
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
    'Ha a kulcscsont és a vállöv rögzített, a kulcscsont alatti izom „fordítva” működhet: a kulcscsont nem mozdul, az izom az 1. bordát emeli a kulcscsont felé.',
  resistance:
    'Külső teher nincs. A nyugodt belégzést a fő belégzőizmok (rekeszizom, külső bordaközi izmok) végzik; ezek az ábrán nem szerepelnek.',
  contraction: {
    concentric: {
      summary: 'Az izom aktív és rövidül – az 1. borda a rögzített kulcscsont felé emelkedik.',
      detail: 'Az eredés (1. borda) mozog a tapadás (kulcscsont) felé; a kulcscsont helyzete nem változik.'
    },
    eccentric: { summary: 'Ennél a funkciónál nem szemléltetjük.', detail: '' },
    isometric: { summary: 'Ennél a funkciónál nem szemléltetjük.', detail: '' }
  },
  roles: rolesFor('accessory-inspiration'),
  regionNotes: [],
  claims: [
    { text: 'A kulcscsont alatti izom az 1. borda emelésében is részt vesz.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral'] },
    {
      text: 'Az ábra a bordák emelkedését egyszerű függőleges eltolással szemlélteti (az egész mellkas emelkedik). A valódi bordamozgás összetettebb: a bordák forognak, és a mellkas oldalra és előre is tágul.',
      evidence: 'educational-model',
      sourceIds: []
    }
  ]
};

export const subclaviusMotions: MotionDefinition[] = [subClavicularDepression, subGirdleDepression, subAccessoryInspiration];
