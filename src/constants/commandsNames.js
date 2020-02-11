const GET = 'get';
const GETS = 'gets';
const SET = 'set';
const ADD = 'add';
const REPLACE = 'replace';
const APPEND = 'append';
const PREPREND = 'prepend';
const CAS = 'cas';
const COMMANDS_NAMES = [GET, GETS, SET, ADD, REPLACE, APPEND, PREPREND, CAS];
const RETRIEVAL_COMMANDS = [GET, GETS];

module.exports = {
  GET,
  GETS,
  SET,
  ADD,
  REPLACE,
  APPEND,
  PREPREND,
  CAS,
  COMMANDS_NAMES,
  RETRIEVAL_COMMANDS
};
