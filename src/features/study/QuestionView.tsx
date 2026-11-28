import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { StudyAnswer, StudyQuestion } from '../../types';
import { gradeAnswer, shuffle } from '../../engines/study/studyEngine';
import { AnatomyViewer, ALL_LAYERS, matchesStructure } from '../../components/anatomy/AnatomyViewer';
import { restPoses, viewGeometries } from '../../data/geometry';
import { muscleById, structureById, structureName } from '../../data/muscles';

/** Izomrésznél a teljes izom azonosítója. */
const parentMuscleId = (id: string): string | undefined => {
  const s = structureById(id) as { kind?: string; muscleId?: string } | undefined;
  return s?.kind === 'muscle-region' ? s.muscleId : undefined;
};

/** Ábrás feladatnál a kattintott elem neve; izomrésznél az izom nevével együtt (pl. „Elülső fűrészizom – alsó rész”). */
export function diagramName(id: string): string {
  const parent = parentMuscleId(id);
  const s = structureById(id);
  if (parent && s) return `${structureName(parent).hu} – ${s.name.hu.charAt(0).toLowerCase()}${s.name.hu.slice(1)}`;
  return structureName(id).hu;
}

/** A helyes válasz(ok) neve; ha egy izom minden része elfogadott, csak az izom neve. */
function diagramAnswerText(ids: string[]): string {
  const parents = new Set(ids.map(parentMuscleId));
  const parent = parents.size === 1 ? [...parents][0] : undefined;
  if (parent && muscleById(parent)?.regions.every((r) => ids.includes(r.id))) return structureName(parent).hu;
  return ids.map(diagramName).join(' vagy ');
}
import { Button, SourceRefs } from '../../components/ui';
import { topicLabels } from '../../data/questions';

interface Props {
  question: StudyQuestion;
  /** Azonnali visszajelzés (tanulási mód) vagy csak rögzítés (vizsgamód). */
  feedback: boolean;
  onSubmit: (answer: StudyAnswer, correct: boolean) => void;
  submitted?: StudyAnswer | null;
  musclePath: string;
}

export function QuestionView({ question, feedback, onSubmit, submitted, musclePath }: Props) {
  const done = !!submitted;
  const correct = submitted ? gradeAnswer(question, submitted) : false;
  const submit = (a: StudyAnswer) => {
    if (!done) onSubmit(a, gradeAnswer(question, a));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-ink-2">
        <span className="rounded-full bg-bg-2 px-2 py-0.5">{topicLabels[question.topic]}</span>
        <span>{typeLabel[question.type]}</span>
      </div>
      <h3 className="text-base font-medium leading-snug text-ink">{question.prompt}</h3>
      {question.type === 'multiple-choice' && <MC q={question} submitted={submitted} feedback={feedback} onSubmit={submit} />}
      {question.type === 'fill-blank' && <FillBlank q={question} submitted={submitted} feedback={feedback} onSubmit={submit} />}
      {question.type === 'matching' && <Matching q={question} submitted={submitted} feedback={feedback} onSubmit={submit} />}
      {question.type === 'diagram-identify' && <Diagram q={question} submitted={submitted} feedback={feedback} onSubmit={submit} />}

      {done && feedback && (
        <div className={`rounded-xl border p-3 text-sm ${correct ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-red-500/50 bg-red-500/10'}`} role="status">
          <div className="flex items-center gap-2 font-medium text-ink">
            {correct ? <CheckCircle2 size={18} className="text-emerald-500" /> : <XCircle size={18} className="text-red-500" />}
            {correct ? 'Helyes válasz!' : 'Hibás válasz.'}
          </div>
          {!correct && <p className="mt-1 text-ink">Helyes válasz: {correctAnswerText(question)}</p>}
          <p className="mt-1 leading-relaxed text-ink-2">{question.explanation}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <SourceRefs ids={question.sourceIds} />
            {question.relatedPath && (
              <Link to={`${musclePath}/${question.relatedPath}`} className="text-xs text-accent-2 underline">
                Kapcsolódó tananyag megnyitása
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const typeLabel: Record<StudyQuestion['type'], string> = {
  'multiple-choice': 'Feleletválasztós',
  'fill-blank': 'Hiányos szöveg',
  matching: 'Párosítás',
  'diagram-identify': 'Jelölés az ábrán'
};

export function correctAnswerText(q: StudyQuestion): string {
  switch (q.type) {
    case 'multiple-choice':
      return q.options.find((o) => o.id === q.correctOptionId)?.text ?? '';
    case 'fill-blank':
      return q.answer;
    case 'matching':
      return q.pairs.map((p) => `${p.left} → ${p.right}`).join('; ');
    case 'diagram-identify':
      return diagramAnswerText(q.correctStructureIds);
  }
}

type Sub<T extends StudyQuestion> = { q: T; submitted?: StudyAnswer | null; feedback: boolean; onSubmit: (a: StudyAnswer) => void };

function optionClass(state: 'idle' | 'picked' | 'right' | 'wrong') {
  return {
    idle: 'border-line hover:bg-bg-2',
    picked: 'border-accent-2 bg-accent/20',
    right: 'border-emerald-500 bg-emerald-500/10',
    wrong: 'border-red-500 bg-red-500/10'
  }[state];
}

function MC({ q, submitted, feedback, onSubmit }: Sub<Extract<StudyQuestion, { type: 'multiple-choice' }>>) {
  const picked = submitted?.type === 'multiple-choice' ? submitted.optionId : null;
  // A válaszlehetőségek sorrendje kérdésenként véletlenszerű (a helyes válasz helye ne legyen megjegyezhető).
  const options = useMemo(() => shuffle(q.options), [q]);
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => {
        const state = !picked ? 'idle' : feedback && o.id === q.correctOptionId ? 'right' : o.id === picked ? (feedback ? 'wrong' : 'picked') : 'idle';
        return (
          <button key={o.id} type="button" disabled={!!picked} onClick={() => onSubmit({ type: 'multiple-choice', optionId: o.id })} className={`rounded-xl border px-3 py-2.5 text-left text-sm text-ink transition ${optionClass(state)}`}>
            {o.text}
          </button>
        );
      })}
    </div>
  );
}

function FillBlank({ q, submitted, feedback, onSubmit }: Sub<Extract<StudyQuestion, { type: 'fill-blank' }>>) {
  const [value, setValue] = useState<string | null>(null);
  const done = submitted?.type === 'fill-blank';
  const shown = done ? submitted.value : value;
  const [before, after] = q.text.split('___');
  const options = useMemo(() => shuffle(q.options), [q]);
  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-xl bg-bg-2/60 p-3 text-sm leading-relaxed text-ink">
        {before}
        <span className={`mx-1 inline-block min-w-16 border-b-2 px-1 text-center font-medium ${done && feedback ? (shown === q.answer ? 'border-emerald-500' : 'border-red-500') : 'border-accent-2'}`}>{shown ?? '…'}</span>
        {after}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" disabled={done} aria-pressed={value === o} onClick={() => setValue(o)} className={`rounded-full border px-3 py-1 text-sm ${value === o ? 'border-accent-2 bg-accent/20 text-ink' : 'border-line text-ink'}`}>
            {o}
          </button>
        ))}
      </div>
      {!done && (
        <div>
          <Button disabled={!value} onClick={() => value && onSubmit({ type: 'fill-blank', value })}>
            Válasz rögzítése
          </Button>
        </div>
      )}
    </div>
  );
}

function Matching({ q, submitted, feedback, onSubmit }: Sub<Extract<StudyQuestion, { type: 'matching' }>>) {
  // Az azonos szövegű jobb oldali elemek csak egyszer szerepelnek a listában.
  const rights = useMemo(() => shuffle(q.pairs.filter((p, i) => q.pairs.findIndex((x) => x.right === p.right) === i).map((p) => ({ id: p.id, text: p.right }))), [q]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const done = submitted?.type === 'matching';
  const shown = done ? submitted.mapping : mapping;
  const complete = q.pairs.every((p) => shown[p.id]);
  return (
    <div className="flex flex-col gap-2">
      {q.pairs.map((p) => {
        const ok = q.pairs.find((x) => x.id === shown[p.id])?.right === p.right;
        return (
          <div key={p.id} className={`grid items-center gap-2 rounded-xl border p-2 sm:grid-cols-[1fr_1.4fr] ${done && feedback ? (ok ? 'border-emerald-500' : 'border-red-500') : 'border-line'}`}>
            <span className="text-sm font-medium text-ink">{p.left}</span>
            <select
              aria-label={`Pár: ${p.left}`}
              disabled={done}
              value={shown[p.id] ?? ''}
              onChange={(e) => setMapping((m) => ({ ...m, [p.id]: e.target.value }))}
              className="rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink"
            >
              <option value="">– válassz –</option>
              {rights.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.text}
                </option>
              ))}
            </select>
          </div>
        );
      })}
      {!done && (
        <div>
          <Button disabled={!complete} onClick={() => onSubmit({ type: 'matching', mapping })}>
            Válasz rögzítése
          </Button>
        </div>
      )}
    </div>
  );
}

function Diagram({ q, submitted, feedback, onSubmit }: Sub<Extract<StudyQuestion, { type: 'diagram-identify' }>>) {
  const [picked, setPicked] = useState<string | null>(null);
  const done = submitted?.type === 'diagram-identify';
  const shown = done ? submitted.structureId : picked;
  const boneTask = q.task !== 'muscle';
  const geometry = viewGeometries[q.viewId]!;
  // Mély izomra kérdező feladat: a mély réteg látszik, a felületes izmok áttetszők.
  const deepTask = !boneTask && q.selectableStructureIds.some((id) => geometry.muscles.some((m) => m.layer === 'deep-muscles' && m.structureId === id));
  // Más izmok által takart izom (pl. elülső fűrészizom): a fölötte fekvő izmok áttetszők, maga felülre kerül.
  const revealShape = !boneTask && !deepTask ? geometry.muscles.find((m) => m.revealOnSelect && q.selectableStructureIds.some((id) => matchesStructure(m.structureId, id))) : undefined;
  const revealId = revealShape ? (parentMuscleId(revealShape.structureId) ?? revealShape.structureId) : undefined;
  return (
    <div className="flex flex-col gap-2">
      <div className="h-[42vh] min-h-[280px]">
        <AnatomyViewer
            focus
          geometry={geometry}
          pose={restPoses[q.viewId]}
          selectedId={shown}
          onSelect={done ? undefined : setPicked}
          selectableIds={q.selectableStructureIds}
          layers={{ ...ALL_LAYERS, labels: false, attachments: false, 'superficial-muscles': !boneTask, 'deep-muscles': deepTask }}
          ghostSuperficial={deepTask}
          revealId={revealId}
          markedIds={done && feedback ? { correct: q.correctStructureIds, wrong: shown && !q.correctStructureIds.includes(shown) ? [shown] : [] } : undefined}
          ariaLabel="Tesztfeladat ábrája – kattints a megfelelő struktúrára"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-ink-2">Kijelölve: <b className="text-ink">{shown ? diagramName(shown) : '–'}</b></span>
        {!done && (
          <Button disabled={!picked} onClick={() => picked && onSubmit({ type: 'diagram-identify', structureId: picked })}>
            Válasz rögzítése
          </Button>
        )}
      </div>
      {boneTask && <p className="text-xs text-ink-2">Ennél a feladatnál az izmok rejtve vannak, hogy a csontok jól láthatók legyenek.</p>}
      {revealId && <p className="text-xs text-ink-2">Ennél a feladatnál a takaró izmok áttetszők, hogy a(z) {structureName(revealId).hu.toLowerCase()} is látható legyen.</p>}
      {deepTask && <p className="text-xs text-ink-2">Ennél a feladatnál a felületes izmok áttetszők, hogy a mélyebb réteg is látható legyen.</p>}
    </div>
  );
}
