import type { Claim, EvidenceLevel } from '../../types';

/**
 * A fekvenyomás-változatok különbségei: a pad dőlésszöge és az eszköz (rúd vagy kézisúlyzó).
 *
 * A kutatási eredmények az absztraktok alapján, minőségileg szerepelnek (EMG-százalékot nem
 * jelenítünk meg). Az EMG az elektromos aktivitást méri, nem az izomerőt vagy a hipertrófiás
 * hatást. A dőlésszöges vizsgálatok rúddal készültek.
 */

export interface AngleZone {
  id: 'decline' | 'flat' | 'incline' | 'steep-incline';
  name: string;
  /** A zóna határai fokban (zárt intervallum). */
  range: [number, number];
  /** Példa-dőlésszög, amelyre a zóna gombja a csúszkát állítja. */
  example: number;
  /** Mi változik a modellben (geometria): a mellkasi érintési pont, a vállízület mozgása. */
  kinematics: string;
  findings: Claim[];
}

const LAUVER = ['lauver-2016'];
const RODRIGUEZ = ['rodriguez-ridao-2020'];

export const angleZones: AngleZone[] = [
  {
    id: 'decline',
    name: 'Negatív pad (decline)',
    range: [-15, -1],
    example: -15,
    kinematics:
      'A fej lejjebb van, mint a csípő. A terhelés a mellkas alsó részéhez érkezik; a felkar a törzshöz képest inkább a test mellett, lefelé mozog, ezért a vállízület mozgásában a közelítés (adductio) iránya erősebb.',
    findings: [
      {
        text: 'Egy vizsgálatban (−15°, 0°, 30°, 45°) a nagy mellizom alsó részének aktivitása −15°-nál hasonló volt, mint vízszintes padon, és nagyobb, mint 45°-nál. A felső rész aktivitása a mozgás egy szakaszában kisebb volt, mint 30°-nál és 45°-nál.',
        evidence: 'documented-observation',
        sourceIds: LAUVER
      }
    ]
  },
  {
    id: 'flat',
    name: 'Vízszintes pad (flat)',
    range: [0, 0],
    example: 0,
    kinematics: 'A terhelés a szegycsont alsó részének magasságában érkezik a mellkashoz. A vállízületben horizontális közelítés és hajlítás együtt történik.',
    findings: [
      {
        text: 'Öt dőlésszög (0–60°) összehasonlításában a középső és az alsó mellizomrész aktivitása vízszintes padon volt a legnagyobb.',
        evidence: 'documented-observation',
        sourceIds: RODRIGUEZ
      },
      {
        text: 'A szerzők szerint a vízszintes pad a felső és az alsó mellizomrészt is jól aktiválja.',
        evidence: 'documented-observation',
        sourceIds: LAUVER
      }
    ]
  },
  {
    id: 'incline',
    name: 'Ferde pad (incline, kb. 15–40°)',
    range: [1, 44],
    example: 30,
    kinematics:
      'A terhelés feljebb, a mellkas felső részéhez érkezik. A vállízület mozgása a hajlítás (flexio) felé tolódik, ezért a kulcscsonti rész – amely a vállízület hajlítója – nagyobb szerepet kaphat.',
    findings: [
      {
        text: 'A nagy mellizom felső részének aktivitása 30°-nál volt a legnagyobb az öt vizsgált dőlésszög közül.',
        evidence: 'documented-observation',
        sourceIds: RODRIGUEZ
      },
      {
        text: 'A felső rész aktivitása a teljes koncentrikus szakaszt nézve nem különbözött a padok között, de a mozgás egy szakaszában 30°-nál és 45°-nál nagyobb volt, mint vízszintes és negatív padon.',
        evidence: 'documented-observation',
        sourceIds: LAUVER
      }
    ]
  },
  {
    id: 'steep-incline',
    name: 'Meredek ferde pad (45° felett)',
    range: [45, 60],
    example: 60,
    kinematics: 'A mozgás egyre inkább a vállból történő felfelé nyomáshoz hasonlít: a vállízület hajlítása dominál, a horizontális közelítés szerepe csökken.',
    findings: [
      {
        text: '45° feletti dőlésnél a deltaizom elülső részének aktivitása jelentősen nőtt, a nagy mellizomé csökkent; a deltaizom elülső része 60°-nál volt a legaktívabb.',
        evidence: 'documented-observation',
        sourceIds: RODRIGUEZ
      },
      {
        text: '45°-nál az alsó mellizomrész aktivitása kisebb volt, mint −15°-nál, 0°-nál és 30°-nál.',
        evidence: 'documented-observation',
        sourceIds: LAUVER
      }
    ]
  }
];

export const angleZoneFor = (angle: number): AngleZone => angleZones.find((z) => angle >= z.range[0] && angle <= z.range[1]) ?? angleZones[1]!;

/** A háromfejű karizom aktivitása nem függött a dőlésszögtől (0–60°). */
export const angleCommonFinding: Claim = {
  text: 'A háromfejű karizom aktivitása minden vizsgált dőlésszögnél hasonló volt (0–60°).',
  evidence: 'documented-observation',
  sourceIds: RODRIGUEZ
};

/** Összehasonlító táblázat egy sora: szempont, változatonkénti leírás, bizonyítéki szint, forrás. */
export interface ComparisonRow {
  aspect: string;
  values: Record<string, string>;
  evidence: EvidenceLevel;
  sourceIds: string[];
}

const SAETERBAKKEN = ['saeterbakken-2011'];

/** Rúd és kézisúlyzó különbségei fekvenyomásban. */
export const implementRows: ComparisonRow[] = [
  {
    aspect: 'Stabilitás',
    values: {
      barbell: 'A rúd összeköti a két kezet: a kezek távolsága és pályája rögzített, a rúd egy egységként mozog.',
      dumbbell: 'A két kar egymástól függetlenül mozog; mindkét oldalon külön kell stabilizálni a súlyt.'
    },
    evidence: 'educational-model',
    sourceIds: ['nsca-essentials', ...SAETERBAKKEN]
  },
  {
    aspect: 'Mozgáspálya és -tartomány',
    values: {
      barbell: 'A mozgás alul a mellkasnál véget ér; a pálya közel függőleges.',
      dumbbell: 'A súlyzók a mellkas mellé ereszkedhetnek, és felül közelebb kerülhetnek egymáshoz; a mozgástartományt a vállmobilitás korlátozza.'
    },
    evidence: 'educational-model',
    sourceIds: ['nsca-essentials']
  },
  {
    aspect: 'Fogás',
    values: {
      barbell: 'Rögzített, pronált fogás (tenyér a láb felé).',
      dumbbell: 'A fogás pronált vagy semleges (tenyerek egymás felé) is lehet.'
    },
    evidence: 'educational-model',
    sourceIds: ['nsca-essentials']
  },
  {
    aspect: 'Maximális terhelés (1-RM)',
    values: {
      barbell: 'Nagyobb.',
      dumbbell: 'A két súlyzó együttes terhelése kb. 17%-kal kisebb volt, mint a rúdé (12 edzett férfi).'
    },
    evidence: 'documented-observation',
    sourceIds: SAETERBAKKEN
  },
  {
    aspect: 'Nagy mellizom, deltaizom elülső része (EMG)',
    values: {
      barbell: 'Nem különbözött a két eszköz között.',
      dumbbell: 'Nem különbözött a két eszköz között.'
    },
    evidence: 'documented-observation',
    sourceIds: SAETERBAKKEN
  },
  {
    aspect: 'Háromfejű karizom (EMG)',
    values: {
      barbell: 'Nagyobb.',
      dumbbell: 'Kisebb volt, mint rúddal.'
    },
    evidence: 'documented-observation',
    sourceIds: SAETERBAKKEN
  },
  {
    aspect: 'Kétfejű karizom (EMG)',
    values: {
      barbell: 'Kisebb.',
      dumbbell: 'Nagyobb volt; a szerzők a nagyobb stabilitási igénnyel hozták összefüggésbe.'
    },
    evidence: 'documented-observation',
    sourceIds: SAETERBAKKEN
  }
];
