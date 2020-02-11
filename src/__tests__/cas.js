const Cas = require('../models/Cas');

describe('CAS logic', () => {
  test('Check CAS sequence', () => {
    const casInstance = new Cas();
    const result = casInstance.getIncrementCas();
    expect(result).toBe(1);
    expect(casInstance.cas).toBe(2);
  });
});