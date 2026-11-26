import type { MotionDefinition } from '../../types';
import { pectoralisMajor } from '../muscles/pectoralisMajor';

const rolesFor = (movementId: MotionDefinition['movementId']) => pectoralisMajor.roles.filter((r) => r.movementId === movementId);

export const pmAdduction: MotionDefinition = {
  id: 'pm-adduction',
  muscleId: 'muscle-pectoralis-major',
  movementId: 'shoulder-adduction',
  name: { hu: 'Vállízületi közelítés', en: 'Shoulder adduction', la: 'Adductio' },
  viewId: 'anterior',
  startPose: { shoulderAbduction: 95 },
  endPose: { shoulderAbduction: 8 },
  durationMs: 3200,
  description:
    'A felkar a frontális síkban, oldalsó emelt helyzetből a törzs mellé mozog. A szegycsonti-bordai és a hasi rész rostjai a mellkastól a felkarcsont felé futnak, így rövidülésükkel a tapadást (a nagy gumó tarajat) az eredés felé húzzák.',
  resistance:
    'Szemléltetett külső ellenállás: magasról, oldalról érkező csigakábel, amely a kart távolító irányba húzza. Ezért kell a közelítő izmoknak dolgozniuk. (Álló helyzetben, csiga nélkül a kar leengedését a gravitáció végezné, és a távolító izmok dolgoznának excentrikusan.)',
  contraction: {
    concentric: {
      summary: 'Az aktív izom rövidül – a kar a törzs felé mozog.',
      detail:
        'A nagy mellizom által kifejtett húzóerő meghaladja a csigakábel ellenállását, ezért az eredés és a tapadás közelebb kerül egymáshoz. Edzőtermi példa: egykezes csigás közelítés felhúzó irányú kábellel.'
    },
    eccentric: {
      summary: 'Az aktív izom terhelés alatt hosszabbodik – a kar fékezetten távolodik.',
      detail:
        'A kábel ellenállása nagyobb, mint az izom által kifejtett erő, ezért a kar távolító irányba mozdul, de az izom aktív marad és fékezi a mozgást. Az eredés és a tapadás távolodik egymástól.'
    },
    isometric: {
      summary: 'Az izom aktív, de a kar helyzete közel változatlan.',
      detail:
        'Az izom erőkifejtése és a külső ellenállás egyensúlyban van. Az izom-ín egység hossza és az ízületi szög megközelítőleg állandó, az izom mégis aktívan feszül.'
    }
  },
  roles: rolesFor('shoulder-adduction'),
  regionNotes: [
    {
      regionId: 'muscle-pectoralis-major-sternocostal',
      text: 'A fő közelítő rész: rostjai emelt karnál a közelítés irányába húznak.'
    },
    {
      regionId: 'muscle-pectoralis-major-abdominal',
      text: 'A legalsó rostok emelt karhelyzetből lefelé-befelé húzzák a kart, a szegycsonti-bordai résszel együtt.'
    },
    {
      regionId: 'muscle-pectoralis-major-clavicular',
      text: 'Közelítő szerepe kisebb, és a karhelyzettől függ; elsősorban a vállízület hajlításában jelentős.'
    }
  ],
  claims: [
    { text: 'A nagy mellizom a vállízület közelítő izma.', evidence: 'anatomical-fact', sourceIds: ['moore-coa', 'openstax-ap2e'] },
    { text: 'Az izomrészek közelítésben betöltött eltérő szerepe a rostirányból következik.', evidence: 'educational-model', sourceIds: ['neumann-kinesiology'] },
    { text: 'Az animáció a frontális síkú mozgás egyszerűsített 2D vetülete; a lapocka együttmozgását nem ábrázolja.', evidence: 'educational-model', sourceIds: [] }
  ]
};

export const pmHorizontalAdduction: MotionDefinition = {
  id: 'pm-horizontal-adduction',
  muscleId: 'muscle-pectoralis-major',
  movementId: 'shoulder-horizontal-adduction',
  name: { hu: 'Horizontális közelítés', en: 'Horizontal adduction' },
  viewId: 'superior',
  startPose: { shoulderHorizontalAbduction: 108 },
  endPose: { shoulderHorizontalAbduction: 4 },
  durationMs: 3200,
  description:
    'A 90°-ban emelt felkar a vízszintes síkban, oldalról előre mozog. Felülnézetben jól látszik, hogy a nagy mellizom rostjai a mellkas elülső falától a felkarcsont elülső felszínéig futnak, ezért rövidülésük a kart előre-befelé fordítja.',
  resistance:
    'Szemléltetett külső ellenállás: hátulról-oldalról húzó csigakábel vagy kézisúlyzó hanyatt fekve (tárogatás). Az ellenállás a kart horizontális távolítás irányába húzza.',
  contraction: {
    concentric: {
      summary: 'Az aktív izom rövidül – a kar előre-befelé mozog.',
      detail: 'Például a csigás kereszthúzás vagy a pec deck összezáró szakasza. Az eredés (szegycsont, kulcscsont) és a tapadás közelebb kerül.'
    },
    eccentric: {
      summary: 'Az aktív izom terhelés alatt hosszabbodik – a kar fékezetten nyílik oldalra.',
      detail:
        'Például a kézisúlyzós tárogatás leengedő szakasza: a súly a kart lefelé-oldalra viszi, a nagy mellizom aktívan fékezi a mozgást, miközben hossza nő.'
    },
    isometric: {
      summary: 'Az izom aktív, a kar helyzete közel változatlan.',
      detail: 'Például a tárogatás tartása egy adott szögben. Az izom feszül, de az ízületi szög és az izom-ín egység hossza megközelítőleg állandó.'
    }
  },
  roles: rolesFor('shoulder-horizontal-adduction'),
  regionNotes: [
    { regionId: 'muscle-pectoralis-major-clavicular', text: 'A kulcscsonti rész rostjai felülről-befelé futnak; a mozgásban a szegycsonti-bordai résszel együtt dolgozik.' },
    { regionId: 'muscle-pectoralis-major-sternocostal', text: 'A szegycsonti-bordai rész rostjai a vízszintes síkhoz közel futnak, ezért ebben a mozgásban jelentős a húzásuk.' }
  ],
  claims: [
    { text: 'A horizontális közelítés fő izmai a nagy mellizom és a deltaizom elülső része.', evidence: 'anatomical-fact', sourceIds: ['neumann-kinesiology'] },
    { text: 'A hasi rész felülnézetben nem látható, ezért nem szerepel ezen az ábrán.', evidence: 'educational-model', sourceIds: [] },
    { text: 'Az animáció egyszerűsített 2D vetület; a lapocka protrakcióját és a könyök helyzetváltozását nem ábrázolja.', evidence: 'educational-model', sourceIds: [] }
  ]
};

export const motions: MotionDefinition[] = [pmAdduction, pmHorizontalAdduction];
export const motionById = (id: string | undefined) => motions.find((m) => m.id === id);
