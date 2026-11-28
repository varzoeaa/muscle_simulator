import { useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { ChevronRight, RefreshCcw, Trash2 } from 'lucide-react';
import type { ExamResult, Muscle, QuestionTopic, StudyAnswer, StudyQuestion } from '../../types';
import { flashcardsForMuscle, questionsForMuscle, topicLabels } from '../../data/questions';
import { buildExam, evaluation, gradeAnswer, score, wrongQuestions } from '../../engines/study/studyEngine';
import { useStudyStore } from '../../stores/studyStore';
import { Button, ModulePending, Panel, Segmented, SourceRefs } from '../../components/ui';
import { QuestionView, correctAnswerText } from './QuestionView';
import { FlashcardDeck } from '../../components/study/FlashcardDeck';
import { isPersistentStorageAvailable } from '../../services/storage';

type Tab = 'cards' | 'practice' | 'exam' | 'results';

export function StudyMode() {
  const { muscle } = useOutletContext<{ muscle: Muscle }>();
  if (!questionsForMuscle(muscle.id).length && !flashcardsForMuscle(muscle.id).length) return <ModulePending name={muscle.name.hu} what="tanulókártyái és feladatai" />;
  return <StudyModeContent muscle={muscle} />;
}


function StudyModeContent({ muscle }: { muscle: Muscle }) {
  const { slug } = useParams();
  const musclePath = `/izom/${slug}`;
  const [tab, setTab] = useState<Tab>('cards');
  const [practiceSeed, setPracticeSeed] = useState<{ ids?: string[]; key: number }>({ key: 0 });
  const pool = useMemo(() => questionsForMuscle(muscle.id), [muscle.id]);
  const persistent = isPersistentStorageAvailable();

  const practiceWrong = (ids: string[]) => {
    setPracticeSeed((s) => ({ ids, key: s.key + 1 }));
    setTab('practice');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-ink">Tanulás</h1>
          <p className="text-xs text-ink-2">Kártyák, gyakorlás és vizsga ellenőrzött, előre elkészített kérdésekből</p>
        </div>
        <Segmented<Tab>
          label="Tanulási mód"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'cards', label: 'Tanulókártyák' },
            { value: 'practice', label: 'Gyakorlás' },
            { value: 'exam', label: 'Vizsgamód' },
            { value: 'results', label: 'Eredmények' }
          ]}
        />
      </div>
      {!persistent && <p className="rounded-xl bg-bg-2 p-2 text-xs text-ink-2">A böngésző helyi tárolója nem érhető el – az eredmények csak a munkamenet végéig maradnak meg.</p>}
      {tab === 'cards' && <Flashcards muscleId={muscle.id} />}
      {tab === 'practice' && <Practice key={practiceSeed.key} pool={pool} onlyIds={practiceSeed.ids} musclePath={musclePath} />}
      {tab === 'exam' && <Exam pool={pool} muscleId={muscle.id} musclePath={musclePath} onPracticeWrong={practiceWrong} />}
      {tab === 'results' && <Results pool={pool} onPracticeWrong={practiceWrong} />}
    </div>
  );
}

/* ---------------- Tanulókártyák ---------------- */

function Flashcards({ muscleId }: { muscleId: string }) {
  const cards = flashcardsForMuscle(muscleId);
  const mark = useStudyStore((s) => s.markFlashcardSeen);
  const seen = useStudyStore((s) => s.progress.flashcardsSeen);
  if (!cards.length) return <p className="text-sm text-ink-2">Nincs tanulókártya.</p>;
  return (
    <FlashcardDeck
      cards={cards.map((c) => ({ id: c.id, label: topicLabels[c.topic], front: c.front, back: c.back, footer: <SourceRefs ids={c.sourceIds} /> }))}
      onFlip={mark}
      counterExtra={` · megtekintve: ${Object.keys(seen).filter((k) => cards.some((c) => c.id === k)).length}`}
    />
  );
}

/* ---------------- Gyakorlás (azonnali visszajelzés) ---------------- */

function Practice({ pool, onlyIds, musclePath }: { pool: StudyQuestion[]; onlyIds?: string[]; musclePath: string }) {
  const progress = useStudyStore((s) => s.progress);
  const answer = useStudyStore((s) => s.answer);
  const [wrongOnly, setWrongOnly] = useState(!!onlyIds);
  const [topic, setTopic] = useState<QuestionTopic | 'all'>('all');
  // A kérdéslista a mód indításakor rögzül, hogy válaszadás közben ne változzon.
  const [list, setList] = useState<StudyQuestion[]>(() => (onlyIds ? pool.filter((q) => onlyIds.includes(q.id)) : pool));
  const [idx, setIdx] = useState(0);
  const [submitted, setSubmitted] = useState<StudyAnswer | null>(null);
  const [session, setSession] = useState({ correct: 0, total: 0 });
  const topics = [...new Set(pool.map((q) => q.topic))];

  const rebuild = (wo: boolean, t: QuestionTopic | 'all') => {
    let l = wo ? wrongQuestions(pool, progress) : pool;
    if (t !== 'all') l = l.filter((q) => q.topic === t);
    setList(l);
    setIdx(0);
    setSubmitted(null);
  };

  const q = list[idx];
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <Panel>
        {q ? (
          <>
            <QuestionView
              key={`${q.id}-${idx}`}
              question={q}
              feedback
              submitted={submitted}
              musclePath={musclePath}
              onSubmit={(a, correct) => {
                setSubmitted(a);
                answer(q.id, correct);
                setSession((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
              }}
            />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-ink-2">
                {idx + 1} / {list.length}
              </span>
              <Button
                disabled={!submitted}
                onClick={() => {
                  setSubmitted(null);
                  setIdx((i) => i + 1);
                }}
              >
                {idx + 1 < list.length ? 'Következő kérdés' : 'Befejezés'} <ChevronRight size={16} />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-ink">{list.length === 0 ? (wrongOnly ? 'Nincs ismétlendő (hibásan megválaszolt) kérdés. Szép munka!' : 'Nincs kérdés ebben a témakörben.') : 'A kérdéssor végére értél.'}</p>
            {session.total > 0 && (
              <p className="text-sm text-ink-2">
                Ebben a körben: {session.correct} / {session.total} helyes.
              </p>
            )}
            <Button variant="outline" onClick={() => rebuild(wrongOnly, topic)}>
              <RefreshCcw size={15} /> Újrakezdés
            </Button>
          </div>
        )}
      </Panel>
      <Panel title="Beállítások">
        <label className="flex flex-col gap-1 text-xs text-ink-2">
          Témakör
          <select
            value={topic}
            onChange={(e) => {
              const t = e.target.value as QuestionTopic | 'all';
              setTopic(t);
              rebuild(wrongOnly, t);
            }}
            className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink"
          >
            <option value="all">Minden témakör</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {topicLabels[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-3 flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={wrongOnly}
            onChange={(e) => {
              setWrongOnly(e.target.checked);
              rebuild(e.target.checked, topic);
            }}
          />
          Csak a korábban elrontott kérdések ({wrongQuestions(pool, progress).length})
        </label>
        <p className="mt-3 text-xs text-ink-2">A helyes válasz után a kérdés lekerül az ismétlendők listájáról.</p>
      </Panel>
    </div>
  );
}

/* ---------------- Vizsgamód ---------------- */

function Exam({ pool, muscleId, musclePath, onPracticeWrong }: { pool: StudyQuestion[]; muscleId: string; musclePath: string; onPracticeWrong: (ids: string[]) => void }) {
  const finishExam = useStudyStore((s) => s.finishExam);
  const topics = [...new Set(pool.map((q) => q.topic))];
  const [selTopics, setSelTopics] = useState<QuestionTopic[]>([]);
  const [count, setCount] = useState(Math.min(10, pool.length));
  const [exam, setExam] = useState<StudyQuestion[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<{ q: StudyQuestion; a: StudyAnswer; correct: boolean }[]>([]);
  const [current, setCurrent] = useState<StudyAnswer | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const available = selTopics.length ? pool.filter((q) => selTopics.includes(q.topic)).length : pool.length;

  const start = () => {
    setExam(buildExam(pool, { topics: selTopics, count: Math.min(count, available) }));
    setIdx(0);
    setAnswers([]);
    setCurrent(null);
    setResult(null);
  };

  if (result && exam) {
    const wrongIds = answers.filter((x) => !x.correct).map((x) => x.q.id);
    return (
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Panel title="Vizsga eredménye">
          <div className="font-serif text-5xl text-highlight">{result.percent}%</div>
          <p className="mt-1 text-sm text-ink">
            {result.correct} / {result.total} helyes válasz
          </p>
          <p className="mt-3 text-sm text-ink-2">{evaluation(result.percent)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={start}>
              <RefreshCcw size={15} /> Új vizsga
            </Button>
            <Button variant="outline" disabled={!wrongIds.length} onClick={() => onPracticeWrong(wrongIds)}>
              Hibás kérdések gyakorlása
            </Button>
          </div>
        </Panel>
        <Panel title="Válaszok áttekintése">
          <ol className="flex flex-col gap-2">
            {answers.map(({ q, correct }, i) => (
              <li key={q.id} className={`rounded-xl border p-3 text-sm ${correct ? 'border-emerald-500/50' : 'border-red-500/50'}`}>
                <div className="font-medium text-ink">
                  {i + 1}. {q.prompt} – {correct ? 'helyes' : 'hibás'}
                </div>
                {!correct && <div className="mt-1 text-ink">Helyes válasz: {correctAnswerText(q)}</div>}
                <div className="mt-1 text-ink-2">{q.explanation}</div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    );
  }

  if (exam) {
    const q = exam[idx]!;
    return (
      <Panel title={`Vizsga – ${idx + 1}. kérdés / ${exam.length}`} subtitle="Vizsgamódban a visszajelzés a végén jelenik meg.">
        <QuestionView key={q.id} question={q} feedback={false} submitted={current} musclePath={musclePath} onSubmit={(a) => setCurrent(a)} />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setExam(null)}>
            Vizsga megszakítása
          </Button>
          <Button
            disabled={!current}
            onClick={() => {
              if (!current) return;
              const correct = gradeAnswer(q, current);
              const next = [...answers, { q, a: current, correct }];
              setAnswers(next);
              setCurrent(null);
              if (idx + 1 < exam.length) setIdx(idx + 1);
              else {
                const s = score(next);
                const r: ExamResult = {
                  id: `exam-${Date.now()}`,
                  muscleId,
                  topics: selTopics,
                  total: s.total,
                  correct: s.correct,
                  percent: s.percent,
                  finishedAt: new Date().toISOString(),
                  answers: next.map((x) => ({ questionId: x.q.id, correct: x.correct }))
                };
                finishExam(r);
                setResult(r);
              }
            }}
          >
            {idx + 1 < exam.length ? 'Következő' : 'Vizsga befejezése'} <ChevronRight size={16} />
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <Panel title="Vizsga összeállítása">
      <fieldset>
        <legend className="mb-2 text-xs text-ink-2">Témakörök (ha egyet sem választasz, minden témakör szerepel)</legend>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => {
            const on = selTopics.includes(t);
            return (
              <button key={t} type="button" aria-pressed={on} onClick={() => setSelTopics((s) => (on ? s.filter((x) => x !== t) : [...s, t]))} className={`rounded-full border px-3 py-1 text-sm ${on ? 'border-accent-2 bg-accent/20 text-ink' : 'border-line text-ink-2'}`}>
                {topicLabels[t]}
              </button>
            );
          })}
        </div>
      </fieldset>
      <label className="mt-4 flex max-w-xs flex-col gap-1 text-xs text-ink-2">
        Kérdések száma (elérhető: {available})
        <input type="number" min={1} max={available} value={Math.min(count, available)} onChange={(e) => setCount(Math.max(1, Number(e.target.value) || 1))} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink" />
      </label>
      <p className="mt-3 text-xs text-ink-2">A kérdések sorrendje véletlenszerű. Az eredmény és a hibás válaszok helyben, a böngésződben tárolódnak.</p>
      <div className="mt-4">
        <Button disabled={available === 0} onClick={start}>
          Vizsga indítása
        </Button>
      </div>
    </Panel>
  );
}


/* ---------------- Eredmények ---------------- */

function Results({ pool, onPracticeWrong }: { pool: StudyQuestion[]; onPracticeWrong: (ids: string[]) => void }) {
  const progress = useStudyStore((s) => s.progress);
  const clearAll = useStudyStore((s) => s.clearAll);
  const [confirm, setConfirm] = useState(false);
  const wrong = wrongQuestions(pool, progress);
  const answered = pool.filter((q) => progress.questions[q.id]);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Előrehaladás">
        <ul className="flex flex-col gap-1 text-sm text-ink">
          <li>Megválaszolt kérdések: {answered.length} / {pool.length}</li>
          <li>Ismétlendő (legutóbb hibás) kérdések: {wrong.length}</li>
          <li>Befejezett vizsgák: {progress.exams.length}</li>
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" disabled={!wrong.length} onClick={() => onPracticeWrong(wrong.map((q) => q.id))}>
            Elrontott kérdések ismétlése
          </Button>
        </div>
      </Panel>
      <Panel title="Korábbi vizsgák">
        {progress.exams.length === 0 ? (
          <p className="text-sm text-ink-2">Még nincs befejezett vizsga.</p>
        ) : (
          <ul className="flex flex-col gap-1.5 text-sm">
            {progress.exams.slice(0, 10).map((e) => (
              <li key={e.id} className="flex justify-between rounded-lg bg-bg-2/50 px-3 py-1.5">
                <span className="text-ink-2">{new Date(e.finishedAt).toLocaleString('hu-HU')}</span>
                <span className="font-medium text-ink">
                  {e.correct}/{e.total} · {e.percent}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel title="Helyi adatok törlése" className="lg:col-span-2">
        <p className="text-sm text-ink-2">A tanulási előrehaladás, a vizsgaeredmények és a hibás válaszok listája kizárólag ebben a böngészőben tárolódik. A törlés nem vonható vissza.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {confirm ? (
            <>
              <Button
                onClick={() => {
                  clearAll();
                  setConfirm(false);
                }}
              >
                <Trash2 size={15} /> Igen, törlöm a tanulási adatokat
              </Button>
              <Button variant="ghost" onClick={() => setConfirm(false)}>
                Mégse
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setConfirm(true)}>
              <Trash2 size={15} /> Tanulási adatok törlése
            </Button>
          )}
        </div>
      </Panel>
    </div>
  );
}
