import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { FlashcardDeck, type DeckCard } from '../components/study/FlashcardDeck';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const deck = (...names: string[]): DeckCard[] => names.map((n) => ({ id: n, front: n, back: `${n} hátlap` }));
let host: HTMLDivElement | null = null;
afterEach(() => host?.remove());

function mount(cards: DeckCard[]) {
  host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  const render = (c: DeckCard[]) => act(() => root.render(<FlashcardDeck cards={c} />));
  render(cards);
  const click = (label: string) => act(() => [...host!.querySelectorAll('button')].find((b) => b.textContent?.includes(label))!.click());
  const front = () => host!.querySelector('button[aria-label^="Kártya"]')?.textContent ?? null;
  const counter = () => host!.textContent?.match(/\d+ \/ \d+/)?.[0] ?? null;
  return { render, click, front, counter };
}

describe('Tanulókártya-pakli törlés után', () => {
  it('ha az utolsó (aktuális) kártya törlődik, a pakli az új utolsóra áll', () => {
    const d = mount(deck('A', 'B', 'C'));
    d.click('Következő');
    d.click('Következő');
    expect(d.counter()).toBe('3 / 3');
    d.render(deck('A', 'B'));
    expect(d.counter()).toBe('2 / 2');
    expect(d.front()).toContain('B');
  });

  it('ha egy középső aktuális kártya törlődik, a számláló és a kártya érvényes marad; az utolsó kártya törlésekor nem jelenik meg semmi', () => {
    const d = mount(deck('A', 'B', 'C'));
    d.click('Következő');
    d.render(deck('A', 'C'));
    expect(d.counter()).toBe('2 / 2');
    expect(d.front()).toContain('C');
    d.render([]);
    expect(d.front()).toBeNull();
  });
});
