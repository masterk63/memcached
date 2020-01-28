const LINE_BREAK = '\r\n';
let textChunk = '';

const enterPressed = () => textChunk.includes(LINE_BREAK);

const read = (data, socket) => {
  textChunk += data.toString("utf8");
  if (enterPressed()) {
    socket.write(textChunk);
    textChunk = '';
  }
};

module.exports = { read };
