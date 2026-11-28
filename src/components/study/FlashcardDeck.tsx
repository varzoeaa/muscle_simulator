import { useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { Button } from '../ui';

export interface DeckCard {
  id: string;
  /** Kis felirat a kártya tetején (pl. témakör). */
  label?: string;
  front: string;
  back: ReactNode;
  /** A hátoldal alatt, a kártya gombján kívül megjelenő tartalom (pl. forrásgombok). */
  footer?: ReactNode;
}

/**
 * Tanulókártya-pakli: fordítás, előző/következő, számláló. A szövegek sima szövegként jelennek meg.
 * A szülő a `key` megváltoztatásával (pl. szűrőváltáskor) az első kártyára állíthatja vissza.
 */
export function FlashcardDeck({ cards, onFlip, counterExtra }: { cards: DeckCard[]; onFlip?: (id: string) => void; counterExtra?: ReactNode }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const index = cards.length ? Math.min(i, cards.length - 1) : 0;
  const card = cards[index];
  if (!card) return null;
  const go = (d: number) => {
    setFlipped(false);
    setI((x) => (Math.min(x, cards.length - 1) + d + cards.length) % cards.length);
  };
  const flip = () => {
    if (!flipped) onFlip?.(card.id);
    setFlipped((f) => !f);
  };
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      {/* A lábléc (pl. forrásgombok) a kártya gombján kívül, de a kártya keretén belül van – gomb nem lehet gombban. */}
      <div className="flex min-h-56 flex-col rounded-2xl border border-line bg-surface transition hover:border-accent-2">
        <button
          type="button"
          onClick={flip}
          aria-label={flipped ? 'Kártya előlapjának megjelenítése' : 'Kártya megfordítása – válasz megjelenítése'}
          className="flex flex-1 flex-col justify-between rounded-2xl p-6 pb-3 text-left"
        >
          <span className="text-[11px] uppercase tracking-wider text-accent-2">
            {card.label ? `${card.label} · ` : ''}
            {flipped ? 'Válasz' : 'Kérdés'}
          </span>
          <span className={`my-4 ${flipped ? 'text-base leading-relaxed' : 'font-serif text-xl'} text-ink`}>{flipped ? card.back : card.front}</span>
          <span className="flex items-center justify-between text-xs text-ink-2">
            <span>{flipped ? 'Kattints vagy nyomj Entert a visszafordításhoz' : 'Kattints vagy nyomj Entert a megfordításhoz'}</span>
            <RotateCw size={14} />
          </span>
        </button>
        {flipped && card.footer && <div className="px-6 pb-4 text-xs text-ink-2">{card.footer}</div>}
      </div>
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => go(-1)}>
          <ChevronLeft size={16} /> Előző
        </Button>
        <span className="text-xs text-ink-2" aria-live="polite">
          {index + 1} / {cards.length}
          {counterExtra}
        </span>
        <Button variant="outline" onClick={() => go(1)}>
          Következő <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
