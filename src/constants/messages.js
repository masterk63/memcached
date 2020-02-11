const COMMAND_NOT_FOUND = 'ERROR';
const STORED = 'STORED';
const END = 'END';
const EXISTS = 'EXISTS';
const NOT_FOUND = 'NOT_FOUND';
const NOT_STORED = 'NOT_STORED';
const CLIENT_ERROR = 'CLIENT_ERROR';
const BAD_COMMAND_LINE_FORMAT = `${CLIENT_ERROR} bad command line format`;
const BAD_DATA_CHUNK = `${CLIENT_ERROR} bad data chunk`;

module.exports = {
  COMMAND_NOT_FOUND,
  STORED,
  END,
  EXISTS,
  NOT_FOUND,
  NOT_STORED,
  BAD_COMMAND_LINE_FORMAT,
  BAD_DATA_CHUNK
};
