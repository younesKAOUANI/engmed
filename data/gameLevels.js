// Medical English Game Levels
// Difficulty increases progressively from Level 1 to Level 50

/**
 * Helper function to scramble a word
 */
function scrambleWord(word) {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

/**
 * Create a level entry with auto-scrambling
 */
function createTerm(definition, word) {
  return {
    definition,
    word: word.toUpperCase(),
    scrambled: scrambleWord(word.toUpperCase())
  };
}

export const gameLevels = [
  // BEGINNER LEVELS (1-10) - 3-5 letter words, basic anatomy
  [
    createTerm('The organ that pumps blood', 'HEART'),
    createTerm('The tube carrying blood to the heart', 'VEIN'),
    createTerm('The bones forming the skeleton', 'BONES'),
  ],
  [
    createTerm('The front of the head', 'FACE'),
    createTerm('The organ you breathe with', 'LUNG'),
    createTerm('The hard white structures in your mouth', 'TEETH'),
  ],
  [
    createTerm('The organ in your head that thinks', 'BRAIN'),
    createTerm('The red liquid in your body', 'BLOOD'),
    createTerm('Protective covering of the body', 'SKIN'),
  ],
  [
    createTerm('The organ that processes food', 'LIVER'),
    createTerm('The body part that bends your arm', 'ELBOW'),
    createTerm('The joint between foot and leg', 'ANKLE'),
  ],
  [
    createTerm('The organ you use to see', 'EYE'),
    createTerm('The organ you use to hear', 'EAR'),
    createTerm('The opening in your face for eating', 'MOUTH'),
  ],
  [
    createTerm('The muscle in your chest', 'CHEST'),
    createTerm('The back part of your foot', 'HEEL'),
    createTerm('The digestive organ below the ribs', 'BELLY'),
  ],
  [
    createTerm('The body part connecting head to body', 'NECK'),
    createTerm('The lower limb used for walking', 'LEG'),
    createTerm('The upper limb with a hand', 'ARM'),
  ],
  [
    createTerm('The finger next to the thumb', 'INDEX'),
    createTerm('The soft part of the face above the eye', 'BROW'),
    createTerm('The body part where legs meet', 'HIP'),
  ],
  [
    createTerm('The central part of the face', 'NOSE'),
    createTerm('The hard covering of fingertips', 'NAIL'),
    createTerm('Hair on the face above the lip', 'BEARD'),
  ],
  [
    createTerm('The joint in the middle of the leg', 'KNEE'),
    createTerm('The upper part of the leg', 'THIGH'),
    createTerm('The lower part of the leg', 'CALF'),
  ],

  // EASY LEVELS (11-20) - 6-8 letter words, common body parts
  [
    createTerm('The body part with five fingers', 'FINGER'),
    createTerm('The curved bones protecting the chest', 'RIBS'),
    createTerm('The flat bone in the chest center', 'STERNUM'),
  ],
  [
    createTerm('The rear part of the body', 'BACK'),
    createTerm('The area where food is digested', 'STOMACH'),
    createTerm('The joint connecting arm to body', 'SHOULDER'),
  ],
  [
    createTerm('The breathing passage in the throat', 'THROAT'),
    createTerm('The soft tissue in your mouth', 'TONGUE'),
    createTerm('The colored part of the eye', 'IRIS'),
  ],
  [
    createTerm('The main organ filtering blood', 'KIDNEY'),
    createTerm('The organ storing bile', 'BLADDER'),
    createTerm('The small intestine part', 'BOWEL'),
  ],
  [
    createTerm('The bony structure of the head', 'SKULL'),
    createTerm('The bones of the spine', 'VERTEBRA'),
    createTerm('The protective layer around organs', 'MEMBRANE'),
  ],
  [
    createTerm('The main artery from the heart', 'AORTA'),
    createTerm('Tiny air sacs in lungs', 'ALVEOLI'),
    createTerm('The voice box in the throat', 'LARYNX'),
  ],
  [
    createTerm('The windpipe to the lungs', 'TRACHEA'),
    createTerm('The tube from mouth to stomach', 'ESOPHAGUS'),
    createTerm('Gland regulating metabolism', 'THYROID'),
  ],
  [
    createTerm('Blood cell carrying oxygen', 'ERYTHROCYTE'),
    createTerm('White blood cell fighting infection', 'LEUKOCYTE'),
    createTerm('Cell fragment for clotting', 'PLATELET'),
  ],
  [
    createTerm('The outer layer of skin', 'EPIDERMIS'),
    createTerm('The inner layer of skin', 'DERMIS'),
    createTerm('Fat tissue under the skin', 'SUBCUTANEOUS'),
  ],
  [
    createTerm('The largest organ in the body', 'SKIN'),
    createTerm('Muscle dividing chest and abdomen', 'DIAPHRAGM'),
    createTerm('The body system fighting disease', 'IMMUNE'),
  ],

  // INTERMEDIATE LEVELS (21-30) - Medical conditions & procedures
  [
    createTerm('High blood pressure condition', 'HYPERTENSION'),
    createTerm('Low blood sugar condition', 'HYPOGLYCEMIA'),
    createTerm('Inflammation of joints', 'ARTHRITIS'),
  ],
  [
    createTerm('Difficulty breathing condition', 'ASTHMA'),
    createTerm('A common skin condition', 'ECZEMA'),
    createTerm('Skin condition with red patches', 'PSORIASIS'),
  ],
  [
    createTerm('High blood sugar condition', 'DIABETES'),
    createTerm('Abnormal heartbeat', 'ARRHYTHMIA'),
    createTerm('Heart muscle disease', 'CARDIOMYOPATHY'),
  ],
  [
    createTerm('Inflammation of the liver', 'HEPATITIS'),
    createTerm('Inflammation of the stomach', 'GASTRITIS'),
    createTerm('Inflammation of the appendix', 'APPENDICITIS'),
  ],
  [
    createTerm('Bone weakening disease', 'OSTEOPOROSIS'),
    createTerm('Lung infection', 'PNEUMONIA'),
    createTerm('Inflammation of bronchi', 'BRONCHITIS'),
  ],
  [
    createTerm('Blood clot in vessel', 'THROMBOSIS'),
    createTerm('Blockage of blood vessel', 'EMBOLISM'),
    createTerm('Reduced oxygen to tissue', 'ISCHEMIA'),
  ],
  [
    createTerm('Abnormal cell growth', 'NEOPLASM'),
    createTerm('Cancerous tumor', 'MALIGNANT'),
    createTerm('Non-cancerous tumor', 'BENIGN'),
  ],
  [
    createTerm('Brain blood vessel rupture', 'ANEURYSM'),
    createTerm('Sudden brain blood loss', 'STROKE'),
    createTerm('Persistent headache disorder', 'MIGRAINE'),
  ],
  [
    createTerm('Surgical removal procedure', 'EXCISION'),
    createTerm('Cutting into tissue', 'INCISION'),
    createTerm('Tissue examination', 'BIOPSY'),
  ],
  [
    createTerm('X-ray imaging procedure', 'RADIOGRAPHY'),
    createTerm('Sound wave imaging', 'ULTRASOUND'),
    createTerm('Magnetic imaging scan', 'MRI'),
  ],

  // ADVANCED LEVELS (31-40) - Complex medical terms
  [
    createTerm('Study of disease causes', 'ETIOLOGY'),
    createTerm('Disease development process', 'PATHOGENESIS'),
    createTerm('Disease identification', 'DIAGNOSIS'),
  ],
  [
    createTerm('Treatment plan', 'PROGNOSIS'),
    createTerm('Disease prediction outcome', 'PROGNOSIS'),
    createTerm('Before surgery', 'PREOPERATIVE'),
  ],
  [
    createTerm('After surgery', 'POSTOPERATIVE'),
    createTerm('During surgery', 'INTRAOPERATIVE'),
    createTerm('Minimally invasive surgery', 'LAPAROSCOPIC'),
  ],
  [
    createTerm('Immune system overreaction', 'ANAPHYLAXIS'),
    createTerm('Self-attacking immune response', 'AUTOIMMUNE'),
    createTerm('Weakened immune system', 'IMMUNODEFICIENCY'),
  ],
  [
    createTerm('Tissue death from lack of blood', 'NECROSIS'),
    createTerm('Programmed cell death', 'APOPTOSIS'),
    createTerm('Tissue scarring process', 'FIBROSIS'),
  ],
  [
    createTerm('Spread of cancer cells', 'METASTASIS'),
    createTerm('Cancer-causing substance', 'CARCINOGEN'),
    createTerm('Cancer treatment with drugs', 'CHEMOTHERAPY'),
  ],
  [
    createTerm('Cancer treatment with radiation', 'RADIOTHERAPY'),
    createTerm('Biological cancer treatment', 'IMMUNOTHERAPY'),
    createTerm('Targeted cancer therapy', 'ONCOLOGY'),
  ],
  [
    createTerm('Heart rhythm recording', 'ELECTROCARDIOGRAM'),
    createTerm('Brain wave recording', 'ELECTROENCEPHALOGRAM'),
    createTerm('Muscle activity recording', 'ELECTROMYOGRAPHY'),
  ],
  [
    createTerm('Blood vessel visualization', 'ANGIOGRAPHY'),
    createTerm('Bladder examination', 'CYSTOSCOPY'),
    createTerm('Colon examination', 'COLONOSCOPY'),
  ],
  [
    createTerm('Joint examination', 'ARTHROSCOPY'),
    createTerm('Bronchial tube examination', 'BRONCHOSCOPY'),
    createTerm('Stomach examination', 'GASTROSCOPY'),
  ],

  // EXPERT LEVELS (41-50) - Specialized medical terminology
  [
    createTerm('Inflammation of heart lining', 'ENDOCARDITIS'),
    createTerm('Inflammation of heart muscle', 'MYOCARDITIS'),
    createTerm('Inflammation of outer heart', 'PERICARDITIS'),
  ],
  [
    createTerm('Kidney inflammation', 'NEPHRITIS'),
    createTerm('Kidney filtering unit', 'NEPHRON'),
    createTerm('Study of kidneys', 'NEPHROLOGY'),
  ],
  [
    createTerm('Nerve inflammation', 'NEURITIS'),
    createTerm('Nerve pain condition', 'NEURALGIA'),
    createTerm('Study of nervous system', 'NEUROLOGY'),
  ],
  [
    createTerm('Blood vessel inflammation', 'VASCULITIS'),
    createTerm('Vein inflammation', 'PHLEBITIS'),
    createTerm('Artery inflammation', 'ARTERITIS'),
  ],
  [
    createTerm('Bone marrow inflammation', 'OSTEOMYELITIS'),
    createTerm('Joint cartilage degeneration', 'OSTEOARTHRITIS'),
    createTerm('Autoimmune joint disease', 'RHEUMATOID'),
  ],
  [
    createTerm('Lung tissue scarring', 'PULMONARY FIBROSIS'),
    createTerm('Airway narrowing disease', 'COPD'),
    createTerm('Lung blood clot', 'PULMONARY EMBOLISM'),
  ],
  [
    createTerm('Liver scarring disease', 'CIRRHOSIS'),
    createTerm('Liver enzyme elevation', 'HEPATOMEGALY'),
    createTerm('Bile duct obstruction', 'CHOLESTASIS'),
  ],
  [
    createTerm('Brain inflammation', 'ENCEPHALITIS'),
    createTerm('Brain covering inflammation', 'MENINGITIS'),
    createTerm('Multiple brain lesions', 'ENCEPHALOMYELITIS'),
  ],
  [
    createTerm('Blood production study', 'HEMATOLOGY'),
    createTerm('Hormone study', 'ENDOCRINOLOGY'),
    createTerm('Immune system study', 'IMMUNOLOGY'),
  ],
  [
    createTerm('Cell structure study', 'HISTOLOGY'),
    createTerm('Disease tissue study', 'PATHOLOGY'),
    createTerm('Microorganism study', 'MICROBIOLOGY'),
  ],
];

// Export level difficulty labels
export const levelDifficulty = [
  { range: [0, 9], label: 'Beginner', color: '#10b981' },
  { range: [10, 19], label: 'Easy', color: '#3b82f6' },
  { range: [20, 29], label: 'Intermediate', color: '#f59e0b' },
  { range: [30, 39], label: 'Advanced', color: '#ef4444' },
  { range: [40, 49], label: 'Expert', color: '#8b5cf6' },
];

export function getDifficultyInfo(levelIndex) {
  const difficulty = levelDifficulty.find(
    (d) => levelIndex >= d.range[0] && levelIndex <= d.range[1]
  );
  return difficulty || levelDifficulty[0];
}
