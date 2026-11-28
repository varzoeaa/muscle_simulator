import type { MotionDefinition } from '../../types';
import { pectoralisMinor } from '../muscles/pectoralisMinor';

/**
 * A kis mellizom funkcióinak animációi. A lapockamozgások a mozgó vállövű nézetváltozatokban
 * (girdleVariants) jelennek meg; a járulékos belégzés a nagy mellizomnál is használt, emelkedő
 * mellkasú elülső nézetben.
 */
const M = 'muscle-pectoralis-minor';
const rolesFor = (movementId: MotionDefinition['movementId']) => pectoralisMinor.roles.filter((r) => r.movementId === movementId);

const STANDARD_CONTRACTION = (verbShort: string, verbLong: string, example: string): MotionDefinition['contraction'] => ({
  concentric: {
    summary: `Az aktív izom rövidül – ${verbShort}.`,
    detail: `A kis mellizom húzóereje meghaladja a külső ellenállást, ezért a hollócsőrnyúlvány (tapadás) a bordák (eredés) felé közeledik. ${example}`
  },
  eccentric: {
    summary: 'Az aktív izom terhelés alatt hosszabbodik – a lapocka fékezetten tér vissza.',
    detail: `A külső ellenállás nagyobb, mint az izom ereje, ezért ${verbLong} ellentétes irányban történik, de az izom aktív marad és fékez. Az eredés és a tapadás távolodik.`
  },
  isometric: {
    summary: 'Az izom aktív, a lapocka helyzete közel változatlan.',
    detail: 'Az izom ereje és a külső ellenállás egyensúlyban van: a kis mellizom a lapockát a helyén tartja, miközben feszül. Ez a stabilizáló működés leggyakoribb formája.'
  }
});

export const pmiDepression: MotionDefinition = {
  id: 'pmi-depression',
  muscleId: M,
  movementId: 'scapular-depression',
  name: { hu: 'A lapocka süllyesztése', en: 'Scapular depression', la: 'Depressio scapulae' },
  viewId: 'anterior-girdle',
  startPose: { clavicleElevation: 0, scapularUpwardRotation: 0, shoulderAbduction: 12 },
  endPose: { clavicleElevation: -10, scapularUpwardRotation: 0, shoulderAbduction: 12 },
  durationMs: 2800,
  description:
    'A vállöv lefelé mozdul: a kulcscsont laterális vége és vele a lapocka süllyed. A kis mellizom a 3–5. bordáról a hollócsőrnyúlványhoz fut, ezért rövidülésével a lapockát lefelé és előre, a mellkasfal felé húzza.',
  resistance:
    'Szemléltetett ellenállás: a vállövet felfelé toló erő – például támaszhelyzetben (tolódzkodás, támasz a korláton) a testsúly a vállakat a fül felé tolja. A süllyesztők ezt ellensúlyozzák, és a vállat „lent” tartják.',
  contraction: STANDARD_CONTRACTION('a lapocka lefelé és előre mozdul', 'a lapocka mozgása (emelkedés)', 'Példa: támaszban a vállak aktív lehúzása.'),
  roles: rolesFor('scapular-depression'),
  regionNotes: [],
  claims: [
    { text: 'A kis mellizom a lapockát lefelé és előre, a mellkasfalhoz húzza.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral', 'moore-coa'] },
    { text: 'A vállöv süllyesztői más-más csontra hatnak: a kis mellizom és a csuklyásizom alsó része a lapockára, a széles hátizom a felkarcsontra, a kulcscsont alatti izom a kulcscsontra.', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology', 'openstax-ap2e'] },
    { text: 'A kulcscsont alatti izom szinergistaként, a kulcscsont süllyesztésével segítheti a mozgást; az agonista–szinergista sorrend a szemléltetett helyzetre vonatkozó oktatási modell.', evidence: 'educational-model', sourceIds: ['neumann-kinesiology'] },
    {
      text: 'Az animáció a süllyesztést a kulcscsont szegycsont-kulcscsonti ízület körüli fordulásaként mutatja; a valódi mozgásban a lapocka a mellkasfalon is csúszik.',
      evidence: 'educational-model',
      sourceIds: []
    }
  ]
};

export const pmiDownwardRotation: MotionDefinition = {
  id: 'pmi-downward-rotation',
  muscleId: M,
  movementId: 'scapular-downward-rotation',
  name: { hu: 'A lapocka lefelé rotációja', en: 'Scapular downward rotation' },
  viewId: 'anterior-girdle',
  startPose: { clavicleElevation: 14, scapularUpwardRotation: 24, shoulderAbduction: 30 },
  endPose: { clavicleElevation: 0, scapularUpwardRotation: 0, shoulderAbduction: 30 },
  durationMs: 3200,
  description:
    'A felfelé rotált, emelt helyzetű lapocka visszatér: az ízületi árok lefelé fordul, az alsó szög a gerinc felé mozdul, a kulcscsont süllyed. A vállízület szöge közben nem változik – a kar a lapockával együtt ereszkedik. A kis mellizom a hollócsőrnyúlványt lefelé-befelé húzza, ezért a lefelé rotáció egyik mozgatója.',
  resistance:
    'Szemléltetett ellenállás: a kart és a lapockát felfelé húzó erő – például húzódzkodás felhúzó szakaszában a felső végtag húzza fel a lapockát; a lefelé rotálók ezzel szemben dolgoznak.',
  contraction: STANDARD_CONTRACTION('az ízületi árok lefelé fordul', 'a lapocka rotációja (felfelé)', 'Példa: húzódzkodás vagy lehúzás felhúzó szakasza.'),
  roles: rolesFor('scapular-downward-rotation'),
  regionNotes: [],
  claims: [
    { text: 'A lapocka lefelé rotálói: a rombuszizmok, a lapockaemelő izom és a kis mellizom.', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology'] },
    { text: 'Az elülső fűrészizom és a csuklyásizom felfelé rotáló nyomatékot fejt ki, ezért a lefelé rotáció antagonistáiként jelöljük. A címke a nyomaték irányát jelöli; hogy egy ereszkedő mozgásban aktívak-e, abból nem következik.', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology'] },
    {
      text: 'Az animáció a lefelé rotációt a felfelé rotált, emelt helyzetből való visszatérésként mutatja (a kulcscsont is süllyed). A lapocka egyszerűsítve a vállcsúcs-kulcscsonti ízület körül fordul; a valódi forgástengely a mozgás során vándorol.',
      evidence: 'educational-model',
      sourceIds: ['neumann-kinesiology']
    }
  ]
};

export const pmiProtraction: MotionDefinition = {
  id: 'pmi-protraction',
  muscleId: M,
  movementId: 'scapular-protraction',
  name: { hu: 'A lapocka protrakciója (előre vezetése)', en: 'Scapular protraction' },
  viewId: 'superior-girdle',
  startPose: { scapularProtraction: -8, shoulderHorizontalAbduction: 22 },
  endPose: { scapularProtraction: 16, shoulderHorizontalAbduction: 22 },
  durationMs: 3000,
  description:
    'A lapocka a mellkasfalon előre csúszik, a kulcscsont laterális vége előre fordul, a kar előre nyúlik. A fő mozgató az elülső fűrészizom; a kis mellizom a hollócsőrnyúlványt előre-befelé húzva segíti.',
  resistance:
    'Szemléltetett ellenállás: a kart és a lapockát hátrafelé toló erő – például fekvőtámasz plusz „plusz” szakaszában a testsúly, vagy előre nyomáskor a kábel/gép ellenállása.',
  contraction: STANDARD_CONTRACTION('a lapocka előre mozdul', 'a lapocka mozgása (hátra, retrakció)', 'Példa: fekvőtámasz plusz, előre nyúlás, ütés.'),
  roles: rolesFor('scapular-protraction'),
  regionNotes: [],
  claims: [
    { text: 'A protrakció egyik fő mozgatója az elülső fűrészizom; a kis mellizom segíti.', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology', 'moore-coa'] },
    { text: 'A protrakció antagonistái a retraktorok: a rombuszizmok és a csuklyásizom középső része.', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology'] },
    {
      text: 'Az animáció a protrakciót a kulcscsont szegycsont-kulcscsonti ízület körüli előre fordulásaként mutatja; a lapocka valójában a mellkas ívét követve csúszik és el is fordul.',
      evidence: 'educational-model',
      sourceIds: []
    }
  ]
};

export const pmiAnteriorTilt: MotionDefinition = {
  id: 'pmi-anterior-tilt',
  muscleId: M,
  movementId: 'scapular-anterior-tilt',
  name: { hu: 'A lapocka előrebillentése', en: 'Scapular anterior tilt' },
  viewId: 'lateral-girdle',
  startPose: { scapularAnteriorTilt: 0, shoulderFlexion: 0 },
  endPose: { scapularAnteriorTilt: 14, shoulderFlexion: 0 },
  durationMs: 2800,
  description:
    'A lapocka felső része (a hollócsőrnyúlvánnyal) előre-lefelé dől, az alsó szög hátrafelé, a mellkasfaltól elemelkedik. A kis mellizom a hollócsőrnyúlványt közvetlenül a bordák felé húzza, ezért ennek a mozgásnak a fő mozgatója.',
  resistance:
    'Szemléltetett ellenállás: a lapockát hátra billentő erő. Fokozott feszességnél a kis mellizom nyugalomban is előrebillent helyzetben tarthatja a lapockát.',
  contraction: STANDARD_CONTRACTION('a lapocka felső része előre billen', 'a billenés (hátrafelé)', 'Példa: a vállak előre-lefelé „ejtése”.'),
  roles: rolesFor('scapular-anterior-tilt'),
  regionNotes: [],
  claims: [
    { text: 'A kis mellizom a lapocka előrebillentője.', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology'] },
    { text: 'A kis mellizom kóros feszessége kedvezőtlenül befolyásolhatja a lapocka helyzetét és a váll mozgását.', evidence: 'anatomical-fact', sourceIds: ['statpearls-pectoral'] },
    {
      text: 'Az animáció a billenést a lapocka felső részén átmenő tengely körüli fordulásként mutatja; a kulcscsont nem mozdul, ezért a vállcsúcs-kulcscsonti kapcsolat kissé elcsúszhat.',
      evidence: 'educational-model',
      sourceIds: []
    }
  ]
};

export const pmiAccessoryInspiration: MotionDefinition = {
  id: 'pmi-accessory-inspiration',
  muscleId: M,
  movementId: 'accessory-inspiration',
  name: { hu: 'Járulékos belégzés rögzített lapockával', en: 'Accessory inspiration with a fixed scapula' },
  viewId: 'anterior-respiration',
  startPose: { shoulderAbduction: 30, ribLift: 0 },
  endPose: { shoulderAbduction: 30, ribLift: -12 },
  durationMs: 3000,
  contractionTypes: ['concentric'],
  description:
    'Ha a lapocka rögzített (pl. kézzel megtámaszkodva, a lapockaizmok tartják), a kis mellizom „fordítva” működhet: a hollócsőrnyúlvány nem mozdul, az izom a 3–5. bordát emeli. Ez erőltetett belégzésnél segítheti a mellkas tágulását.',
  resistance:
    'Külső teher nincs. A nyugodt belégzést a fő belégzőizmok (rekeszizom, külső bordaközi izmok) végzik; ezek az ábrán nem szerepelnek.',
  contraction: {
    concentric: {
      summary: 'Az izom aktív és rövidül – a bordák a rögzített hollócsőrnyúlvány felé emelkednek.',
      detail: 'Az eredés (3–5. borda) mozog a tapadás (hollócsőrnyúlvány) felé; a lapocka helyzete nem változik.'
    },
    eccentric: { summary: 'Ennél a funkciónál nem szemléltetjük.', detail: '' },
    isometric: { summary: 'Ennél a funkciónál nem szemléltetjük.', detail: '' }
  },
  roles: rolesFor('accessory-inspiration'),
  regionNotes: [],
  claims: [
    { text: 'Rögzített lapocka mellett a kis mellizom a bordákat emeli, és a belégzést segíti.', evidence: 'anatomical-fact', sourceIds: ['openstax-ap2e', 'moore-coa'] },
    {
      text: 'Az ábra a bordák emelkedését egyszerű függőleges eltolással szemlélteti. A valódi bordamozgás összetettebb: a bordák forognak, és a mellkas oldalra és előre is tágul.',
      evidence: 'educational-model',
      sourceIds: []
    }
  ]
};

export const pectoralisMinorMotions: MotionDefinition[] = [pmiDepression, pmiDownwardRotation, pmiProtraction, pmiAnteriorTilt, pmiAccessoryInspiration];
