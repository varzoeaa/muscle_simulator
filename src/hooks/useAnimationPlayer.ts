import { useCallback, useEffect, useRef, useState } from 'react';
import type { AnimationSpeed, AnimationState } from '../types';
import * as engine from '../engines/animation/animationEngine';

/**
 * React-kötés az animációs motorhoz. A requestAnimationFrame ciklus csak lejátszás közben fut.
 */
export function useAnimationPlayer(durationMs: number, initial: Partial<AnimationState> = {}) {
  const [state, setState] = useState<AnimationState>(() => engine.createAnimationState(initial));
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (!state.playing) {
      last.current = null;
      return;
    }
    let raf = 0;
    const step = (now: number) => {
      const dt = last.current == null ? 0 : Math.min(250, now - last.current);
      last.current = now;
      setState((s) => engine.tick(s, dt, durationMs));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [state.playing, durationMs]);

  const controls = {
    play: useCallback(() => setState((s) => engine.forward(s)), []),
    pause: useCallback(() => setState(engine.pause), []),
    rewind: useCallback(() => setState(engine.rewind), []),
    reset: useCallback(() => setState(engine.reset), []),
    seek: useCallback((p: number) => setState((s) => engine.seek(engine.pause(s), p)), []),
    setSpeed: useCallback((sp: AnimationSpeed) => setState((s) => engine.setSpeed(s, sp)), []),
    setRange: useCallback((r: [number, number]) => setState((s) => engine.setRange(s, r)), []),
    setLoop: useCallback((loop: boolean) => setState((s) => ({ ...s, loop })), [])
  };

  return { state, ...controls };
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    try {
      return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      const mq = globalThis.matchMedia('(prefers-reduced-motion: reduce)');
      const on = () => setReduced(mq.matches);
      mq.addEventListener('change', on);
      return () => mq.removeEventListener('change', on);
    } catch {
      return undefined;
    }
  }, []);
  return reduced;
}
