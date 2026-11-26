import type { ScientificSource } from '../../types';

/**
 * Tudományos források. Csak valós, létező műveket tartalmaz.
 * A "verified-online" források bibliográfiai adatait (cím, év, DOI/URL) a fejlesztés során
 * (2026-11-26) online keresésekkel ellenőriztük. A "standard-reference" tankönyvek
 * széles körben használt referenciaművek; kiadási adataik nyomtatott példány alapján ellenőrizendők.
 */
export const sources: ScientificSource[] = [
  {
    id: 'openstax-ap2e',
    kind: 'open-textbook',
    authors: 'Betts, J. G. és mtsai. (OpenStax, Rice University)',
    title: 'Anatomy and Physiology 2e – 11.5/11.6 Muscles of the Pectoral Girdle and Upper Limbs',
    publisher: 'OpenStax',
    year: 2022,
    edition: '2e',
    url: 'https://openstax.org/books/anatomy-and-physiology/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs',
    license: 'CC BY 4.0',
    verification: 'verified-online',
    checkedAt: '2026-11-26',
    note: 'A fejezet elérhetősége és licence ellenőrizve; az eredés/tapadás/funkció adatai tankönyvi összefoglalók.'
  },
  {
    id: 'statpearls-pectoral',
    kind: 'online-reference',
    authors: 'StatPearls Publishing (NCBI Bookshelf)',
    title: 'Anatomy, Shoulder and Upper Limb, Pectoral Muscles',
    publisher: 'StatPearls Publishing, Treasure Island (FL)',
    url: 'https://pubmed.ncbi.nlm.nih.gov/31424825/',
    verification: 'verified-online',
    checkedAt: '2026-11-26',
    note: 'Folyamatosan frissített online fejezet; a szerzők és a frissítés dátuma a PubMed-rekordon olvasható.'
  },
  {
    id: 'moore-coa',
    kind: 'textbook',
    authors: 'Moore, K. L., Dalley, A. F., Agur, A. M. R.',
    title: 'Clinically Oriented Anatomy',
    publisher: 'Wolters Kluwer',
    edition: '8. kiadás',
    year: 2018,
    verification: 'standard-reference',
    note: 'Felső végtag fejezet – a mellkasfal elülső izmai (Table: Anterior axioappendicular muscles).'
  },
  {
    id: 'grays-anatomy',
    kind: 'textbook',
    authors: 'Standring, S. (szerk.)',
    title: "Gray's Anatomy: The Anatomical Basis of Clinical Practice",
    publisher: 'Elsevier',
    edition: '42. kiadás',
    year: 2020,
    verification: 'standard-reference',
    note: 'Vállöv és kar fejezet.'
  },
  {
    id: 'neumann-kinesiology',
    kind: 'textbook',
    authors: 'Neumann, D. A.',
    title: 'Kinesiology of the Musculoskeletal System: Foundations for Rehabilitation',
    publisher: 'Elsevier',
    edition: '3. kiadás',
    year: 2017,
    verification: 'standard-reference',
    note: 'Váll-komplexum fejezet – izomműködések és szerepek mozgásonként.'
  },
  {
    id: 'nsca-essentials',
    kind: 'textbook',
    authors: 'Haff, G. G., Triplett, N. T. (szerk.) – NSCA',
    title: 'Essentials of Strength Training and Conditioning',
    publisher: 'Human Kinetics',
    edition: '4. kiadás',
    year: 2016,
    verification: 'standard-reference',
    note: 'Gyakorlattechnikai fejezet – fekvenyomás kiinduló helyzete és kivitelezése.'
  },
  {
    id: 'lauver-2016',
    kind: 'journal-article',
    authors: 'Lauver, J. D., Cayot, T. E., Scheuermann, B. W.',
    title: 'Influence of bench angle on upper extremity muscular activation during bench press exercise',
    publisher: 'European Journal of Sport Science, 16(3), 309–316',
    year: 2016,
    doi: '10.1080/17461391.2015.1022605',
    url: 'https://pubmed.ncbi.nlm.nih.gov/25799093/',
    verification: 'verified-online',
    checkedAt: '2026-11-26',
    note: 'EMG-vizsgálat 0°, 30°, 45° és −15° paddőlésszögnél; csak az absztrakt alapján hivatkozva.'
  },
  {
    id: 'rodriguez-ridao-2020',
    kind: 'journal-article',
    authors: 'Rodríguez-Ridao, D., Antequera-Vique, J. A., Martín-Fuentes, I., Muyor, J. M.',
    title:
      'Effect of Five Bench Inclinations on the Electromyographic Activity of the Pectoralis Major, Anterior Deltoid, and Triceps Brachii during the Bench Press Exercise',
    publisher: 'International Journal of Environmental Research and Public Health, 17(19), 7339',
    year: 2020,
    doi: '10.3390/ijerph17197339',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7579505/',
    license: 'CC BY 4.0 (nyílt hozzáférésű cikk)',
    verification: 'verified-online',
    checkedAt: '2026-11-26',
    note: 'EMG-vizsgálat 0°, 15°, 30°, 45°, 60° dőlésszögnél, 60% 1RM terheléssel.'
  },
  {
    id: 'fipat-ta2',
    kind: 'terminology',
    authors: 'FIPAT – Federative International Programme for Anatomical Terminology',
    title: 'Terminologia Anatomica, 2nd edition (TA2)',
    publisher: 'IFAA / Dalhousie University Libraries',
    year: 2019,
    url: 'https://fipat.library.dal.ca/TA2',
    license: 'CC BY-ND 4.0 (a kiadvány); az egyes terminusok közkincsnek minősülnek',
    verification: 'verified-online',
    checkedAt: '2026-11-26',
    note: 'A latin anatómiai terminusok hivatkozási alapja.'
  }
];

export const sourceById = (id: string): ScientificSource | undefined => sources.find((s) => s.id === id);
