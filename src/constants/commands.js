const GET = 'get';
const GETS = 'gets';
const SET = 'set';
const ADD = 'add';
const REPLACE = 'replace';
const APPEND = 'append';
const PREPREND = 'prepend';
const CAS = 'cas';
const commandNames = [GET, GETS, SET, ADD, REPLACE, APPEND, PREPREND, CAS];
const retrievalCommand = [GET, GETS];
const commandCasLength = 6;
const commandsAddLength = 5;
const commandsGetLength = 1;
const maxValueUnsigned16bit = 65535;

module.exports = {
  GET,
  GETS,
  SET,
  ADD,
  REPLACE,
  APPEND,
  PREPREND,
  CAS,
  commandNames,
  retrievalCommand,
  commandCasLength,
  commandsAddLength,
  commandsGetLength,
  maxValueUnsigned16bit
};
