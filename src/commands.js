const GET = 'get';
const GETS = 'gets';
const SET = 'set';
const ADD = 'add';
const REPLACE = 'replace';
const APPEND = 'append';
const PREPREND = 'prepend';
const CAS = 'cas';
const commands = [GET, GETS, SET, ADD, REPLACE, APPEND, PREPREND, CAS];
const getCommands = [GET, GETS];

const isValidCommand = command => commands.includes(command);

const isGetCommand = command => getCommands.includes(command);

const runCommand = command => {

};

module.exports = { isValidCommand, runCommand, isGetCommand };
