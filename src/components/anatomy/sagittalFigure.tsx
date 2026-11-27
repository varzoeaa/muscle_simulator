import type { DisplayRoleType, FramedPoint } from '../../types';
import { matrixToSvg, smoothClosedPath, toWorld, type Matrix } from '../../utils/geometry';

/**
 * Az oldalnézeti (szagittális) gyakorlatábrák közös elemei: törzssziluett, felkar, alkar és a
 * négy kirajzolt izom (nagy mellizom, deltaizom elülső része, háromfejű és kétfejű karizom).
 *
 * Törzsrendszer (T): origó a csípő, −x a fej felé, −y a test elülső oldala felé.
 * Felkarrendszer (H): origó a vállízület, +y a könyök felé, +x a felkar elülső felszíne felé;
 * a hossztengely mentén a vetületi rövidülés (scaleY) is ebben a rendszerben hat.
 * Saját szerkesztésű, sematikus ábra (lásd: MODEL_LIMITATIONS.md).
 */
export const T = (x: number, y: number): FramedPoint => ({ frame: 'torso', x, y });
export const H = (x: number, y: number): FramedPoint => ({ frame: 'humerus', x, y });

export const TORSO_PATH = 'M14,16 L-206,16 C-222,10 -226,-18 -212,-34 C-196,-50 -166,-58 -126,-54 C-96,-50 -66,-40 -36,-38 C-10,-36 12,-22 16,0 Z';

const pecOutline = [T(-204, -36), T(-182, -56), T(-148, -63), T(-120, -58), T(-116, -44), H(8, 42), H(-6, 22), T(-198, -22)];
const pecFibers: [FramedPoint, FramedPoint][] = [
  [T(-196, -46), H(-2, 26)],
  [T(-176, -56), H(0, 30)],
  [T(-156, -60), H(2, 34)],
  [T(-136, -58), H(4, 38)],
  [T(-120, -50), H(6, 40)]
];
const deltOutline = [T(-210, -26), T(-200, -42), H(-12, 4), H(-12, 64), H(-2, 70), H(10, 12)];
const tricepsOutline = [H(-14, 30), H(-16, 100), H(-8, 118), H(0, 116), H(-4, 40)];
/** Kétfejű karizom: a felkar elülső oldalán (a háromfejű karizommal szemben). */
const bicepsOutline = [H(6, 34), H(15, 62), H(15, 100), H(7, 120), H(3, 104), H(5, 60)];

/** Az ábrán szereplő izmok felirat-horgonypontjai. */
export const labelAnchors: Record<string, FramedPoint> = {
  'muscle-pectoralis-major': T(-150, -54),
  'muscle-deltoid-anterior': H(0, 30),
  'muscle-triceps-brachii': H(-15, 84),
  'muscle-biceps-brachii': H(14, 84)
};

/** Egy kirajzolt izom felirata: név, és az aktuális szakaszban betöltött szerep(ek). */
export interface SceneMuscleLabel {
  structureId: string;
  name: string;
  /** Az izom kitöltését meghatározó szerep. */
  role: DisplayRoleType;
  /** Rövid szerepleírás, pl. „AG · hosszabbodik”. */
  detail: string;
}

const patternFill = (role: DisplayRoleType | undefined) =>
  role === 'synergist' ? 'url(#pat-fig-syn)' : role === 'antagonist' ? 'url(#pat-fig-ant)' : role === 'stabilizer' ? 'url(#pat-fig-stab)' : undefined;

/** Mintázatok a szerepekhez (egy ábrán egyszer kell elhelyezni). */
export function FigureDefs() {
  return (
    <defs>
      <pattern id="pat-fig-syn" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" fill="var(--an-synergist)" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
      </pattern>
      <pattern id="pat-fig-ant" width="5" height="5" patternUnits="userSpaceOnUse">
        <rect width="5" height="5" fill="var(--an-antagonist)" />
        <circle cx="2.5" cy="2.5" r="1" fill="rgba(255,255,255,0.45)" />
      </pattern>
      <pattern id="pat-fig-stab" width="7" height="7" patternUnits="userSpaceOnUse">
        <rect width="7" height="7" fill="var(--an-stabilizer)" />
        <path d="M0,0 L7,7 M7,0 L0,7" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
      </pattern>
    </defs>
  );
}

/** Törzs és fej sziluettje a törzsrendszerben. */
export function TorsoSilhouette({ torso }: { torso: Matrix }) {
  return (
    <g transform={matrixToSvg(torso)}>
      <path d={TORSO_PATH} fill="var(--an-body)" stroke="var(--an-body-stroke)" />
      <rect x={-232} y={-20} width={26} height={30} rx={8} fill="var(--an-body)" />
      <circle cx={-246} cy={-6} r={24} fill="var(--an-body)" stroke="var(--an-body-stroke)" />
    </g>
  );
}

/**
 * A kar és a négy kirajzolt izom. A nagy mellizom mindig a kiválasztott izom színét kapja; a
 * többi izom a feliratokból (aktuális szakasz) kapott szerep szerint színeződik.
 */
export function FigureArm({
  transforms,
  elbow,
  hand,
  shoulder,
  labels,
  active,
  clipId
}: {
  transforms: Record<string, Matrix>;
  elbow: { x: number; y: number };
  hand: { x: number; y: number };
  shoulder: { x: number; y: number };
  labels: SceneMuscleLabel[];
  active: boolean;
  clipId: string;
}) {
  const w = (p: FramedPoint) => toWorld(p, transforms);
  const pecD = smoothClosedPath(pecOutline.map(w));
  const roleOf = (id: string) => labels.find((l) => l.structureId === id)?.role;
  const cls = (id: string, fallback: DisplayRoleType) => `an-muscle role-${roleOf(id) ?? fallback}`;
  const pecRole = roleOf('muscle-pectoralis-major');
  return (
    <g>
      <clipPath id={clipId}>
        <path d={pecD} />
      </clipPath>
      <path d={smoothClosedPath(tricepsOutline.map(w))} className={cls('muscle-triceps-brachii', 'agonist')} style={{ fill: patternFill(roleOf('muscle-triceps-brachii')) }} />
      <g id="muscle-pectoralis-major">
        <path d={pecD} className={`an-muscle ${pecRole === 'stretched' ? 'role-stretched' : 'is-selected'} ${active ? 'is-active' : ''}`} />
        <g clipPath={`url(#${clipId})`}>
          {pecFibers.map(([a, b], i) => {
            const pa = w(a);
            const pb = w(b);
            return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} className="an-fiber" />;
          })}
        </g>
      </g>
      <g transform={matrixToSvg(transforms.humerus!)}>
        <rect x={-13} y={-6} width={26} height={126} rx={12} fill="var(--an-limb)" stroke="var(--an-body-stroke)" />
      </g>
      <path d={smoothClosedPath(bicepsOutline.map(w))} className={cls('muscle-biceps-brachii', 'antagonist')} style={{ fill: patternFill(roleOf('muscle-biceps-brachii') ?? 'antagonist') }} />
      <path d={smoothClosedPath(deltOutline.map(w))} className={cls('muscle-deltoid-anterior', 'agonist')} style={{ fill: patternFill(roleOf('muscle-deltoid-anterior')) }} />
      <line x1={elbow.x} y1={elbow.y} x2={hand.x} y2={hand.y} stroke="var(--an-limb)" strokeWidth={20} strokeLinecap="round" />
      <circle cx={elbow.x} cy={elbow.y} r={4} fill="none" stroke="var(--an-joint)" strokeDasharray="2 1.5" />
      <circle cx={shoulder.x} cy={shoulder.y} r={5} fill="none" stroke="var(--an-joint)" strokeDasharray="2 1.5" />
    </g>
  );
}

/**
 * Szerepkör-feliratok egy szabad sávban, vezetővonallal az izomhoz. A sorrend az izmok
 * függőleges helyzetét követi, így a vezetővonalak nem keresztezik egymást.
 */
export function RoleLabels({
  labels,
  transforms,
  x,
  top,
  side = 'right'
}: {
  labels: SceneMuscleLabel[];
  transforms: Record<string, Matrix>;
  x: number;
  top: number;
  /** right: a feliratok az izmoktól jobbra (balra zártak); left: balra (jobbra zártak). */
  side?: 'left' | 'right';
}) {
  const k = side === 'right' ? 1 : -1;
  const anchor = side === 'right' ? 'start' : 'end';
  const placed = labels
    .map((l) => ({ l, a: labelAnchors[l.structureId] ? toWorld(labelAnchors[l.structureId]!, transforms) : undefined }))
    .filter((p): p is { l: SceneMuscleLabel; a: { x: number; y: number } } => !!p.a)
    .sort((p, q) => p.a.y - q.a.y);
  return (
    <g>
      {placed.map(({ l, a }, i) => {
        const y = top + i * 38;
        return (
          <g key={l.structureId}>
            <polyline points={`${a.x},${a.y} ${x - 14 * k},${y - 4} ${x - 4 * k},${y - 4}`} fill="none" stroke={`var(--an-${l.role})`} strokeWidth={1} />
            <circle cx={a.x} cy={a.y} r={2.2} fill={`var(--an-${l.role})`} />
            <text x={x} y={y - 1} textAnchor={anchor} className={`an-label an-label-${l.role}`} style={{ fontSize: 12 }}>
              {l.name}
            </text>
            <text x={x} y={y + 13} textAnchor={anchor} className="an-label" style={{ fontSize: 10.5, fill: `var(--an-${l.role})` }}>
              {l.detail}
            </text>
          </g>
        );
      })}
    </g>
  );
}
