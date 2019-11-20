const CPT = {
  _FHIR_CODING_SYSTEM: 'http://www.ama-assn.org/go/cpt',
  CARDIAC_MRI: '75561',
  CT_HEAD_NO_CONTRAST: '70450',
  CTA_WITH_CONTRAST: '71275',
  LUMBAR_SPINE_CT: '72133',
  MRA_HEAD: '70544',
};

const SNOMED = {
  _FHIR_CODING_SYSTEM: 'http://snomed.info/sct',
  CONGENITAL_HEART_DISEASE: '13213009',
  HEADACHE: '25064002',
  LOW_BACK_PAIN: '279039007',
  OPTIC_DISC_EDEMA: '423341008',
  TOOTHACHE: '27355003'
};

class Criterion {
  static covers(subset, set) {
    if (subset.size > set.size) {
      return false;
    }
    for (const member of subset) {
      if (!set.has(member)) {
        return false;
      }
    }
    return true;
  }

  constructor(appropriate, notAppropriate) {
    this.appropriate = appropriate.map(x => new Set(x));
    this.notAppropriate = notAppropriate.map(x => new Set(x));
  }

  getRating(reasons) {
    if (this.appropriate.filter(s => Criterion.covers(s, reasons)).length) {
      return 'appropriate';
    }
    if (this.notAppropriate.filter(s => Criterion.covers(s, reasons)).length) {
      return 'not-appropriate';
    }
    return 'no-guidelines-apply';
  }
};

function evaluate(order, reasons) {
  if (order) {
    const criterion = criteria[order];
    if (criterion && reasons.length) {
      return criterion.getRating(new Set(reasons));
    }
  }
  return 'no-guidelines-apply';
}

const criteria = {
  'no-procedures-for': new Criterion([[SNOMED.TOOTHACHE]], []),
  [CPT.CT_HEAD_NO_CONTRAST]: new Criterion([[SNOMED.HEADACHE, SNOMED.OPTIC_DISC_EDEMA]], []),
  [CPT.MRA_HEAD]: new Criterion([], []),
  [CPT.CTA_WITH_CONTRAST]: new Criterion([], [[SNOMED.CONGENITAL_HEART_DISEASE]]),
  [CPT.LUMBAR_SPINE_CT]: new Criterion([], [[SNOMED.LOW_BACK_PAIN]]),
  [CPT.CARDIAC_MRI]: new Criterion([[SNOMED.CONGENITAL_HEART_DISEASE]], []),
};

module.exports = {
  CPT, SNOMED, criteria, evaluate, getRating: Criterion.prototype.getRating,
};
