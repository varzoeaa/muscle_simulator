import type { Exercise } from '../../types';

export const benchPress: Exercise = {
  id: 'barbell-bench-press',
  name: { hu: 'Fekvenyomás rúddal (vízszintes, ferde, negatív pad)', en: 'Barbell bench press (flat / incline / decline)' },
  muscleIds: ['muscle-pectoralis-major'],
  status: 'available',
  animationId: 'barbell-bench-press',
  startPosition: [
    'Hanyattfekvés a padon: a fej, a felső hát és a medence a padon, a talp stabilan a talajon.',
    'A lapockák hátra- és enyhén lehúzva (retrakció, depresszió), ezzel stabil alap képződik a padon.',
    'A rudat vállszélességnél szélesebb fogással, kinyújtott könyökkel a vállízület fölött tartjuk.'
  ],
  execution: [
    'Leengedés: a rúd kontrolláltan, közel függőleges pályán ereszkedik a mellkas alsó részéig.',
    'Az alkar a mozgás során megközelítőleg függőleges marad, a könyök a törzshöz képest kb. 45–75°-os szögben helyezkedik el.',
    'Felnyomás: a rúd visszatér a vállízület fölé, a lapockák helyzete változatlan marad.',
    'A légzést és a törzs feszességét a terheléshez igazítjuk; a medence a padon marad.'
  ],
  primaryMovers: ['muscle-pectoralis-major', 'muscle-deltoid-anterior', 'muscle-triceps-brachii'],
  secondaryMovers: ['muscle-coracobrachialis', 'muscle-biceps-brachii'],
  stabilizers: ['muscle-rotator-cuff', 'muscle-serratus-anterior', 'muscle-rhomboids', 'muscle-trapezius'],
  commonMistakes: [
    'A rúd „lepattintása” a mellkasról – az excentrikus szakasz kontrollja elvész.',
    'A medence felemelése a padról.',
    'A lapockák elvesztik a hátra-lehúzott helyzetet, a vállak előrebillennek.',
    'A könyök teljesen oldalra (90°-ra) nyitása a törzshöz képest.',
    'A csukló túlzott hátrahajlítása – az alkar nem függőleges.',
    'Egyenetlen, ferde rúdpálya vagy aszimmetrikus nyomás.'
  ],
  phases: [
    { type: 'eccentric', name: 'Excentrikus szakasz – leengedés', from: 0, to: 0.45, description: 'A nagy mellizom, a deltaizom elülső része és a háromfejű karizom aktívan fékezi a rúd ereszkedését, miközben hosszuk nő.' },
    { type: 'isometric', name: 'Izometriás szakasz – rövid megtartás alul', from: 0.45, to: 0.55, description: 'Rövid megállás esetén (pl. „paused bench”) az izmok aktívak, a rúd és az ízületi szögek közel változatlanok.' },
    { type: 'concentric', name: 'Koncentrikus szakasz – felnyomás', from: 0.55, to: 1, description: 'A nagy mellizom horizontális közelítést és hajlítást végez a vállízületben, a háromfejű karizom feszíti a könyököt.' }
  ],
  anatomyExplanation: [
    {
      text: 'A vállízületben horizontális közelítés és hajlítás történik, a könyökben feszítés. A nagy mellizom és a deltaizom elülső része a vállmozgást, a háromfejű karizom a könyökfeszítést végzi.',
      evidence: 'anatomical-fact',
      sourceIds: ['neumann-kinesiology', 'nsca-essentials']
    },
    {
      text: 'A pad dőlésszöge megváltoztatja a kar és a törzs viszonyát: ferde padon a mozgás a vállízületi hajlítás felé tolódik, ezért a kulcscsonti rész és a deltaizom elülső része nagyobb szerepet kaphat.',
      evidence: 'documented-observation',
      sourceIds: ['rodriguez-ridao-2020', 'lauver-2016']
    },
    {
      text: 'Egy EMG-vizsgálatban a felső mellizomrész aktivitása 30°-nál, a középső és alsó részé vízszintes padon volt a legnagyobb; 45° feletti dőlésnél a deltaizom elülső részének aktivitása nőtt jelentősen. (Az EMG-értékek nem egyenlők az izomerővel vagy a hipertrófiás hatással.)',
      evidence: 'documented-observation',
      sourceIds: ['rodriguez-ridao-2020']
    }
  ],
  coachingNotes: [
    { text: 'Kérd a lapockák „zsebbe tételét” a kiinduló helyzetben, és tartsd meg ezt a helyzetet a teljes ismétlés alatt.', evidence: 'educational-model', sourceIds: ['nsca-essentials'] },
    { text: 'Az alkar függőleges helyzete jó vizuális visszajelzés a fogásszélesség és a rúdpálya ellenőrzésére.', evidence: 'educational-model', sourceIds: ['nsca-essentials'] },
    { text: 'Az excentrikus szakasz legyen kontrollált; a mozgástartományt az egyéni vállmobilitáshoz és a célhoz igazítsd.', evidence: 'educational-model', sourceIds: ['nsca-essentials'] }
  ],
  parameters: {
    rangeOfMotion: { min: 0.25, max: 1, default: 1 },
    benchAngle: { min: -15, max: 60, default: 0, step: 5 },
    load: { min: 20, max: 180, default: 60, step: 2.5, implementKg: 20, implementName: 'olimpiai rúd' }
  },
  cycleDurationMs: 4000,
  sourceIds: ['nsca-essentials', 'neumann-kinesiology', 'rodriguez-ridao-2020', 'lauver-2016']
};

export const exercises: Exercise[] = [benchPress];
export const exerciseById = (id: string | undefined) => exercises.find((e) => e.id === id);
