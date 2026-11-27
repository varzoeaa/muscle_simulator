import type { Claim } from '../../types';
import type { PushUpOptions } from '../../engines/animation/sagittalKinematics';

/**
 * Fekvőtámasz-változatok: a test dőlése (kéz- és lábalátámasztás), térdelő változat,
 * kéztávolság, fekvőtámasz plusz. A kutatási eredmények az absztraktok alapján, minőségileg
 * szerepelnek (erő- és EMG-értéket nem jelenítünk meg).
 */
const EBBEN = ['ebben-2011'];
const SUPRAK = ['suprak-2011'];
const COGLEY = ['cogley-2005'];
const LUDEWIG = ['ludewig-2004'];
const KIN = ['neumann-kinesiology'];

export interface PushUpPreset {
  id: string;
  name: string;
  options: PushUpOptions;
}

/** Az Ebben és mtsai (2011) által vizsgált hat változat (a vizsgálatban 30,48 és 60,96 cm-es doboz; a modellben 30 és 60 cm). */
export const pushUpPresets: PushUpPreset[] = [
  { id: 'hands-60', name: 'Kéz 60 cm-en', options: { handCm: 60, feetCm: 0, knees: false } },
  { id: 'hands-30', name: 'Kéz 30 cm-en', options: { handCm: 30, feetCm: 0, knees: false } },
  { id: 'knees', name: 'Térdelő', options: { handCm: 0, feetCm: 0, knees: true } },
  { id: 'regular', name: 'Alap (talajon)', options: { handCm: 0, feetCm: 0, knees: false } },
  { id: 'feet-30', name: 'Láb 30 cm-en', options: { handCm: 0, feetCm: 30, knees: false } },
  { id: 'feet-60', name: 'Láb 60 cm-en', options: { handCm: 0, feetCm: 60, knees: false } }
];

export type LoadLevel = 'lower' | 'reference' | 'higher';

/**
 * A kézre jutó terhelés iránya az alapváltozathoz képest. A vizsgált hat változatnál (Ebben 2011)
 * a lábemelés nagyobb, a kézemelés és a térdelő változat kisebb talajreakció-erőt adott. A köztes
 * beállításokra ugyanezt az irányt feltételezzük (modell).
 */
export function loadLevel(o: PushUpOptions): LoadLevel {
  if (o.knees) return 'lower';
  if (o.handCm > o.feetCm) return 'lower';
  if (o.feetCm > o.handCm) return 'higher';
  return 'reference';
}

export const loadLevelText: Record<LoadLevel, string> = {
  lower: 'kisebb, mint az alapváltozatnál',
  reference: 'az alapváltozatnak megfelelő',
  higher: 'nagyobb, mint az alapváltozatnál'
};

export const supportFindings: Claim[] = [
  {
    text: 'Hat változatot összehasonlítva a lábemelés (30 és 61 cm) nagyobb, a kézemelés (30 és 61 cm) és a térdelő fekvőtámasz kisebb csúcs-talajreakcióerőt adott a kézen, mint a többi változat. Nemek között nem volt különbség.',
    evidence: 'documented-observation',
    sourceIds: EBBEN
  },
  {
    text: 'Hagyományos és térdelő fekvőtámasznál is az alsó helyzetben jutott több testtömeg a kézre, mint a felsőben; a felső és az alsó helyzet közti különbség a térdelő változatnál volt nagyobb. A szerzők ezt a kéz és a talajjal érintkező pont (láb vagy térd) eltérő erőkarjával magyarázták.',
    evidence: 'documented-observation',
    sourceIds: SUPRAK
  }
];

/**
 * A test dőlésének hatása a vállízület mozgására (oktatási modell). Az alkar a talajra merőleges,
 * ezért ha a test feje feljebb kerül (kézemelés), a kar a törzshöz képest a láb felé nyom – mint a
 * negatív padon végzett fekvenyomásnál; lábemelésnél a fej felé – mint a ferde padon.
 */
export function tiltExplanation(o: PushUpOptions): Claim[] {
  const lower = o.knees || o.handCm > o.feetCm;
  const higher = !o.knees && o.feetCm > o.handCm;
  if (higher)
    return [
      {
        text: 'Lábemelésnél a test feje lejjebb kerül, a kar a törzshöz képest inkább a fej felé nyom – a ferde padon végzett fekvenyomáshoz hasonlóan. A vállízület hajlítóinak (kulcscsonti rész, deltaizom elülső része) szerepe ezért nagyobb lehet.',
        evidence: 'educational-model',
        sourceIds: KIN
      }
    ];
  if (lower && !o.knees)
    return [
      {
        text: 'Kézemelésnél a test feje feljebb kerül, a kar a törzshöz képest inkább a láb felé nyom – a negatív padon végzett fekvenyomáshoz hasonlóan. A szegycsonti-bordai rész szerepe ezért nagyobb lehet, a kézre jutó terhelés kisebb.',
        evidence: 'educational-model',
        sourceIds: KIN
      }
    ];
  if (o.knees)
    return [
      {
        text: 'Térdelő változatnál a test rövidebb: a térd és a kéz közötti szakasz meredekebb, a kézre jutó terhelés kisebb. A vállízület mozgása az alapváltozatéhoz hasonló.',
        evidence: 'educational-model',
        sourceIds: KIN
      }
    ];
  return [
    {
      text: 'Alapváltozatnál a vállízületben horizontális közelítés és hajlítás, a könyökben feszítés történik – a vízszintes padon végzett fekvenyomás zárt láncú megfelelője.',
      evidence: 'anatomical-fact',
      sourceIds: KIN
    }
  ];
}

export type HandWidth = 'narrow' | 'shoulder' | 'wide';

export const handWidths: { id: HandWidth; name: string; description: string; findings: Claim[] }[] = [
  {
    id: 'narrow',
    name: 'Keskeny',
    description: 'A kezek a váll szélességénél közelebb; a könyök a törzs mellett hajlik, a könyökhajlítás mértéke nagyobb.',
    findings: [
      {
        text: 'Keskeny kéztartásnál a nagy mellizom és a háromfejű karizom EMG-aktivitása is nagyobb volt, mint széles kéztartásnál (40 fő).',
        evidence: 'documented-observation',
        sourceIds: COGLEY
      }
    ]
  },
  {
    id: 'shoulder',
    name: 'Vállszéles',
    description: 'A kezek a váll alatt vagy kissé szélesebben; a könyök kb. 45°-ban távolodik a törzstől. Ez az alapváltozat.',
    findings: [
      {
        text: 'A vizsgálat a keskeny és a széles kéztartás között talált különbséget; a vállszéles tartás az összehasonlítás kiindulópontja volt.',
        evidence: 'documented-observation',
        sourceIds: COGLEY
      }
    ]
  },
  {
    id: 'wide',
    name: 'Széles',
    description: 'A kezek a vállnál jóval szélesebben; a könyök oldalra nyílik, a felkar a törzstől távolabb mozog, a könyökhajlítás mértéke kisebb.',
    findings: [
      {
        text: 'Széles kéztartásnál a nagy mellizom és a háromfejű karizom EMG-aktivitása kisebb volt, mint keskeny kéztartásnál.',
        evidence: 'documented-observation',
        sourceIds: COGLEY
      },
      {
        text: 'Oldalra nyitott könyöknél a vállízület mozgása a horizontális közelítés felé tolódik; a széles tartás így a nagy mellizom fő működéséhez közelebb álló irányt ad, de ez önmagában nem jelent nagyobb aktivitást.',
        evidence: 'educational-model',
        sourceIds: KIN
      }
    ]
  }
];

export const pushUpPlusFindings: Claim[] = [
  {
    text: 'Fekvőtámasz plusz: a felső helyzetben a kezek tovább nyomják a talajt, a lapocka előre csúszik a mellkasfalon (protrakció). Ezt az elülső fűrészizom végzi.',
    evidence: 'anatomical-fact',
    sourceIds: KIN
  },
  {
    text: 'A hagyományos fekvőtámasz plusz a „plusz” szakaszban az elülső fűrészizom legnagyobb aktivitását és a csuklyásizom felső része / elülső fűrészizom legkisebb arányát adta a vizsgált változatok (könyökön, térden, falnál) közül; egészséges és enyhe vállpanaszos csoportban is.',
    evidence: 'documented-observation',
    sourceIds: LUDEWIG
  }
];
