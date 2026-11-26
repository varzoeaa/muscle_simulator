import { memo, useCallback, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { Maximize2, Minus, Plus } from 'lucide-react';
import type { LayerId, MuscleRoleType, Pose, ViewGeometry } from '../../types';
import { computeFrameTransforms, matrixToSvg, smoothClosedPath, toWorld, type Matrix } from '../../utils/geometry';
import { structureName } from '../../data/muscles';

export const ALL_LAYERS: Record<LayerId, boolean> = {
  bones: true,
  'deep-muscles': true,
  'superficial-muscles': true,
  attachments: true,
  labels: true,
  joints: true
};

export interface AnatomyViewerProps {
  geometry: ViewGeometry;
  pose: Pose;
  /** A tükrözött (bal) oldal póza; alapértelmezés: azonos (szimmetrikus mozgás). */
  mirrorPose?: Pose;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  layers?: Record<LayerId, boolean>;
  /** Csak a kiválasztott izom (és a csontok) látszik. */
  isolate?: boolean;
  /** Szerepkör szerinti színezés (Biomechanics Lab). */
  roleMap?: Record<string, MuscleRoleType>;
  /** Aktív izmok (pulzáló kiemelés). */
  activeIds?: string[];
  /** Ha meg van adva, csak ezek a struktúrák kattinthatók (pl. tesztfeladatban). */
  selectableIds?: string[];
  /** Melyik izom eredése/tapadása jelenjen meg. */
  attachmentsFor?: string;
  /** Jelölt struktúra (pl. teszt visszajelzéshez). */
  markedIds?: { correct?: string[]; wrong?: string[] };
  ariaLabel: string;
  overlay?: ReactNode;
  className?: string;
  /** Kompakt mód (pl. kártya-előnézet): nincs nagyítás és tájolási felirat. */
  minimal?: boolean;
  /** Statikus nézetben a szűkebb kivágás használata. */
  focus?: boolean;
}

/** Igaz, ha a struktúra azonos a megadott azonosítóval vagy annak része (pl. izomrész). */
export const matchesStructure = (structureId: string, key: string | null | undefined) =>
  !!key && (structureId === key || structureId.startsWith(`${key}-`));

export const roleForStructure = (structureId: string, roleMap?: Record<string, MuscleRoleType>): MuscleRoleType | undefined => {
  if (!roleMap) return undefined;
  if (roleMap[structureId]) return roleMap[structureId];
  const key = Object.keys(roleMap).find((k) => matchesStructure(structureId, k));
  return key ? roleMap[key] : undefined;
};

const roleLetter: Record<MuscleRoleType, string> = { agonist: 'AG', synergist: 'SZ', antagonist: 'AN', stabilizer: 'ST' };

function AnatomyViewerImpl(props: AnatomyViewerProps) {
  const { geometry, pose, mirrorPose, layers = ALL_LAYERS, ariaLabel, overlay, className, minimal, focus } = props;
  const [vx, vy, vw, vh] = (focus && geometry.focusViewBox) || geometry.viewBox;
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState<string | null>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const transforms = useMemo(() => computeFrameTransforms(geometry.frames, pose), [geometry.frames, pose]);
  const mirrorTransforms = useMemo(
    () => computeFrameTransforms(geometry.frames, mirrorPose ?? pose),
    [geometry.frames, mirrorPose, pose]
  );

  const clampZoom = (z: number) => Math.min(4, Math.max(1, z));
  const zoomBy = useCallback((f: number) => setZoom((z) => clampZoom(z * f)), []);
  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const svgScale = () => {
    const el = svgRef.current;
    if (!el) return 1;
    const r = el.getBoundingClientRect();
    return r.width > 0 ? vw / r.width : 1;
  };

  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (zoom <= 1) return;
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, moved: false };
  };
  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    if (!d.moved) {
      d.moved = true;
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    }
    const s = svgScale() / zoom;
    setPan({ x: d.px + dx * s, y: d.py + dy * s });
  };
  const onPointerUp = () => {
    setTimeout(() => (drag.current = null), 0);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = 30 / zoom;
    if (e.key === '+' || e.key === '=') zoomBy(1.25);
    else if (e.key === '-') zoomBy(0.8);
    else if (e.key === '0') resetView();
    else if (zoom > 1 && e.key.startsWith('Arrow')) {
      e.preventDefault();
      setPan((p) => ({
        x: p.x + (e.key === 'ArrowLeft' ? step : e.key === 'ArrowRight' ? -step : 0),
        y: p.y + (e.key === 'ArrowUp' ? step : e.key === 'ArrowDown' ? -step : 0)
      }));
    }
  };

  const cx = vx + vw / 2;
  const cy = vy + vh / 2;
  const viewTransform = `translate(${cx + pan.x} ${cy + pan.y}) scale(${zoom}) translate(${-cx} ${-cy})`;
  const mirrorAxis = 300;

  return (
    <div className={`relative h-full w-full overflow-hidden rounded-2xl bg-canvas ${className ?? ''}`} onKeyDown={onKeyDown}>
      <svg
        ref={svgRef}
        viewBox={`${vx} ${vy} ${vw} ${vh}`}
        className={`h-full w-full touch-none select-none ${zoom > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
        role="img"
        aria-label={ariaLabel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={(e) => {
          if (e.ctrlKey || e.metaKey) zoomBy(e.deltaY < 0 ? 1.1 : 0.9);
        }}
      >
        <defs>
          <pattern id="pat-synergist" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="var(--an-synergist)" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
          </pattern>
          <pattern id="pat-antagonist" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="var(--an-antagonist)" />
            <circle cx="3" cy="3" r="1.1" fill="rgba(255,255,255,0.35)" />
          </pattern>
          <pattern id="pat-stabilizer" width="7" height="7" patternUnits="userSpaceOnUse">
            <rect width="7" height="7" fill="var(--an-stabilizer)" />
            <path d="M0,0 L7,7 M7,0 L0,7" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          </pattern>
        </defs>
        <g transform={viewTransform}>
          {geometry.mirrorContext && (
            <g transform={`translate(${mirrorAxis * 2} 0) scale(-1 1)`} aria-hidden="true" opacity={0.9} style={{ pointerEvents: 'none' }}>
              <Layers {...props} transforms={mirrorTransforms} layers={{ ...layers, labels: false, attachments: false, joints: false }} interactive={false} hover={null} setHover={() => undefined} />
            </g>
          )}
          <Layers {...props} transforms={transforms} layers={layers} interactive hover={hover} setHover={setHover} dragRef={drag} />
        </g>
      </svg>

      {!minimal && (
      <div className="absolute right-2 top-2 flex flex-col gap-1">
        <IconBtn label="Nagyítás" onClick={() => zoomBy(1.25)}>
          <Plus size={16} />
        </IconBtn>
        <IconBtn label="Kicsinyítés" onClick={() => zoomBy(0.8)} disabled={zoom <= 1}>
          <Minus size={16} />
        </IconBtn>
        <IconBtn label="Nézet visszaállítása" onClick={resetView} disabled={zoom === 1 && pan.x === 0 && pan.y === 0}>
          <Maximize2 size={15} />
        </IconBtn>
      </div>
      )}
      {!minimal && <OrientationLabels o={geometry.orientation} />}
      {hover && (
        <div className="pointer-events-none absolute bottom-2 left-2 rounded-lg bg-surface/90 px-2.5 py-1.5 text-xs text-ink shadow-sm ring-1 ring-line">
          <span className="font-medium">{structureName(hover).hu}</span>
          {structureName(hover).la && <span className="ml-1.5 italic text-ink-2">{structureName(hover).la}</span>}
        </div>
      )}
      {zoom > 1 && <div className="pointer-events-none absolute bottom-2 right-2 rounded bg-surface/80 px-2 py-0.5 text-[11px] text-ink-2">{Math.round(zoom * 100)}% · húzással pásztázható</div>}
      {overlay}
    </div>
  );
}

function OrientationLabels({ o }: { o: ViewGeometry['orientation'] }) {
  return (
    <>
      <span className="pointer-events-none absolute left-1/2 top-1.5 -translate-x-1/2 text-[10px] uppercase tracking-wider text-ink-2/80">{o.top}</span>
      <span className="pointer-events-none absolute bottom-1.5 left-1/2 hidden -translate-x-1/2 text-[10px] uppercase tracking-wider text-ink-2/80 sm:block">{o.bottom}</span>
      <span className="pointer-events-none absolute left-2 top-1/2 hidden max-w-24 -translate-y-1/2 text-[10px] uppercase leading-tight tracking-wider text-ink-2/80 md:block">{o.left}</span>
    </>
  );
}

function IconBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-8 w-8 place-items-center rounded-lg bg-surface/90 text-ink ring-1 ring-line transition hover:bg-bg-2 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

interface LayersProps extends AnatomyViewerProps {
  transforms: Record<string, Matrix>;
  layers: Record<LayerId, boolean>;
  interactive: boolean;
  hover: string | null;
  setHover: (id: string | null) => void;
  dragRef?: React.RefObject<{ moved: boolean } | null>;
}

function Layers(p: LayersProps) {
  const { geometry, transforms, layers, selectedId, isolate, roleMap, activeIds, selectableIds, attachmentsFor, markedIds, interactive, hover, setHover, onSelect, dragRef } = p;

  const canSelect = (id: string) => interactive && !!onSelect && (!selectableIds || selectableIds.includes(id));
  const handle = (id: string) => () => {
    if (dragRef?.current?.moved) return;
    if (canSelect(id)) onSelect?.(id);
  };
  const a11y = (id: string) =>
    canSelect(id)
      ? {
          tabIndex: 0,
          role: 'button',
          'aria-label': structureName(id).hu,
          onClick: handle(id),
          onKeyDown: (e: KeyboardEvent<SVGElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handle(id)();
            }
          },
          onPointerEnter: () => setHover(id),
          onPointerLeave: () => setHover(null),
          onFocus: () => setHover(id),
          onBlur: () => setHover(null)
        }
      : {};

  const selectedIsMuscle = !!selectedId && selectedId.startsWith('muscle-');
  const muscles = [...geometry.muscles].sort((a, b) => a.z - b.z);

  const boneClass = (id: string, base: string) => {
    const marked = markedIds?.correct?.includes(id) ? ' is-selected' : '';
    return `${base}${matchesStructure(id, selectedId) && !selectedIsMuscle ? ' is-selected' : ''}${marked}${canSelect(id) ? ' an-clickable' : ''}`;
  };

  const renderBones = () =>
    geometry.bones.map((b, i) => {
      const t = transforms[b.frame];
      if (!t) return null;
      const cls = b.stroke ? (b.variant === 'cartilage' ? 'an-cartilage-line' : 'an-bone-line') : 'an-bone';
      return (
        <g key={`${b.structureId}-${i}`} transform={matrixToSvg(t)} id={interactive && i === geometry.bones.findIndex((x) => x.structureId === b.structureId) ? b.structureId : undefined}>
          <path d={b.d} className={boneClass(b.structureId, cls)} strokeWidth={b.stroke} {...a11y(b.structureId)}>
            <title>{structureName(b.structureId).hu}</title>
          </path>
        </g>
      );
    });

  const renderMuscle = (m: (typeof muscles)[number]) => {
    if (!layers[m.layer]) return null;
    const selected = matchesStructure(m.structureId, selectedId);
    const role = roleForStructure(m.structureId, roleMap);
    if (isolate && selectedIsMuscle && !selected && !role) return null;
    const pts = m.outline.map((pt) => toWorld(pt, transforms));
    const d = smoothClosedPath(pts);
    const dim = (selectedIsMuscle && !selected && !role) || (!!roleMap && !role && !selected);
    const active = activeIds?.some((a) => matchesStructure(m.structureId, a));
    const isMarkedCorrect = markedIds?.correct?.includes(m.structureId);
    const isMarkedWrong = markedIds?.wrong?.includes(m.structureId);
    const cls = [
      'an-muscle',
      dim && 'is-dim',
      selected && !roleMap && 'is-selected',
      role && `role-${role}`,
      selected && roleMap && 'is-selected',
      active && 'is-active',
      hover === m.structureId && 'is-hover',
      isMarkedCorrect && 'is-selected',
      canSelect(m.structureId) && 'an-clickable'
    ]
      .filter(Boolean)
      .join(' ');
    const fill = role === 'synergist' ? 'url(#pat-synergist)' : role === 'antagonist' ? 'url(#pat-antagonist)' : role === 'stabilizer' ? 'url(#pat-stabilizer)' : undefined;
    const clipId = `clip-${m.structureId}-${interactive ? 'a' : 'm'}`;
    return (
      <g key={m.structureId} id={interactive ? m.structureId : undefined} data-structure={m.structureId}>
        <clipPath id={clipId}>
          <path d={d} />
        </clipPath>
        <path d={d} className={cls} style={fill ? { fill } : undefined} {...a11y(m.structureId)} stroke={isMarkedWrong ? '#e05a5a' : undefined} strokeWidth={isMarkedWrong ? 3 : undefined}>
          <title>{structureName(m.structureId).hu}</title>
        </path>
        <g clipPath={`url(#${clipId})`}>
          {m.fibers.map(([a, b], i) => {
            const pa = toWorld(a, transforms);
            const pb = toWorld(b, transforms);
            return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} className="an-fiber" />;
          })}
        </g>
      </g>
    );
  };

  const renderAttachments = () =>
    geometry.attachments
      .filter((a) => matchesStructure(a.structureId, attachmentsFor ?? null))
      .filter((a) => !selectedIsMuscle || matchesStructure(a.structureId, selectedId) || matchesStructure(selectedId!, a.structureId))
      .map((a, i) => {
        const pts = a.points.map((pt) => toWorld(pt, transforms));
        const color = a.type === 'origin' ? 'var(--an-origin)' : 'var(--an-insertion)';
        const first = pts[0]!;
        const letter = a.type === 'origin' ? 'E' : 'T';
        const badge = a.type === 'origin' ? pts[Math.floor(pts.length / 2)]! : first;
        const dx = a.type === 'origin' ? 0 : -14;
        return (
          <g key={`${a.structureId}-${a.type}-${i}`} aria-label={`${structureName(a.structureId).hu} – ${a.type === 'origin' ? 'eredés' : 'tapadás'}`}>
            {a.extent === 'area' ? (
              <polygon points={pts.map((q) => `${q.x},${q.y}`).join(' ')} fill={color} fillOpacity={0.45} stroke={color} strokeWidth={1.5} />
            ) : (
              <polyline
                points={pts.map((q) => `${q.x},${q.y}`).join(' ')}
                fill="none"
                stroke={color}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={a.type === 'insertion' ? '5 3' : undefined}
                opacity={0.95}
              />
            )}
            <g transform={`translate(${badge.x + dx} ${badge.y - 4})`}>
              <circle r={7} fill={color} stroke="var(--an-canvas)" strokeWidth={1.5} />
              <text textAnchor="middle" dy={3.5} fontSize={9} fontWeight={700} fill="#fff">
                {letter}
              </text>
            </g>
          </g>
        );
      });

  const renderLabels = () =>
    muscles
      .filter((m) => m.label && layers[m.layer])
      .filter((m) => m.layer !== 'deep-muscles' || !layers['superficial-muscles'] || (isolate && matchesStructure(m.structureId, selectedId)))
      .filter((m) => !isolate || !selectedIsMuscle || matchesStructure(m.structureId, selectedId))
      .map((m) => {
        const at = toWorld(m.label!.at, transforms);
        const role = roleForStructure(m.structureId, roleMap);
        return (
          <text key={`lbl-${m.structureId}`} x={at.x} y={at.y} textAnchor="middle" className="an-label">
            {m.label!.text}
            {role ? ` (${roleLetter[role]})` : ''}
          </text>
        );
      });

  const renderJoints = () =>
    geometry.joints.map((j) => {
      const at = toWorld(j.at, transforms);
      return (
        <g key={j.structureId} transform={`translate(${at.x} ${at.y})`} id={interactive ? j.structureId : undefined}>
          <circle r={5} fill="none" stroke="var(--an-joint)" strokeWidth={1.5} strokeDasharray="2 1.5" />
          <circle r={1.6} fill="var(--an-joint)" />
          <title>{structureName(j.structureId).hu}</title>
        </g>
      );
    });

  const deep = muscles.filter((m) => m.layer === 'deep-muscles');
  const superficial = muscles.filter((m) => m.layer === 'superficial-muscles');

  return (
    <>
      {layers.bones && <g data-layer="bones">{renderBones()}</g>}
      <g data-layer="deep-muscles">{deep.map(renderMuscle)}</g>
      <g data-layer="superficial-muscles">{superficial.map(renderMuscle)}</g>
      {layers.joints && <g data-layer="joints">{renderJoints()}</g>}
      {layers.attachments && attachmentsFor && <g data-layer="attachments">{renderAttachments()}</g>}
      {layers.labels && <g data-layer="labels">{renderLabels()}</g>}
    </>
  );
}

export const AnatomyViewer = memo(AnatomyViewerImpl);
