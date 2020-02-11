class Cas {
  constructor() {
    this.cas = 1;
  }
  getIncrementCas() {
    const _cas = this.cas;
    this.cas++;
    return _cas;
  }
}

module.exports = Cas;
