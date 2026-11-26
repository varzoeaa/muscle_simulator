import { Pause, Play, RotateCcw, Rewind } from 'lucide-react';
import type { AnimationSpeed, AnimationState } from '../../types';
import { SPEEDS } from '../../engines/animation/animationEngine';
import { Segmented } from '../ui';

interface Props {
  state: AnimationState;
  onPlay: () => void;
  onPause: () => void;
  onRewind: () => void;
  onReset: () => void;
  onSeek: (p: number) => void;
  onSpeed: (s: AnimationSpeed) => void;
  playLabel?: string;
  timelineLabel?: string;
}

const fmtSpeed = (s: number) => `${String(s).replace('.', ',')}×`;

export function AnimationControls({ state, onPlay, onPause, onRewind, onReset, onSeek, onSpeed, playLabel = 'Lejátszás', timelineLabel = 'Idővonal' }: Props) {
  const [lo, hi] = state.range;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {state.playing ? (
          <CtrlBtn label="Szüneteltetés" onClick={onPause} primary>
            <Pause size={16} /> Szünet
          </CtrlBtn>
        ) : (
          <CtrlBtn label={playLabel} onClick={onPlay} primary>
            <Play size={16} /> {playLabel}
          </CtrlBtn>
        )}
        <CtrlBtn label="Visszatekerés (lejátszás visszafelé)" onClick={onRewind}>
          <Rewind size={16} /> Vissza
        </CtrlBtn>
        <CtrlBtn label="Kiinduló helyzet visszaállítása" onClick={onReset}>
          <RotateCcw size={16} /> Alaphelyzet
        </CtrlBtn>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="timeline" className="flex justify-between text-xs text-ink-2">
          <span>{timelineLabel}</span>
          <span className="font-mono">{Math.round(state.progress * 100)}%</span>
        </label>
        <input
          id="timeline"
          type="range"
          min={lo}
          max={hi}
          step={0.001}
          value={state.progress}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-valuetext={`${Math.round(state.progress * 100)} százalék`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-ink-2">Sebesség</span>
        <Segmented<AnimationSpeed> size="sm" label="Lejátszási sebesség" value={state.speed} onChange={onSpeed} options={SPEEDS.map((s) => ({ value: s, label: fmtSpeed(s) }))} />
      </div>
    </div>
  );
}

function CtrlBtn({ label, onClick, children, primary }: { label: string; onClick: () => void; children: React.ReactNode; primary?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition ${primary ? 'bg-accent text-white hover:brightness-110' : 'border border-line text-ink hover:bg-bg-2'}`}
    >
      {children}
    </button>
  );
}
