import type { Joint, JointMovement, JointMovementId, Term } from '../../types';

export const joints: Joint[] = [
  {
    id: 'joint-glenohumeral',
    kind: 'joint',
    name: { hu: 'Vállízület', en: 'Glenohumeral joint', la: 'Articulatio humeri' },
    bones: ['bone-scapula', 'bone-humerus'],
    movements: [
      'shoulder-flexion',
      'shoulder-extension',
      'shoulder-abduction',
      'shoulder-adduction',
      'shoulder-horizontal-adduction',
      'shoulder-horizontal-abduction',
      'shoulder-internal-rotation',
      'shoulder-external-rotation'
    ]
  },
  {
    id: 'joint-sternoclavicular',
    kind: 'joint',
    name: { hu: 'Szegycsont-kulcscsonti ízület', en: 'Sternoclavicular joint', la: 'Articulatio sternoclavicularis' },
    bones: ['bone-sternum', 'bone-clavicle'],
    movements: ['clavicular-depression']
  },
  {
    id: 'joint-acromioclavicular',
    kind: 'joint',
    name: { hu: 'Vállcsúcs-kulcscsonti ízület', en: 'Acromioclavicular joint', la: 'Articulatio acromioclavicularis' },
    bones: ['bone-scapula', 'bone-clavicle'],
    movements: []
  },
  {
    id: 'joint-scapulothoracic',
    kind: 'joint',
    name: { hu: 'Lapocka-mellkasi kapcsolat (funkcionális ízület)', en: 'Scapulothoracic articulation' },
    bones: ['bone-scapula', 'bone-ribs'],
    movements: [
      'scapular-protraction',
      'scapular-retraction',
      'scapular-elevation',
      'scapular-depression',
      'scapular-upward-rotation',
      'scapular-downward-rotation',
      'scapular-anterior-tilt',
      'scapular-posterior-tilt'
    ]
  },
  {
    id: 'joint-elbow',
    kind: 'joint',
    name: { hu: 'Könyökízület', en: 'Elbow joint', la: 'Articulatio cubiti' },
    bones: ['bone-humerus', 'bone-radius', 'bone-ulna'],
    movements: ['elbow-flexion', 'elbow-extension']
  }
];

const sagittal: Term = { hu: 'Szagittális sík', en: 'Sagittal plane', la: 'Planum sagittale' };
const frontal: Term = { hu: 'Frontális sík', en: 'Frontal (coronal) plane', la: 'Planum frontale' };
const transverse: Term = { hu: 'Horizontális (transzverzális) sík', en: 'Transverse plane', la: 'Planum transversale' };
const scapular: Term = { hu: 'Lapocka-mellkasi mozgás', en: 'Scapulothoracic motion' };
const thoracic: Term = { hu: 'Mellkasmozgás (légzés)', en: 'Thoracic (respiratory) motion' };

export const movements: JointMovement[] = [
  { id: 'shoulder-flexion', name: { hu: 'Hajlítás (vállízület)', en: 'Shoulder flexion', la: 'Flexio' }, plane: sagittal },
  { id: 'shoulder-extension', name: { hu: 'Feszítés (vállízület)', en: 'Shoulder extension', la: 'Extensio' }, plane: sagittal },
  { id: 'shoulder-abduction', name: { hu: 'Távolítás (vállízület)', en: 'Shoulder abduction', la: 'Abductio' }, plane: frontal },
  { id: 'shoulder-adduction', name: { hu: 'Közelítés (vállízület)', en: 'Shoulder adduction', la: 'Adductio' }, plane: frontal },
  { id: 'shoulder-horizontal-adduction', name: { hu: 'Horizontális közelítés', en: 'Horizontal adduction' }, plane: transverse },
  { id: 'shoulder-horizontal-abduction', name: { hu: 'Horizontális távolítás', en: 'Horizontal abduction' }, plane: transverse },
  { id: 'shoulder-internal-rotation', name: { hu: 'Befelé forgatás (belső rotáció)', en: 'Internal (medial) rotation', la: 'Rotatio medialis' }, plane: transverse },
  { id: 'shoulder-external-rotation', name: { hu: 'Kifelé forgatás (külső rotáció)', en: 'External (lateral) rotation', la: 'Rotatio lateralis' }, plane: transverse },
  { id: 'elbow-flexion', name: { hu: 'Hajlítás (könyök)', en: 'Elbow flexion', la: 'Flexio' }, plane: sagittal },
  { id: 'elbow-extension', name: { hu: 'Feszítés (könyök)', en: 'Elbow extension', la: 'Extensio' }, plane: sagittal },
  { id: 'scapular-protraction', name: { hu: 'Lapockaprotrakció', en: 'Scapular protraction' }, plane: scapular },
  { id: 'scapular-retraction', name: { hu: 'Lapockaretrakció', en: 'Scapular retraction' }, plane: scapular },
  { id: 'scapular-depression', name: { hu: 'Lapockadepresszió', en: 'Scapular depression', la: 'Depressio' }, plane: scapular },
  { id: 'scapular-elevation', name: { hu: 'Lapockaeleváció', en: 'Scapular elevation', la: 'Elevatio' }, plane: scapular },
  { id: 'scapular-upward-rotation', name: { hu: 'Lapocka felfelé rotációja', en: 'Scapular upward rotation' }, plane: scapular },
  { id: 'scapular-downward-rotation', name: { hu: 'Lapocka lefelé rotációja', en: 'Scapular downward rotation' }, plane: scapular },
  { id: 'scapular-anterior-tilt', name: { hu: 'Lapocka előrebillenése', en: 'Scapular anterior tilt' }, plane: scapular },
  { id: 'scapular-posterior-tilt', name: { hu: 'Lapocka hátrabillenése', en: 'Scapular posterior tilt' }, plane: scapular },
  { id: 'accessory-inspiration', name: { hu: 'Járulékos belégzés (a bordák emelése)', en: 'Accessory inspiration' }, plane: thoracic },
  { id: 'clavicular-depression', name: { hu: 'Kulcscsont süllyesztése', en: 'Clavicular depression', la: 'Depressio' }, plane: scapular }
];

export const movementById = (id: JointMovementId) => movements.find((m) => m.id === id);
export const jointById = (id: string) => joints.find((j) => j.id === id);
