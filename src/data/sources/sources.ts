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
    id: 'saeterbakken-2011',
    kind: 'journal-article',
    authors: 'Saeterbakken, A. H., van den Tillaar, R., Fimland, M. S.',
    title: 'A comparison of muscle activity and 1-RM strength of three chest-press exercises with different stability requirements',
    publisher: 'Journal of Sports Sciences, 29(5), 533–538',
    year: 2011,
    doi: '10.1080/02640414.2010.543916',
    url: 'https://pubmed.ncbi.nlm.nih.gov/21225489/',
    verification: 'verified-online',
    checkedAt: '2026-11-26',
    note: 'Smith-gép, rúd és kézisúlyzó összehasonlítása 12 edzett férfin (1-RM és EMG); csak az absztrakt alapján hivatkozva.'
  },
  {
    id: 'ebben-2011',
    kind: 'journal-article',
    authors: 'Ebben, W. P., Wurm, B., VanderZanden, T. L., Spadavecchia, M. L., Durocher, J. J., Bickham, C. T., Petushek, E. J.',
    title: 'Kinetic analysis of several variations of push-ups',
    publisher: 'Journal of Strength and Conditioning Research, 25(10), 2891–2894',
    year: 2011,
    doi: '10.1519/JSC.0b013e31820c8587',
    url: 'https://pubmed.ncbi.nlm.nih.gov/21873902/',
    verification: 'verified-online',
    checkedAt: '2026-11-26',
    note: 'Talajreakció-erő hat fekvőtámasz-változatnál (alap, térdelő, láb és kéz 30,48 / 60,96 cm-re emelve), 23 rekreációs sportolón; csak az absztrakt alapján hivatkozva.'
  },
  {
    id: 'suprak-2011',
    kind: 'journal-article',
    authors: 'Suprak, D. N., Dawes, J., Stephenson, M. D.',
    title: 'The effect of position on the percentage of body mass supported during traditional and modified push-up variants',
    publisher: 'Journal of Strength and Conditioning Research, 25(2), 497–503',
    year: 2011,
    doi: '10.1519/JSC.0b013e3181bde2cf',
    url: 'https://pubmed.ncbi.nlm.nih.gov/20179649/',
    verification: 'verified-online',
    checkedAt: '2026-11-26',
    note: 'A kézre jutó testtömeg-hányad a felső és az alsó helyzetben, hagyományos és térdelő fekvőtámasznál (28 edzett férfi); csak az absztrakt alapján hivatkozva.'
  },
  {
    id: 'cogley-2005',
    kind: 'journal-article',
    authors: 'Cogley, R. M., Archambault, T. A., Fibeger, J. F., Koverman, M. M., Youdas, J. W., Hollman, J. H.',
    title: 'Comparison of muscle activation using various hand positions during the push-up exercise',
    publisher: 'Journal of Strength and Conditioning Research, 19(3), 628–633',
    year: 2005,
    doi: '10.1519/15094.1',
    url: 'https://pubmed.ncbi.nlm.nih.gov/16095413/',
    verification: 'verified-online',
    checkedAt: '2026-11-26',
    note: 'Keskeny, vállszéles és széles kéztartás: a nagy mellizom és a háromfejű karizom EMG-je (40 fő); csak az absztrakt alapján hivatkozva.'
  },
  {
    id: 'ludewig-2004',
    kind: 'journal-article',
    authors: 'Ludewig, P. M., Hoff, M. S., Osowski, E. E., Meschke, S. A., Rundquist, P. J.',
    title: 'Relative balance of serratus anterior and upper trapezius muscle activity during push-up exercises',
    publisher: 'The American Journal of Sports Medicine, 32(2), 484–493',
    year: 2004,
    doi: '10.1177/0363546503258911',
    url: 'https://pubmed.ncbi.nlm.nih.gov/14977678/',
    verification: 'verified-online',
    checkedAt: '2026-11-26',
    note: 'Fekvőtámasz plusz és módosításai (könyökön, térden, falnál): az elülső fűrészizom és a csuklyásizom felső részének EMG-je (30 fő); csak az absztrakt alapján hivatkozva.'
  },
  {
    id: 'mckenzie-2022-variants',
    kind: 'journal-article',
    authors: 'McKenzie, A., Crowley-McHattan, Z., Meir, R., Whitting, J., Volschenk, W.',
    title: 'Bench, Bar, and Ring Dips: Do Kinematics and Muscle Activity Differ?',
    publisher: 'International Journal of Environmental Research and Public Health, 19(20), 13211',
    year: 2022,
    doi: '10.3390/ijerph192013211',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9603242/',
    license: 'CC BY 4.0 (nyílt hozzáférésű cikk)',
    verification: 'verified-online',
    checkedAt: '2026-11-26',
    note: 'Padon, korláton és gyűrűn végzett tolódzkodás: 3D kinematika és felszíni EMG, 13 tapasztalt férfi. Az eredmények és a következtetések fejezete alapján hivatkozva.'
  },
  {
    id: 'mckenzie-2022-fatigue',
    kind: 'journal-article',
    authors: 'McKenzie, A., Crowley-McHattan, Z., Meir, R., Whitting, J., Volschenk, W.',
    title: 'Fatigue Increases Muscle Activations but Does Not Change Maximal Joint Angles during the Bar Dip',
    publisher: 'International Journal of Environmental Research and Public Health, 19(21), 14390',
    year: 2022,
    doi: '10.3390/ijerph192114390',
    url: 'https://pubmed.ncbi.nlm.nih.gov/36361276/',
    license: 'CC BY 4.0 (nyílt hozzáférésű cikk)',
    verification: 'verified-online',
    checkedAt: '2026-11-26',
    note: 'Korláton végzett tolódzkodás kimerülésig, 15 egészséges férfi; csak az absztrakt alapján hivatkozva.'
  },
  {
    id: 'umehara-2021',
    kind: 'journal-article',
    authors: 'Umehara, J., Sato, Y., Ikezoe, T., Yagi, M., Nojiri, S., Nakao, S., Yanase, K., Hirono, T., Ichihashi, N.',
    title: 'Regional differential stretching of the pectoralis major muscle: An ultrasound elastography study',
    publisher: 'Journal of Biomechanics, 121, 110416',
    year: 2021,
    doi: '10.1016/j.jbiomech.2021.110416',
    url: 'https://pubmed.ncbi.nlm.nih.gov/33894472/',
    verification: 'verified-online',
    checkedAt: '2026-11-26',
    note: 'A nagy mellizom három régiójának nyírási modulusa 12 nyújtási helyzetben (45°, 90°, 135° távolítás; medence-elfordítás; külső rotáció), 15 férfi; csak az absztrakt alapján hivatkozva.'
  },
  {
    id: 'behm-2016',
    kind: 'journal-article',
    authors: 'Behm, D. G., Blazevich, A. J., Kay, A. D., McHugh, M.',
    title: 'Acute effects of muscle stretching on physical performance, range of motion, and injury incidence in healthy active individuals: a systematic review',
    publisher: 'Applied Physiology, Nutrition, and Metabolism, 41(1), 1–11',
    year: 2016,
    doi: '10.1139/apnm-2015-0235',
    url: 'https://pubmed.ncbi.nlm.nih.gov/26642915/',
    verification: 'verified-online',
    checkedAt: '2026-11-26',
    note: 'Szisztematikus áttekintés: statikus, dinamikus és PNF-nyújtás akut hatásai; csak az absztrakt alapján hivatkozva.'
  },
  {
    id: 'garber-2011',
    kind: 'journal-article',
    authors: 'Garber, C. E. és mtsai; American College of Sports Medicine',
    title:
      'American College of Sports Medicine position stand. Quantity and quality of exercise for developing and maintaining cardiorespiratory, musculoskeletal, and neuromotor fitness in apparently healthy adults',
    publisher: 'Medicine & Science in Sports & Exercise, 43(7), 1334–1359',
    year: 2011,
    doi: '10.1249/MSS.0b013e318213fefb',
    url: 'https://pubmed.ncbi.nlm.nih.gov/21694556/',
    verification: 'verified-online',
    checkedAt: '2026-11-26',
    note: 'ACSM állásfoglalás; a nyújtásra vonatkozó ajánlás az absztrakt alapján hivatkozva.'
  },
  {
    id: 'borstad-2006',
    kind: 'journal-article',
    authors: 'Borstad, J. D., Ludewig, P. M.',
    title: 'Comparison of three stretches for the pectoralis minor muscle',
    publisher: 'Journal of Shoulder and Elbow Surgery, 15(3), 324–330',
    year: 2006,
    doi: '10.1016/j.jse.2005.08.011',
    url: 'https://pubmed.ncbi.nlm.nih.gov/16679233/',
    verification: 'verified-online',
    checkedAt: '2026-11-27',
    note: 'Egykaros önnyújtás, fekvő és ülő kézi nyújtás: a kis mellizom hosszváltozása (50 fő, elektromágneses mozgáskövetés); csak az absztrakt alapján hivatkozva.'
  },
  {
    id: 'umehara-2017',
    kind: 'journal-article',
    authors: 'Umehara, J., Nakamura, M., Fujita, K., Kusano, K., Nishishita, S., Araki, K., Tanaka, H., Yanase, K., Ichihashi, N.',
    title: 'Shoulder horizontal abduction stretching effectively increases shear elastic modulus of pectoralis minor muscle',
    publisher: 'Journal of Shoulder and Elbow Surgery, 26(7), 1159–1165',
    year: 2017,
    doi: '10.1016/j.jse.2016.12.074',
    url: 'https://pubmed.ncbi.nlm.nih.gov/28169137/',
    verification: 'verified-online',
    checkedAt: '2026-11-27',
    note: 'Kilenc nyújtási helyzet (hajlítás, horizontális távolítás, lapockaretrakció; 30°, 90°, 150° karemelés), 18 férfi, nyírási modulus; csak az absztrakt alapján hivatkozva.'
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
