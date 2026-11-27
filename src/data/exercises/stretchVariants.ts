import type { Claim } from '../../types';
import type { ComparisonRow } from './benchVariants';

/**
 * Mellizomnyújtás: karhelyzet szerinti regionális különbségek (Umehara és mtsai 2021, nyírási
 * modulus ultrahangos elasztográfiával), adagolás (ACSM, Garber 2011) és a nyújtás akut hatásai
 * (Behm 2016). Az eredmények az absztraktok alapján, minőségileg szerepelnek.
 */
const UMEHARA = ['umehara-2021'];
const GARBER = ['garber-2011'];
const BEHM = ['behm-2016'];
const KIN = ['neumann-kinesiology'];

export type StretchAbduction = 45 | 90 | 135;

export interface StretchPosition {
  /** A vállízület távolítása (a kar magassága) fokban. */
  abduction: StretchAbduction;
  /** Külső rotáció (a tenyér előre/felfelé fordítva). */
  externalRotation: boolean;
  /** Törzs (medence) elfordítása a nyújtott karral ellentétes irányba. */
  trunkRotation: boolean;
}

export const DEFAULT_STRETCH: StretchPosition = { abduction: 90, externalRotation: false, trunkRotation: false };

export interface RegionResult {
  regionId: string;
  name: string;
  /** A vizsgálatban azok a helyzetek, ahol a régió nyírási modulusa magasabb volt (az absztrakt szerint). */
  studyPositions: string;
  /** Igaz, ha a választott helyzet megegyezik a régió kiemelt helyzeteinek egyikével. */
  matches: (p: StretchPosition) => boolean;
  /** Ha a vizsgálat nem adta meg egyértelműen a távolítás szögét. */
  partial?: (p: StretchPosition) => boolean;
}

export const regionResults: RegionResult[] = [
  {
    regionId: 'muscle-pectoralis-major-clavicular',
    name: 'Kulcscsonti rész',
    studyPositions: 'horizontális távolítás 45°-os távolításnál medence-elfordítással és külső rotációval; 90°-os távolításnál; 90°-os távolításnál külső rotációval',
    matches: (p) => p.abduction === 90 || (p.abduction === 45 && p.externalRotation && p.trunkRotation)
  },
  {
    regionId: 'muscle-pectoralis-major-sternocostal',
    name: 'Szegycsonti rész',
    studyPositions: 'horizontális távolítás 90°-os távolításnál külső rotációval; medence-elfordítás és külső rotáció együtt',
    matches: (p) => p.abduction === 90 && p.externalRotation,
    // A „medence-elfordítás + külső rotáció” helyzetnél az absztrakt nem adja meg a távolítás szögét.
    partial: (p) => p.trunkRotation && p.externalRotation && p.abduction !== 90
  },
  {
    regionId: 'muscle-pectoralis-major-abdominal',
    name: 'Hasi rész',
    studyPositions: 'horizontális távolítás 135°-os távolításnál medence-elfordítással és külső rotációval',
    matches: (p) => p.abduction === 135 && p.externalRotation && p.trunkRotation
  }
];

export const regionFindings: Claim[] = [
  {
    text: 'Tizenkét nyújtási helyzetet (45°, 90°, 135° távolítás; medence-elfordítással vagy anélkül; külső rotációval vagy anélkül; horizontális távolítással) összehasonlítva a nagy mellizom három régiója más-más helyzetben nyúlt a leginkább (nyírási modulus, 15 férfi).',
    evidence: 'documented-observation',
    sourceIds: UMEHARA
  },
  {
    text: 'Magyarázat: a három rész rostjai különböző irányból futnak a közös tapadáshoz – a kulcscsontiak oldalra-lefelé, a hasiak felfelé-oldalra –, ezért a kar magassága változtatja meg, melyik rész kerül a legnagyobb nyújtásba.',
    evidence: 'educational-model',
    sourceIds: KIN
  }
];

export const dosageFindings: Claim[] = [
  {
    text: 'Az ACSM egészséges felnőtteknek a nagy izom-ín csoportokra nyújtó gyakorlatok sorozatát javasolja, gyakorlatonként összesen 60 másodpercig, legalább heti 2 napon.',
    evidence: 'documented-observation',
    sourceIds: GARBER
  },
  {
    text: 'Közvetlenül nyújtás után a teljesítmény statikus nyújtásnál kis–közepes mértékben csökkenhet; izomcsoportonként 60 másodpercnél rövidebb statikus nyújtásnál ez a csökkenés kisebb volt, mint 60 másodperc vagy annál hosszabb nyújtásnál.',
    evidence: 'documented-observation',
    sourceIds: BEHM
  },
  {
    text: 'Minden nyújtásfajta növelte a mozgástartományt, de ez az akut hatás jellemzően 30 percnél rövidebb ideig tartott. A statikus és a PNF-nyújtásnak nem volt egyértelmű hatása a sérülések előfordulására.',
    evidence: 'documented-observation',
    sourceIds: BEHM
  },
  {
    text: 'A szerzők a bemelegítés részeként végzett nyújtást javasolják, ha utána dinamikus mozgások következnek; ekkor a teljesítményre gyakorolt hatás elhanyagolható.',
    evidence: 'documented-observation',
    sourceIds: BEHM
  }
];

/** Falnál végzett egykaros és hengeren végzett kétkaros nyújtás különbségei (oktatási modell). */
export const stretchComparisonRows: ComparisonRow[] = [
  {
    aspect: 'Mi hozza létre a nyújtást',
    values: {
      wall: 'A törzs elfordulása a rögzített (falon lévő) kartól.',
      roller: 'A karok saját súlya (gravitáció).'
    },
    evidence: 'educational-model',
    sourceIds: KIN
  },
  {
    aspect: 'Oldalak',
    values: {
      wall: 'Egyoldali: a két oldal külön nyújtható, az eltérés jól érezhető.',
      roller: 'Kétoldali: a két oldal egyszerre nyúlik.'
    },
    evidence: 'educational-model',
    sourceIds: ['nsca-essentials']
  },
  {
    aspect: 'Az intenzitás szabályozása',
    values: {
      wall: 'A törzsfordítás mértékével, fokozatosan.',
      roller: 'A karok helyzetével (közelebb vagy távolabb a törzstől) és alátámasztással.'
    },
    evidence: 'educational-model',
    sourceIds: ['nsca-essentials']
  },
  {
    aspect: 'Törzs- és medencehelyzet',
    values: {
      wall: 'A törzs (medence) elfordítása a nyújtás része – a vizsgálatban ez egyes régióknál növelte a nyújtást.',
      roller: 'A medence nem fordul el; a törzs stabil, a derék nem homoríthat.'
    },
    evidence: 'educational-model',
    sourceIds: [...UMEHARA, ...KIN]
  },
  {
    aspect: 'Ellazulás',
    values: {
      wall: 'Állás közben a vállövnek tartania kell a helyzetet.',
      roller: 'Fekve a karok teljesen ellazíthatók.'
    },
    evidence: 'educational-model',
    sourceIds: ['nsca-essentials']
  }
];
