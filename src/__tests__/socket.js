const Socket = require('../models/Socket');
const { LINE_BREAK } = require('../constants/app');

describe('Socket', () => {
  test('Check Socket Write With Line Break', () => {
    const MESSAGE = 'test';
    const socketInstance = new Socket({});
    socketInstance.getInstance().write = jest.fn();
    socketInstance.writeMessage(MESSAGE);
    expect(socketInstance.getInstance().write).toHaveBeenCalledWith(`${MESSAGE}${LINE_BREAK}`);
    expect(socketInstance.getInstance().write).toHaveBeenCalledTimes(1);
  });
  test('Check Socket Write Calls Two Times', () => {
    const MESSAGE = ['say', 'hi'];
    const socketInstance = new Socket({});
    socketInstance.getInstance().write = jest.fn();
    socketInstance.writeMessage(MESSAGE);
    expect(socketInstance.getInstance().write).toHaveBeenCalledTimes(2);
  });
});
