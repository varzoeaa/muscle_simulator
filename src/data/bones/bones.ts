import type { Bone } from '../../types';

export const bones: Bone[] = [
  {
    id: 'bone-sternum',
    kind: 'bone',
    name: { hu: 'Szegycsont', en: 'Sternum', la: 'Sternum' },
    landmarks: [
      { id: 'bone-sternum-manubrium', kind: 'bone-landmark', name: { hu: 'Szegycsont markolata', en: 'Manubrium of sternum', la: 'Manubrium sterni' } },
      { id: 'bone-sternum-body', kind: 'bone-landmark', name: { hu: 'Szegycsont teste', en: 'Body of sternum', la: 'Corpus sterni' } },
      { id: 'bone-sternum-xiphoid', kind: 'bone-landmark', name: { hu: 'Kardnyúlvány', en: 'Xiphoid process', la: 'Processus xiphoideus' } }
    ]
  },
  { id: 'bone-ribs', kind: 'bone', name: { hu: 'Bordák', en: 'Ribs', la: 'Costae' } },
  { id: 'bone-costal-cartilages', kind: 'bone', name: { hu: 'Bordaporcok', en: 'Costal cartilages', la: 'Cartilagines costales' } },
  { id: 'bone-clavicle', kind: 'bone', name: { hu: 'Kulcscsont', en: 'Clavicle', la: 'Clavicula' } },
  {
    id: 'bone-scapula',
    kind: 'bone',
    name: { hu: 'Lapocka', en: 'Scapula', la: 'Scapula' },
    landmarks: [
      { id: 'bone-scapula-coracoid', kind: 'bone-landmark', name: { hu: 'Hollócsőrnyúlvány', en: 'Coracoid process', la: 'Processus coracoideus' } },
      { id: 'bone-scapula-acromion', kind: 'bone-landmark', name: { hu: 'Vállcsúcs', en: 'Acromion', la: 'Acromion' } },
      { id: 'bone-scapula-medial-border', kind: 'bone-landmark', name: { hu: 'A lapocka belső széle', en: 'Medial border of scapula', la: 'Margo medialis scapulae' } },
      { id: 'bone-scapula-superior-angle', kind: 'bone-landmark', name: { hu: 'A lapocka felső szöge', en: 'Superior angle of scapula', la: 'Angulus superior scapulae' } },
      { id: 'bone-scapula-inferior-angle', kind: 'bone-landmark', name: { hu: 'A lapocka alsó szöge', en: 'Inferior angle of scapula', la: 'Angulus inferior scapulae' } }
    ]
  },
  {
    id: 'bone-humerus',
    kind: 'bone',
    name: { hu: 'Felkarcsont', en: 'Humerus', la: 'Humerus' },
    landmarks: [
      {
        id: 'bone-humerus-crest-greater-tubercle',
        kind: 'bone-landmark',
        name: { hu: 'Nagy gumó taraja (a bicepsbarázda külső pereme)', en: 'Crest of greater tubercle (lateral lip of intertubercular sulcus)', la: 'Crista tuberculi majoris' }
      }
    ]
  },
  { id: 'bone-radius', kind: 'bone', name: { hu: 'Orsócsont', en: 'Radius', la: 'Radius' } },
  { id: 'bone-ulna', kind: 'bone', name: { hu: 'Singcsont', en: 'Ulna', la: 'Ulna' } },
  { id: 'bone-vertebral-column', kind: 'bone', name: { hu: 'Gerincoszlop (csigolya)', en: 'Vertebral column (vertebra)', la: 'Columna vertebralis' } },
  { id: 'bone-external-oblique-aponeurosis', kind: 'bone', name: { hu: 'A külső ferde hasizom bőnye', en: 'Aponeurosis of external oblique', la: 'Aponeurosis musculi obliqui externi abdominis' } }
];

export const boneById = (id: string) => bones.find((b) => b.id === id);
