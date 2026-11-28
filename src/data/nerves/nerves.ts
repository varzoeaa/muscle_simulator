import type { Nerve } from '../../types';

export const nerves: Nerve[] = [
  {
    id: 'nerve-lateral-pectoral',
    kind: 'nerve',
    name: { hu: 'Külső mellizomideg', en: 'Lateral pectoral nerve', la: 'Nervus pectoralis lateralis' },
    roots: 'tipikusan C5–C7 (egyénenként változhat, pl. csak C6–C7)',
    origin: 'A plexus brachialis külső kötegéből (fasciculus lateralis) ered.',
    sourceIds: ['moore-coa', 'statpearls-pectoral', 'lee-2007']
  },
  {
    id: 'nerve-medial-pectoral',
    kind: 'nerve',
    name: { hu: 'Belső mellizomideg', en: 'Medial pectoral nerve', la: 'Nervus pectoralis medialis' },
    roots: 'tipikusan C8–T1 (egyénenként változhat, pl. csak C8)',
    origin: 'A plexus brachialis belső kötegéből (fasciculus medialis) ered.',
    sourceIds: ['moore-coa', 'statpearls-pectoral', 'lee-2007']
  },
  {
    id: 'nerve-subclavius',
    kind: 'nerve',
    name: { hu: 'Kulcscsont alatti ideg', en: 'Nerve to subclavius', la: 'Nervus subclavius' },
    roots: 'tipikusan C5–C6',
    origin: 'A plexus brachialis felső törzséből (truncus superior) ered.',
    sourceIds: ['moore-coa', 'statpearls-pectoral', 'statpearls-sc-joint']
  },
  {
    id: 'nerve-long-thoracic',
    kind: 'nerve',
    name: { hu: 'Hosszú mellkasi ideg', en: 'Long thoracic nerve', la: 'Nervus thoracicus longus' },
    roots: 'C5–C7',
    origin:
      'A karfonat (plexus brachialis) felső részéből, jellemzően a C5–C7 gerincvelői idegekből ered; a középső lépcsőizom mögött, előtte vagy azon át halad, majd az elülső fűrészizom külső felszínén fut lefelé.',
    sourceIds: ['statpearls-serratus', 'moore-coa']
  }
];

export const nerveById = (id: string) => nerves.find((n) => n.id === id);
