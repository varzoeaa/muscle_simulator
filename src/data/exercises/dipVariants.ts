import type { Claim } from '../../types';
import type { DipVariant } from '../../engines/animation/sagittalKinematics';
import type { ComparisonRow } from './benchVariants';

/**
 * Tolódzkodás-változatok: pad, párhuzamos korlát, gyűrű; törzsdőlés és mélység; fáradás;
 * könnyítés és nehezítés. A mért eredmények McKenzie és mtsai (2022) két vizsgálatából
 * származnak, minőségileg (EMG-értéket nem jelenítünk meg). A törzsdőlés hatására mérést nem
 * találtunk (2026-11-26); ez anatómiai levezetés.
 */
const VAR = ['mckenzie-2022-variants'];
const FATIGUE = ['mckenzie-2022-fatigue'];
const KIN = ['neumann-kinesiology'];

export const dipVariantNames: Record<DipVariant, string> = {
  bench: 'Padon (bench dip)',
  bar: 'Párhuzamos korláton',
  ring: 'Gyűrűn'
};

/** A három változat összehasonlítása (13 tapasztalt férfi, 3D mozgáselemzés és felszíni EMG). */
export const dipVariantRows: ComparisonRow[] = [
  {
    aspect: 'Vállfeszítés (az egyéni maximum %-ában)',
    values: {
      bench: 'A legnagyobb: átlagosan kb. 101% – a résztvevők a saját maximális vállfeszítésüket is meghaladták.',
      bar: 'Kb. 88%.',
      ring: 'A legkisebb: kb. 69%.'
    },
    evidence: 'documented-observation',
    sourceIds: VAR
  },
  {
    aspect: 'Törzs előredőlése',
    values: {
      bench: 'A legkisebb (közel függőleges törzs).',
      bar: 'Nagyobb, mint padon.',
      ring: 'Nagyobb, mint padon.'
    },
    evidence: 'documented-observation',
    sourceIds: VAR
  },
  {
    aspect: 'Könyökhajlítás',
    values: {
      bench: 'Kisebb, mint korláton.',
      bar: 'A legnagyobb.',
      ring: 'Kisebb, mint korláton.'
    },
    evidence: 'documented-observation',
    sourceIds: VAR
  },
  {
    aspect: 'Izomaktivitás (EMG-csúcs)',
    values: {
      bench: 'A legtöbb izomé kisebb, mint korláton; a háromfejű karizom aktivitása a többi izomhoz képest viszonylag nagy.',
      bar: 'Hat izomé (nagy mellizom, deltaizom elülső része, háromfejű karizom, csuklyásizom felső része, elülső fűrészizom, széles hátizom) nagyobb, mint padon.',
      ring: 'A korláthoz hasonló; a nagy mellizom, a széles hátizom és a kétfejű karizom aktivitása itt volt a legnagyobb.'
    },
    evidence: 'documented-observation',
    sourceIds: VAR
  },
  {
    aspect: 'A szerzők javaslata',
    values: {
      bench: 'Rendszeres edzésbe és rehabilitációba nem javasolják, mert terhelés alatt a vállfeszítés végtartományát igényli.',
      bar: 'A padhoz képest kedvezőbb testhelyzet; megfelelő továbblépés. Könnyítő változatokkal és derékra akasztott súllyal fokozatosan terhelhető.',
      ring: 'A mellizom célzására a legjobb változat lehet; esésveszély (kezdőknél, fáradtan) esetén a korlát javasolt helyette.'
    },
    evidence: 'documented-observation',
    sourceIds: VAR
  }
];

/** A törzs előredőlésének hatása (oktatási modell). */
export function dipLeanClaims(lean: number): Claim[] {
  const base: Claim = {
    text: 'A vállfeszítés a felkar és a törzs szögéből adódik: ha a törzs előre dől, a felkar a törzshöz képest kevésbé kerül hátra, így ugyanakkora ereszkedésnél kisebb a vállfeszítés.',
    evidence: 'educational-model',
    sourceIds: KIN
  };
  if (lean >= 25)
    return [
      base,
      {
        text: 'Előredőlt törzsnél a vállízület mozgásában a hajlítás és a közelítés iránya kerül előtérbe, ezért a nagy mellizom szerepe nagyobb lehet. Ezt a törzsdőlés szerint közvetlenül nem mérték.',
        evidence: 'educational-model',
        sourceIds: KIN
      }
    ];
  return [
    base,
    {
      text: 'Közel függőleges törzsnél a vállízület nagyobb feszítésbe kerül, a mozgás jobban a könyökfeszítésre (háromfejű karizom) épül. Ezt a törzsdőlés szerint közvetlenül nem mérték; a padon végzett változatnál – ahol a törzs a legfüggőlegesebb – a háromfejű karizom aktivitása viszonylag nagy volt.',
      evidence: 'educational-model',
      sourceIds: [...KIN, ...VAR]
    }
  ];
}

export const dipFatigueFindings: Claim[] = [
  {
    text: 'Korláton végzett, kimerülésig tartó sorozatban a fáradás nem változtatta meg a legnagyobb ízületi szögeket, de nőtt az ismétlés ideje, és nőtt a nagy mellizom, a háromfejű karizom és három stabilizáló izom aktivitása (15 egészséges férfi).',
    evidence: 'documented-observation',
    sourceIds: FATIGUE
  }
];
