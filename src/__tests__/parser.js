const Parser = require('../Parser');
const parser = new Parser();
const { LINE_BREAK } = require('../constants/app');

describe('Parser', () => {
  test('Read not enter pressed', () => {
    const message = 'test';
    const response = parser.read(message);
    expect(response).toBeUndefined();
    parser.textChunk = '';
  });
  test('Read first step of store command', () => {
    const message = `set foo 0 300 3${LINE_BREAK}`;
    const response = parser.read(message);
    expect(response).toBeUndefined();
    expect(parser.storeCommand).toEqual(['set', 'foo', '0', '300', '3']);
  });
});
