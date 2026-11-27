import type { AnatomicalStructure } from '../../types';

/**
 * Kapcsolódó (kontextus-) izmok, amelyek a mozgások megértéséhez szükségesek,
 * de az első verzióban nem rendelkeznek önálló oktatási modullal.
 */
export const contextMuscles: AnatomicalStructure[] = [
  { id: 'muscle-deltoid', kind: 'muscle', name: { hu: 'Deltaizom', en: 'Deltoid', la: 'Musculus deltoideus' } },
  { id: 'muscle-deltoid-anterior', kind: 'muscle-region', name: { hu: 'Deltaizom elülső (kulcscsonti) része', en: 'Anterior (clavicular) deltoid', la: 'Pars clavicularis musculi deltoidei' } },
  { id: 'muscle-deltoid-middle', kind: 'muscle-region', name: { hu: 'Deltaizom középső (vállcsúcsi) része', en: 'Middle (acromial) deltoid', la: 'Pars acromialis musculi deltoidei' } },
  { id: 'muscle-deltoid-posterior', kind: 'muscle-region', name: { hu: 'Deltaizom hátsó (lapockatövisi) része', en: 'Posterior (spinal) deltoid', la: 'Pars spinalis musculi deltoidei' } },
  { id: 'muscle-latissimus-dorsi', kind: 'muscle', name: { hu: 'Széles hátizom', en: 'Latissimus dorsi', la: 'Musculus latissimus dorsi' } },
  { id: 'muscle-teres-major', kind: 'muscle', name: { hu: 'Nagy görgetegizom', en: 'Teres major', la: 'Musculus teres major' } },
  { id: 'muscle-trapezius', kind: 'muscle', name: { hu: 'Csuklyásizom', en: 'Trapezius', la: 'Musculus trapezius' } },
  { id: 'muscle-rhomboids', kind: 'muscle', name: { hu: 'Rombuszizmok', en: 'Rhomboids', la: 'Musculi rhomboidei' } },
  { id: 'muscle-levator-scapulae', kind: 'muscle', name: { hu: 'Lapockaemelő izom', en: 'Levator scapulae', la: 'Musculus levator scapulae' } },
  { id: 'muscle-supraspinatus', kind: 'muscle', name: { hu: 'Tövis feletti izom', en: 'Supraspinatus', la: 'Musculus supraspinatus' } },
  { id: 'muscle-infraspinatus', kind: 'muscle', name: { hu: 'Tövis alatti izom', en: 'Infraspinatus', la: 'Musculus infraspinatus' } },
  { id: 'muscle-teres-minor', kind: 'muscle', name: { hu: 'Kis görgetegizom', en: 'Teres minor', la: 'Musculus teres minor' } },
  { id: 'muscle-subscapularis', kind: 'muscle', name: { hu: 'Lapocka alatti izom', en: 'Subscapularis', la: 'Musculus subscapularis' } },
  { id: 'muscle-rotator-cuff', kind: 'muscle', name: { hu: 'Rotátorköpeny izmai', en: 'Rotator cuff muscles' } },
  { id: 'muscle-coracobrachialis', kind: 'muscle', name: { hu: 'Hollócsőr-karizom', en: 'Coracobrachialis', la: 'Musculus coracobrachialis' } },
  { id: 'muscle-biceps-brachii', kind: 'muscle', name: { hu: 'Kétfejű karizom', en: 'Biceps brachii', la: 'Musculus biceps brachii' } },
  { id: 'muscle-triceps-brachii', kind: 'muscle', name: { hu: 'Háromfejű karizom', en: 'Triceps brachii', la: 'Musculus triceps brachii' } },
  { id: 'muscle-triceps-long-head', kind: 'muscle-region', name: { hu: 'Háromfejű karizom hosszú feje', en: 'Long head of triceps brachii', la: 'Caput longum musculi tricipitis brachii' } },
  { id: 'muscle-external-oblique', kind: 'muscle', name: { hu: 'Külső ferde hasizom', en: 'External oblique', la: 'Musculus obliquus externus abdominis' } },
  { id: 'muscle-rectus-abdominis', kind: 'muscle', name: { hu: 'Egyenes hasizom', en: 'Rectus abdominis', la: 'Musculus rectus abdominis' } },
  { id: 'muscle-pectoralis-minor', kind: 'muscle', name: { hu: 'Kis mellizom', en: 'Pectoralis minor', la: 'Musculus pectoralis minor' } },
  { id: 'muscle-subclavius', kind: 'muscle', name: { hu: 'Kulcscsont alatti izom', en: 'Subclavius', la: 'Musculus subclavius' } },
  { id: 'muscle-serratus-anterior', kind: 'muscle', name: { hu: 'Elülső fűrészizom', en: 'Serratus anterior', la: 'Musculus serratus anterior' } }
];
