let cas = 1;

const getIncrementCas = () => {
	const _cas = cas;
	cas++;
	return _cas;
}

module.exports = { getIncrementCas }