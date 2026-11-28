import type { MotionDefinition } from '../../types';
import { serratusAnterior } from '../muscles/serratusAnterior';

/**
 * Az elülső fűrészizom funkcióinak animációi: protrakció (mozgó vállövű felülnézet), felfelé
 * rotáció (mozgó lapockás hátulnézet – elölről a vetület miatt az izom hosszváltozása félrevezető
 * lenne), hátrabillentés (billenő lapockás oldalnézet) és járulékos belégzés rögzített vállövvel
 * (emelkedő mellkasú elölnézet).
 */
const M = 'muscle-serratus-anterior';
const SP = 'statpearls-serratus';
const SUP = 'muscle-serratus-anterior-superior';
const INT = 'muscle-serratus-anterior-intermediate';
const INF = 'muscle-serratus-anterior-inferior';

const rolesFor = (movementId: MotionDefinition['movementId']) => serratusAnterior.roles.filter((r) => r.movementId === movementId);

const contraction = (shortText: string, reverse: string, example: string): MotionDefinition['contraction'] => ({
  concentric: {
    summary: `Az aktív izom rövidül – ${shortText}.`,
    detail: `Az elülső fűrészizom húzóereje meghaladja a külső ellenállást, ezért a lapocka belső széle (tapadás) a bordák (eredés) felé közeledik: a lapocka a mellkasfalon előre-oldalra csúszik. ${example}`
  },
  eccentric: {
    summary: 'Az aktív izom terhelés alatt hosszabbodik – a lapocka fékezetten tér vissza.',
    detail: `A külső ellenállás nagyobb, mint az izom ereje, ezért ${reverse} történik, de az izom aktív marad és fékez. Az eredés és a tapadás távolodik.`
  },
  isometric: {
    summary: 'Az izom aktív, a lapocka helyzete közel változatlan.',
    detail: 'Az izom a lapockát a mellkasfalhoz szorítva a helyén tartja – ez a stabilizáló működés leggyakoribb formája (pl. támaszhelyzetben).'
  }
});

export const saProtraction: MotionDefinition = {
  id: 'sa-protraction',
  muscleId: M,
  movementId: 'scapular-protraction',
  name: { hu: 'A lapocka protrakciója (előre vezetése)', en: 'Scapular protraction' },
  viewId: 'superior-girdle',
  startPose: { scapularProtraction: -8, shoulderHorizontalAbduction: 22 },
  endPose: { scapularProtraction: 16, shoulderHorizontalAbduction: 22 },
  durationMs: 3000,
  description:
    'A lapocka a mellkas ívét követve előre-oldalra csúszik, a kulcscsont laterális vége előre fordul, a kar előre nyúlik. Az elülső fűrészizom a bordákról hátrafelé, a lapocka belső széléhez fut, ezért rövidülésével a lapockát a mellkas körül előre húzza – ez a protrakció fő mozgatója.',
  resistance:
    'Szemléltetett ellenállás: a kart és a lapockát hátrafelé toló erő – például ütéskor a célpont, fekvőtámasz plusz „plusz” szakaszában a testsúly, előre nyomáskor a kábel vagy a gép ellenállása.',
  contraction: contraction('a lapocka előre mozdul', 'a lapocka hátrafelé mozgása (retrakció)', 'Példa: ütés, előre nyúlás, fekvőtámasz plusz.'),
  roles: rolesFor('scapular-protraction'),
  regionNotes: [{ regionId: INT, text: 'Leírás szerint a középső rész húzza előre a lapockát; a felső rész a mozgás tengelyét adja.' }],
  claims: [
    { text: 'Az elülső fűrészizom a lapockát előre húzza a mellkas körül; „bokszolóizomnak” is nevezik, mert az ütés mozdulatában ez a mozgás zajlik.', evidence: 'anatomical-fact', sourceIds: [SP, 'statpearls-pectoral'] },
    { text: 'A protrakció antagonistái a retraktorok: a rombuszizmok és a csuklyásizom középső része; a kis mellizom szinergista.', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology', 'moore-coa'] },
    {
      text: 'Az animáció a protrakciót a kulcscsont szegycsont-kulcscsonti ízület körüli előre fordulásaként mutatja; a lapocka valójában a mellkas ívét követve csúszik és el is fordul.',
      evidence: 'educational-model',
      sourceIds: []
    }
  ]
};

export const saUpwardRotation: MotionDefinition = {
  id: 'sa-upward-rotation',
  muscleId: M,
  movementId: 'scapular-upward-rotation',
  name: { hu: 'A lapocka felfelé rotációja', en: 'Scapular upward rotation' },
  viewId: 'posterior-girdle',
  viewBox: [250, 40, 330, 380],
  startPose: { scapularUpwardRotation: 0, shoulderAbduction: 12 },
  endPose: { scapularUpwardRotation: 10, shoulderAbduction: 12 },
  durationMs: 3000,
  description:
    'Hátulról nézve: a lapocka alsó szöge oldalra és előre, a mellkas oldalfala felé mozdul, az ízületi árok felfelé fordul. Az elülső fűrészizom (főként az alsó része, amely az alsó szöghöz tapad) az alsó szöget a bordák felé húzza, a csuklyásizom felső és alsó részével erőpárban. A vállízület szöge közben nem változik – a kar a lapockával együtt mozdul.',
  resistance:
    'Szemléltetett ellenállás: a felső végtag súlya és a kézben tartott teher, amely a lapockát lefelé rotálná. Fej fölé emeléskor a felfelé rotálók ezt ellensúlyozzák.',
  contraction: contraction('az alsó szög oldalra-előre mozdul', 'a lapocka lefelé rotációja', 'Példa: a kar fej fölé emelése, fej fölé nyomás.'),
  roles: rolesFor('scapular-upward-rotation'),
  regionNotes: [
    { regionId: INF, text: 'Az alsó rész az alsó szöghöz tapad: ez rotálja felfelé a lapockát, ami a kar emelését teszi lehetővé.' },
    { regionId: SUP, text: 'A felső rész a lapocka felső szögénél a mozgás forgástengelyét adja.' }
  ],
  claims: [
    { text: 'Az elülső fűrészizom alsó része a lapocka előre-oldalra irányuló mozgását végzi, ami a kar emelését teszi lehetővé.', evidence: 'anatomical-fact', sourceIds: [SP] },
    { text: 'Az elülső fűrészizom a csuklyásizom felső és alsó részével együtt tartja fenn a lapocka felfelé rotációját fej fölé emeléskor.', evidence: 'anatomical-fact', sourceIds: [SP, 'neumann-kinesiology'] },
    { text: 'A lefelé rotálók (rombuszizmok, lapockaemelő izom, kis mellizom) a mozgás antagonistái.', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology'] },
    {
      text: 'Az animáció a lapockát egyszerűsítve a vállcsúcs-kulcscsonti ízület körül fordítja, a kulcscsont emelkedése nélkül; a valódi forgástengely a mozgás során vándorol. A szög (10°) szemléltető; a teljes karemelés során a lapocka ennél jóval többet fordul.',
      evidence: 'educational-model',
      sourceIds: ['neumann-kinesiology']
    },
    {
      text: 'Hátulnézetben a lapocka takarja az izmot, ezért mély rétegként, a lapocka „mögött” látszik; a bordai eredés a mellkas oldalsó kontúrján van jelölve.',
      evidence: 'educational-model',
      sourceIds: []
    }
  ]
};

export const saPosteriorTilt: MotionDefinition = {
  id: 'sa-posterior-tilt',
  muscleId: M,
  movementId: 'scapular-posterior-tilt',
  name: { hu: 'A lapocka hátrabillentése', en: 'Scapular posterior tilt' },
  viewId: 'lateral-girdle',
  viewBox: [170, 60, 290, 340],
  startPose: { scapularAnteriorTilt: 0, shoulderFlexion: 0 },
  endPose: { scapularAnteriorTilt: -10, shoulderFlexion: 0 },
  durationMs: 2800,
  description:
    'Oldalról nézve: a lapocka felső része hátrafelé, az alsó szöge előre, a mellkasfal felé billen. Az elülső fűrészizom az alsó szöget a bordákhoz húzza és a mellkasfalon tartja; a karemelés közben a lapocka így hátrafelé billen.',
  resistance:
    'Szemléltetett ellenállás: a lapockát előre billentő erő – például a kis mellizom feszessége vagy a kar súlya. A hátrabillentés a karemelés természetes része.',
  contraction: contraction('az alsó szög a mellkasfal felé mozdul', 'az előrebillenés', 'Példa: a kar emelése közben a lapocka hátrabillenése.'),
  roles: rolesFor('scapular-posterior-tilt'),
  regionNotes: [{ regionId: INF, text: 'Az alsó rész az alsó szöghöz tapad, ezért a billenésben ennek a húzása a legnagyobb.' }],
  claims: [
    { text: 'A karemelés közben a lapocka hátrafelé billen; ebben az elülső fűrészizom és a csuklyásizom alsó része vesz részt.', evidence: 'educational-model', sourceIds: ['neumann-kinesiology'] },
    { text: 'Az elülső fűrészizom a lapockát a mellkasfalon tartja; kiesésekor a lapocka belső széle és alsó szöge elemelkedik (szárnyas lapocka).', evidence: 'anatomical-fact', sourceIds: [SP] },
    {
      text: 'Az animáció a billenést a lapocka felső részén átmenő tengely körüli fordulásként mutatja; a kulcscsont nem mozdul.',
      evidence: 'educational-model',
      sourceIds: []
    }
  ]
};

export const saAccessoryInspiration: MotionDefinition = {
  id: 'sa-accessory-inspiration',
  muscleId: M,
  movementId: 'accessory-inspiration',
  name: { hu: 'A bordák emelése rögzített vállövvel', en: 'Rib elevation with a fixed shoulder girdle' },
  viewId: 'anterior-respiration',
  viewBox: [100, 70, 300, 320],
  startPose: { shoulderAbduction: 30, ribLift: 0 },
  endPose: { shoulderAbduction: 30, ribLift: -10 },
  durationMs: 3000,
  contractionTypes: ['concentric'],
  description:
    'Ha a vállöv rögzített (pl. kézzel megtámaszkodva, a lapockát a rombuszizmok és a csuklyásizom tartják), az elülső fűrészizom „fordítva” működhet: a lapocka nem mozdul, az izom mindhárom része a bordákat emeli. Ez erőltetett belégzésnél segítheti a mellkas tágulását.',
  resistance:
    'Külső teher nincs. A nyugodt belégzést a fő belégzőizmok (rekeszizom, külső bordaközi izmok) végzik; ezek az ábrán nem szerepelnek.',
  contraction: {
    concentric: {
      summary: 'Az izom aktív és rövidül – a bordák a rögzített lapocka felé emelkednek.',
      detail: 'Az eredés (bordák) mozog a tapadás (lapocka) felé; a lapocka helyzete nem változik.'
    },
    eccentric: { summary: 'Ennél a funkciónál nem szemléltetjük.', detail: '' },
    isometric: { summary: 'Ennél a funkciónál nem szemléltetjük.', detail: '' }
  },
  roles: rolesFor('accessory-inspiration'),
  regionNotes: [],
  claims: [
    { text: 'Rögzített vállöv mellett az elülső fűrészizom mindhárom része a bordákat emeli, és a légzést segíti.', evidence: 'anatomical-fact', sourceIds: [SP, 'openstax-ap2e'] },
    {
      text: 'Az ábra a bordák emelkedését egyszerű függőleges eltolással szemlélteti (az egész mellkas emelkedik). A valódi bordamozgás összetettebb: a bordák forognak, és a mellkas oldalra és előre is tágul.',
      evidence: 'educational-model',
      sourceIds: []
    }
  ]
};

export const serratusAnteriorMotions: MotionDefinition[] = [saProtraction, saUpwardRotation, saPosteriorTilt, saAccessoryInspiration];
