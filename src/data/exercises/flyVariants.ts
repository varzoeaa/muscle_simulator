import type { AngleZone, ComparisonRow } from './benchVariants';

/**
 * A kézisúlyzós tárogatás változatai: a pad dőlésszöge és a gépes tárogatás (pec deck).
 *
 * Tárogatásra vonatkozó, dőlésszögeket összehasonlító EMG-vizsgálatot, illetve a kézisúlyzós és a
 * gépes tárogatást közvetlenül összevető lektorált vizsgálatot nem találtunk (keresés:
 * 2026-11-26). Az alábbi különbségek ezért anatómiai és mechanikai levezetések (oktatási modell):
 * a nagy mellizom részeinek ízületi működései (Neumann 2017) és a forgatónyomaték alapelve
 * (erő × erőkar; NSCA, Neumann).
 */
const KIN = ['neumann-kinesiology'];
const KIN_TECH = ['neumann-kinesiology', 'nsca-essentials'];

/** Kiinduló helyzetben (függőleges kar) a vállízület hajlítása a törzshöz képest: 90° + dőlésszög. */
export const flyStartFlexion = (benchAngle: number) => 90 + benchAngle;

export const flyAngleZones: AngleZone[] = [
  {
    id: 'decline',
    name: 'Negatív pad (decline)',
    range: [-15, -1],
    example: -15,
    kinematics:
      'A súlyzók függőlegesen a váll fölött vannak, ezért a kar a törzshöz képest 90°-nál kisebb hajlításban indul. A karok nyitása–zárása a törzshöz képest lejjebb, a test oldala felé tolódó síkban történik.',
    findings: [
      {
        text: 'A szegycsonti-bordai rész rostjai lefelé-oldalra futnak; a vállízület közelítésében és hajlított helyzetből történő feszítésében is részt vesz, ezért a lejjebb tolódó mozgássíkban szerepe nagyobb lehet.',
        evidence: 'educational-model',
        sourceIds: KIN
      }
    ]
  },
  {
    id: 'flat',
    name: 'Vízszintes pad (flat)',
    range: [0, 0],
    example: 0,
    kinematics: 'A kar 90°-os vállhajlításban indul, a nyitás–zárás a törzs vízszintes (transzverzális) síkjában történik: tiszta horizontális távolítás és közelítés.',
    findings: [
      {
        text: 'A nagy mellizom mindkét része horizontális közelítő; vízszintes padon a mozgás iránya mindkét rész fő működésével egybeesik.',
        evidence: 'anatomical-fact',
        sourceIds: KIN
      }
    ]
  },
  {
    id: 'incline',
    name: 'Ferde pad (incline)',
    range: [1, 45],
    example: 30,
    kinematics:
      'A kar a törzshöz képest 90°-nál nagyobb hajlításban indul (pl. 30°-os padon kb. 120°). A karok a fej felé tolódó síkban nyílnak és zárnak: a horizontális közelítéshez hajlítás is társul.',
    findings: [
      {
        text: 'A kulcscsonti rész a vállízület hajlítója is, ezért ferde padon – ahol a mozgás a hajlítás felé tolódik – szerepe nagyobb lehet. Ez anatómiai levezetés; tárogatásra vonatkozó mérést nem találtunk.',
        evidence: 'educational-model',
        sourceIds: KIN
      },
      {
        text: 'A deltaizom elülső része szintén vállhajlító, így ferde padon ennek szerepe is nőhet.',
        evidence: 'educational-model',
        sourceIds: KIN
      }
    ]
  }
];

/** Kézisúlyzós tárogatás és gépes tárogatás (pec deck) különbségei. */
export const flyMachineRows: ComparisonRow[] = [
  {
    aspect: 'Testhelyzet',
    values: {
      dumbbell: 'Hanyatt fekvés padon; a pad dőlésszöge állítható (negatív, vízszintes, ferde).',
      machine: 'Ülés háttámlával; a testhelyzetet a gép rögzíti, az ülésmagasság állítható.'
    },
    evidence: 'educational-model',
    sourceIds: ['nsca-essentials']
  },
  {
    aspect: 'Az ellenállás iránya',
    values: {
      dumbbell: 'A gravitáció: mindig függőlegesen lefelé hat, a kar helyzetétől függetlenül.',
      machine: 'A gép karja (kábel, bütyök) adja: a kar mozgásirányával szemben, a mozgás síkjában hat.'
    },
    evidence: 'educational-model',
    sourceIds: KIN_TECH
  },
  {
    aspect: 'Terhelés a mozgás során',
    values: {
      dumbbell: 'Nyitott karnál a legnagyobb (a súlyzó messze van a vállízület függőlegesétől), zárt karnál a mellkas fölött közel nulla.',
      machine: 'A mozgás teljes tartományában jelen van, zárt helyzetben is; a pontos profilt a gép kialakítása határozza meg.'
    },
    evidence: 'educational-model',
    sourceIds: KIN_TECH
  },
  {
    aspect: 'Stabilitás és pálya',
    values: {
      dumbbell: 'Szabad súly: a két kar egymástól függetlenül mozog, a pályát és a könyökszöget a gyakorlónak kell tartania.',
      machine: 'A gép vezeti a pályát; a két kar a gép karjaihoz kötött.'
    },
    evidence: 'educational-model',
    sourceIds: ['nsca-essentials']
  },
  {
    aspect: 'Ízületi mozgás',
    values: {
      dumbbell: 'Horizontális közelítés és távolítás a vállízületben, közel állandó könyökszöggel.',
      machine: 'Ugyanaz: horizontális közelítés és távolítás a vállízületben.'
    },
    evidence: 'anatomical-fact',
    sourceIds: KIN
  }
];

/**
 * Relatív (minőségi) ellenállási nyomaték a vállízületen a horizontális távolítás szögének
 * függvényében. Kézisúlyzónál a nyomaték az erőkarral, vagyis a kar függőlegestől mért szögének
 * szinuszával arányos (a mozgás síkja a függőlegest tartalmazza, ezért ez a pad dőlésszögétől
 * független). A gépnél a profil gépfüggő; az ábra állandó értéket feltételez.
 */
export const relativeMoment = (kind: 'dumbbell' | 'machine', horizontalAbductionDeg: number) =>
  kind === 'dumbbell' ? Math.max(0, Math.sin((Math.min(90, Math.max(0, horizontalAbductionDeg)) * Math.PI) / 180)) : 0.75;

/* ------------------------------------------------------------------ */
/* Gépes tárogatás: ülésmagasság (a kar magassága a vállhoz képest)     */
/* ------------------------------------------------------------------ */

/** A felkar és a törzs által bezárt szög (elölről nézve): 90° + a kar emelése a vízszinteshez képest. */
export const pecDeckArmAngle = (elevation: number) => 90 + elevation;

/**
 * A gépes tárogatásnál nincs állítható pad; a dőlésszög megfelelője az, hogy az ülésmagasság miatt
 * a felkar a váll alatt, vállmagasságban vagy a váll fölött mozog. A levezetés ugyanaz, mint a
 * kézisúlyzós tárogatás dőlésszögeinél (oktatási modell).
 */
export const pecDeckHeightZones: AngleZone[] = [
  {
    id: 'decline',
    name: 'Magas ülés (a kar a váll alatt)',
    range: [-20, -1],
    example: -15,
    kinematics:
      'Túl magas ülésnél a felkar a vállmagasság alatt, a törzshöz képest 90°-nál kisebb szögben mozog (pl. −15°-nál kb. 75°). A zárás a test oldala felé tolódó síkban történik – a negatív padon végzett tárogatás megfelelője.',
    findings: [
      {
        text: 'A szegycsonti-bordai rész rostjai lefelé-oldalra futnak, és a vállízület közelítésében is részt vesznek, ezért a lejjebb tolódó mozgássíkban szerepe nagyobb lehet.',
        evidence: 'educational-model',
        sourceIds: KIN
      }
    ]
  },
  {
    id: 'flat',
    name: 'Vállmagasság',
    range: [0, 0],
    example: 0,
    kinematics: 'A felkar vállmagasságban, a törzshöz képest kb. 90°-ban mozog: tiszta horizontális közelítés és távolítás. A gép beállításának szokásos célja ez a helyzet.',
    findings: [
      {
        text: 'A nagy mellizom mindkét része horizontális közelítő; vállmagasságban a mozgás iránya mindkét rész fő működésével egybeesik.',
        evidence: 'anatomical-fact',
        sourceIds: KIN
      },
      {
        text: 'Az ülésmagasságot úgy érdemes beállítani, hogy a felkar a vállmagasságban legyen, és a vállak ne emelkedjenek meg.',
        evidence: 'educational-model',
        sourceIds: ['nsca-essentials']
      }
    ]
  },
  {
    id: 'incline',
    name: 'Alacsony ülés (a kar a váll fölött)',
    range: [1, 20],
    example: 15,
    kinematics:
      'Túl alacsony ülésnél a felkar a váll fölé kerül, a törzshöz képest 90°-nál nagyobb szögben mozog (pl. 15°-nál kb. 105°). A zárás a fej felé tolódó síkban történik – a ferde padon végzett tárogatás megfelelője.',
    findings: [
      {
        text: 'A kulcscsonti rész és a deltaizom elülső része a vállízület hajlítója is, ezért a feljebb tolódó mozgássíkban szerepük nagyobb lehet.',
        evidence: 'educational-model',
        sourceIds: KIN
      }
    ]
  }
];

/* ------------------------------------------------------------------ */
/* Csigás keresztbehúzás: a csiga magassága (húzásirány)               */
/* ------------------------------------------------------------------ */

/**
 * A kábel húzásiránya a vízszinteshez képest (fok): pozitív = felső csiga (felülről lefelé húzás),
 * 0 = vállmagasság, negatív = alsó csiga (alulról felfelé húzás). A csigamagasságot összehasonlító
 * elsődleges EMG-vizsgálatot nem találtunk (2026-11-26); a különbségek az izomrészek ismert
 * ízületi működéséből levezetett oktatási modell.
 */
export const cablePulleyZones: AngleZone[] = [
  {
    id: 'incline',
    name: 'Alsó csiga (alulról felfelé)',
    range: [-30, -1],
    example: -25,
    kinematics:
      'A kábel lentről-oldalról húz; a kezek a mellkas felső része vagy az arc előtt találkoznak. A horizontális közelítéshez a vállízület hajlítása (előre-felfelé mozgás) társul – a ferde padon végzett tárogatáshoz hasonlóan.',
    findings: [
      {
        text: 'A kulcscsonti rész és a deltaizom elülső része a vállízület hajlítója is, ezért a felfelé irányuló húzásban szerepük nagyobb lehet.',
        evidence: 'educational-model',
        sourceIds: KIN
      }
    ]
  },
  {
    id: 'flat',
    name: 'Vállmagasság',
    range: [0, 0],
    example: 0,
    kinematics: 'A kábel vállmagasságban, oldalról húz; a kezek a mellkas előtt találkoznak. A mozgás közel tiszta horizontális közelítés.',
    findings: [
      {
        text: 'A nagy mellizom mindkét része horizontális közelítő; vállmagasságú húzásnál a mozgás iránya mindkét rész fő működésével egybeesik.',
        evidence: 'anatomical-fact',
        sourceIds: KIN
      }
    ]
  },
  {
    id: 'decline',
    name: 'Felső csiga (felülről lefelé)',
    range: [1, 30],
    example: 25,
    kinematics:
      'A kábel fentről-oldalról húz; a kezek a has vagy a csípő előtt találkoznak. A horizontális közelítéshez a vállízület közelítése (a kar lefelé, a test felé mozgása) társul – a negatív padon végzett tárogatáshoz hasonlóan.',
    findings: [
      {
        text: 'A szegycsonti-bordai rész rostjai lefelé-oldalra futnak, és a vállízület közelítői, ezért a lefelé irányuló húzásban szerepük nagyobb lehet.',
        evidence: 'educational-model',
        sourceIds: KIN
      },
      {
        text: 'A vállízület közelítésében a széles hátizom és a nagy görgetegizom is részt vesz, így ebben a változatban segítő szerepük lehet.',
        evidence: 'educational-model',
        sourceIds: KIN
      }
    ]
  }
];

/** A kezek találkozási pontjának magassága (minőségi leírás) a húzásirány szerint. */
export const cableFinishText = (angle: number) => (angle > 0 ? 'a has vagy a csípő előtt' : angle < 0 ? 'a mellkas felső része vagy az arc előtt' : 'a mellkas előtt');
