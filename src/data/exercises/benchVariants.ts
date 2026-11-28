import type { Claim, EvidenceLevel } from '../../types';

/**
 * A fekvenyomás-változatok különbségei: a pad dőlésszöge és az eszköz (rúd vagy kézisúlyzó).
 *
 * A kutatási eredmények az absztraktok alapján, minőségileg szerepelnek (EMG-százalékot nem
 * jelenítünk meg). Az EMG az elektromos aktivitást méri, nem az izomerőt vagy a hipertrófiás
 * hatást. A dőlésszöges vizsgálatok szabad rúddal készültek; kézisúlyzós nézetben is rudas
 * eredményként jelennek meg.
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
        text: 'Rudas vizsgálat (−15°, 0°, 30°, 45°; 65% 1RM, 14 edzett férfi): a teljes koncentrikus szakaszban az alsó mellizomrész EMG-je −15°-nál, 0°-nál és 30°-nál nagyobb volt, mint 45°-nál (az absztrakt −15° és 0° között nem említ különbséget). A felső rész EMG-je csak a koncentrikus szakasz 26–50%-ában volt kisebb −15°-nál, mint 30°-nál és 45°-nál. A negatív pad ezért a vízszinteshez képest nem bizonyult jobbnak.',
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
        text: 'Rudas vizsgálat öt dőlésszöggel (0°, 15°, 30°, 45°, 60°; 60% 1RM): a középső és az alsó mellizomrész átlagos EMG-je vízszintes padon volt a legnagyobb, és nagyobb dőlésnél jelentősen csökkent.',
        evidence: 'documented-observation',
        sourceIds: RODRIGUEZ
      },
      {
        text: 'Egy másik rudas vizsgálat szerzői szerint a vízszintes pad a felső és az alsó mellizomrészt is jól aktiválja.',
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
        text: 'Rudas vizsgálat (0°, 15°, 30°, 45°, 60°): a felső mellizomrész mért EMG-jének átlaga 30°-nál volt a legnagyobb az öt szög közül. A 15°-os és 30°-os növekedés a vízszinteshez képest nem volt statisztikailag jelentős, és 0° és 45° között sem találtak különbséget – ez egy minta eredménye, nem igazolt „optimális” szög.',
        evidence: 'documented-observation',
        sourceIds: RODRIGUEZ
      },
      {
        text: 'Rudas vizsgálat (−15°, 0°, 30°, 45°): a felső rész EMG-je a teljes koncentrikus szakaszt nézve nem különbözött a padok között; csak a koncentrikus szakasz 26–50%-ában volt nagyobb 30°-nál és 45°-nál, mint vízszintes és negatív padon.',
        evidence: 'documented-observation',
        sourceIds: LAUVER
      }
    ]
  },
  {
    id: 'steep-incline',
    name: 'Meredek ferde pad (45–60°)',
    range: [45, 60],
    example: 60,
    kinematics: 'A mozgás egyre inkább a vállból történő felfelé nyomáshoz hasonlít: a vállízület hajlítása dominál, a horizontális közelítés szerepe csökken.',
    findings: [
      {
        text: 'Rudas vizsgálat: a vizsgált 45°-os és 60°-os beállításnál a deltaizom elülső részének EMG-je statisztikailag jelentősen nagyobb volt, mint a többi mért izomé ugyanabban a beállításban (ez izmok közötti összehasonlítás, nem a szögek közötti); a legnagyobb értéket 60°-nál mérték. A középső és alsó mellizomrész EMG-je nagyobb dőlésnél kisebb volt.',
        evidence: 'documented-observation',
        sourceIds: RODRIGUEZ
      },
      {
        text: 'Rudas vizsgálat (−15°, 0°, 30°, 45°): a teljes koncentrikus szakaszban 45°-nál az alsó mellizomrész EMG-je kisebb volt, mint −15°-nál, 0°-nál és 30°-nál.',
        evidence: 'documented-observation',
        sourceIds: LAUVER
      }
    ]
  }
];

export const angleZoneFor = (angle: number): AngleZone => angleZones.find((z) => angle >= z.range[0] && angle <= z.range[1]) ?? angleZones[1]!;

/** A háromfejű karizom mért (mediális) fejének aktivitása nem függött a dőlésszögtől (0–60°). */
export const angleCommonFinding: Claim = {
  text: 'Rudas vizsgálat: a háromfejű karizom mediális fejének (csak ezt mérték) EMG-je minden vizsgált dőlésszögnél (0–60°) hasonló volt.',
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
      dumbbell: 'Egy vizsgálatban (12 edzett férfi; Smith-gép, rúd és kézisúlyzó) a két súlyzó együttes 1-RM-je kb. 17%-kal kisebb volt, mint a rúdé, és kb. 14%-kal kisebb, mint a Smith-gépé. Ez a külső terhelés különbsége, nem az izomerőé vagy az izomaktivitásé.'
    },
    evidence: 'documented-observation',
    sourceIds: SAETERBAKKEN
  },
  {
    aspect: 'Nagy mellizom, deltaizom elülső része (EMG)',
    values: {
      barbell: 'Ugyanabban a vizsgálatban nem különbözött a három eszköz (Smith-gép, rúd, kézisúlyzó) között.',
      dumbbell: 'Ugyanabban a vizsgálatban nem különbözött a három eszköz között.'
    },
    evidence: 'documented-observation',
    sourceIds: SAETERBAKKEN
  },
  {
    aspect: 'Háromfejű karizom (EMG)',
    values: {
      barbell: 'Nagyobb volt, mint kézisúlyzóval (a Smith-géphez hasonlóan).',
      dumbbell: 'Kisebb volt, mint rúddal és Smith-gépen.'
    },
    evidence: 'documented-observation',
    sourceIds: SAETERBAKKEN
  },
  {
    aspect: 'Kétfejű karizom (EMG)',
    values: {
      barbell: 'Kisebb volt, mint kézisúlyzóval (de nagyobb, mint Smith-gépen).',
      dumbbell: 'Nagyobb volt; a szerzők a nagyobb stabilitási igénnyel hozták összefüggésbe. A nagyobb EMG önmagában nem mutatja meg, melyik ízületen milyen működést végez az izom.'
    },
    evidence: 'documented-observation',
    sourceIds: SAETERBAKKEN
  }
];
