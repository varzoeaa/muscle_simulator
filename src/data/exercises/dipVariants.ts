import type { Claim } from '../../types';
import type { DipVariant } from '../../engines/animation/sagittalKinematics';
import type { ComparisonRow } from './benchVariants';

/**
 * Tolódzkodás-változatok: pad, párhuzamos korlát, gyűrű; törzsdőlés és mélység; fáradás;
 * könnyítés és nehezítés. A mért eredmények McKenzie és mtsai (2022) két vizsgálatából
 * származnak, minőségileg (EMG-értéket nem jelenítünk meg). A törzsdőlés hatására mérést nem
 * találtunk (2026-11-26); a törzsdőlésből számított vállszög a sematikus modell geometriai eredménye.
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
    aspect: 'Csúcs vállfeszítés (egy külön mozgástartomány-tesztben mért egyéni referenciaérték %-ában; csoportátlag)',
    values: {
      bench: 'A legnagyobb: átlagosan kb. 101% – a csoportátlag elérte, illetve kissé meghaladta a külön tesztben mért egyéni referenciaértéket.',
      bar: 'Átlagosan kb. 88%.',
      ring: 'A legkisebb: átlagosan kb. 69%.'
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
      bar: 'Hat izomé (nagy mellizom, deltaizom elülső része, háromfejű karizom, csuklyásizom felső része, elülső fűrészizom, széles hátizom) nagyobb, mint padon. Az elülső fűrészizomnál ez a csúcs-EMG-re vonatkozik; a kontrakció típusát vagy a felső rostcsoport külön terhelését nem igazolja.',
      ring: 'A korláthoz hasonló; ebben a vizsgálatban a nagy mellizom, a széles hátizom és a kétfejű karizom EMG-csúcsa itt volt a legnagyobb. Ebből önmagában nem következik nagyobb izomnövekedés vagy általános sérülésveszély.'
    },
    evidence: 'documented-observation',
    sourceIds: VAR
  },
  {
    aspect: 'A szerzők javaslata',
    values: {
      bench: 'Rendszeres edzésbe és rehabilitációba nem javasolják, mert terhelés alatt a vállfeszítés végtartományát igényli.',
      bar: 'A padhoz képest kedvezőbb testhelyzet; megfelelő továbblépés. Könnyítő változatokkal és derékra akasztott súllyal fokozatosan terhelhető.',
      ring: 'A szerzők szerint (a mért EMG-csúcsok alapján) a mellizom célzására a legjobb változat lehet; esésveszély (kezdőknél, fáradtan) esetén a korlát javasolt helyette.'
    },
    evidence: 'documented-observation',
    sourceIds: VAR
  }
];

/**
 * A törzs előredőlésének hatása (oktatási modell). Fiziológiai küszöb nincs: a szöveg minden
 * törzsdőlésnél ugyanaz, csak a modellből számított érték változik.
 */
export function dipLeanClaims(lean: number): Claim[] {
  return [
    {
      text: `A modellben a vállfeszítés a felkar függőlegestől mért szögéből és a törzs előredőléséből (most ${lean}°) adódik: előredőlt törzsnél ugyanakkora ereszkedésnél kisebb vállfeszítés jön ki. Ez a sematikus modell geometriai eredménye, nem mért adat.`,
      evidence: 'educational-model',
      sourceIds: KIN
    },
    {
      text: 'Hogy a törzs előredöntése önmagában növeli-e a mellizom terhelését, vagy a függőleges törzs a háromfejű karizomra helyezi-e azt, közvetlen mérés híján nem tudjuk. A változatok közötti EMG-különbségek (fenti táblázat) több tényező együttes hatását tükrözik, nem csak a törzsdőlését.',
      evidence: 'educational-model',
      sourceIds: [...KIN, ...VAR]
    }
  ];
}

export const dipFatigueFindings: Claim[] = [
  {
    text: 'Korláton végzett, kimerülésig tartó sorozatban (15 egészséges férfi) a fáradás nem változtatta meg a csúcs ízületi szögeket, de nőtt az ismétlés ideje, és nőtt a nagy mellizom, a háromfejű karizom és három stabilizáló izom EMG-csúcsa.',
    evidence: 'documented-observation',
    sourceIds: FATIGUE
  },
  {
    text: 'Ugyanebben a vizsgálatban a medence függőleges elmozdulása fáradtan kisebb lett – a szerzők szerint főként a felső helyzet magassága csökkent, nem a mélység –, és a kezdő- és véghelyzetben nagyobb volt a vállfeszítés. Ezek a kezdő/véghelyzeti szögek mások, mint a változatlan csúcsszögek.',
    evidence: 'documented-observation',
    sourceIds: FATIGUE
  }
];
