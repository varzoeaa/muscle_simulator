import type { DisplayRoleType } from '../../types';

export const roleLabels: Record<DisplayRoleType, string> = {
  agonist: 'Agonista (főmozgató)',
  synergist: 'Szinergista (segítő)',
  antagonist: 'Antagonista (ellentétes hatású)',
  stabilizer: 'Stabilizáló',
  stretched: 'Nyújtott izom (passzív)'
};

export const roleLetters: Record<DisplayRoleType, string> = { agonist: 'AG', synergist: 'SZ', antagonist: 'AN', stabilizer: 'ST', stretched: 'NY' };

const swatch: Record<DisplayRoleType, string> = {
  agonist: 'var(--an-agonist)',
  synergist: 'repeating-linear-gradient(45deg, var(--an-synergist) 0 3px, rgba(0,0,0,.25) 3px 5px)',
  antagonist: 'radial-gradient(circle, rgba(255,255,255,.45) 1px, var(--an-antagonist) 1.5px) 0 0/5px 5px',
  stabilizer: 'repeating-linear-gradient(45deg, var(--an-stabilizer) 0 3px, rgba(255,255,255,.2) 3px 4px)',
  stretched: 'var(--an-stretched)'
};

const defaultRoles: DisplayRoleType[] = ['agonist', 'synergist', 'antagonist', 'stabilizer'];

/** Jelmagyarázat: szín + mintázat + betűjel – a szerepek nem csak színnel különböznek. */
export function RoleLegend({ compact, roles = defaultRoles }: { compact?: boolean; roles?: DisplayRoleType[] }) {
  return (
    <ul className={`flex flex-wrap gap-x-3 gap-y-1 ${compact ? 'text-[11px]' : 'text-xs'} text-ink-2`}>
      {roles.map((r) => (
        <li key={r} className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-5 rounded-sm" style={{ background: swatch[r] }} />
          <span>
            <b className="text-ink">{roleLetters[r]}</b> {roleLabels[r]}
          </span>
        </li>
      ))}
    </ul>
  );
}
