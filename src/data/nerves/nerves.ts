import type { Nerve } from '../../types';

export const nerves: Nerve[] = [
  {
    id: 'nerve-lateral-pectoral',
    kind: 'nerve',
    name: { hu: 'Külső mellizomideg', en: 'Lateral pectoral nerve', la: 'Nervus pectoralis lateralis' },
    roots: 'C5–C7',
    origin: 'A plexus brachialis külső kötegéből (fasciculus lateralis) ered.',
    sourceIds: ['moore-coa', 'statpearls-pectoral']
  },
  {
    id: 'nerve-medial-pectoral',
    kind: 'nerve',
    name: { hu: 'Belső mellizomideg', en: 'Medial pectoral nerve', la: 'Nervus pectoralis medialis' },
    roots: 'C8–T1',
    origin: 'A plexus brachialis belső kötegéből (fasciculus medialis) ered.',
    sourceIds: ['moore-coa', 'statpearls-pectoral']
  }
];

export const nerveById = (id: string) => nerves.find((n) => n.id === id);
