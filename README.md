# memcached.js

memcached.js is inspired in memcached server. This implementation has only a subset of commands from the original. Commands currently support are listed below

The server is useful if you want a simple memcached server that integrates with your existing node.js infrastructure, otherwise use [the original memcached](http://memcached.org/) which is a very lightweight.

## Usage

### Run Server

    $ yarn start

memcached.js will run, by default, on port 11211. For a custom port, please set PORT environment variable from console.

### Run client

For test the server you can use any memcached client, otherwise you can connect using telnet running this command. `telnet <ip-address> <port>` e.g:

    $ telnet localhost 11211

### Server Commands

memcached.js accepts the following commands, based on [the original commands](https://github.com/memcached/memcached/blob/master/doc/protocol.txt):

Retrieval commands:

- get
- gets

Storage commands:

- set
- add
- replace
- append
- prepend
- cas

#### Storage

There are a few storage commands that start with a header like this:

    <command> <key> <flags> <exptime> <bytes>\r\n

for cas implementation need extra value

    cas <key> <flags> <exptime> <bytes> <cas unique>

- `<command>` is `set`, `add`, `replace`, `cas`, `append` or `prepend`.

* `<key>` is a string that will identify the element.

- `<flags>` is a 16-bit integer to store with the value.

* `<exptime>` is expiration time in seconds.

- `<bytes>` is the length of the data in bytes.

* `<cas unique>` is a unique 64-bit value of an existing entry.

Clients should use the value returned from the "gets" command

when issuing "cas" updates.

Afterwards the server will expect the data block:

`<data>\r\n`

with a length of `<bytes>`.

The server will respond with:

- `STORED\r\n` to indicate success.

* `NOT_STORED\r\n` to indicate failure.

* `EXISTS\r\n` to indicate that the item you are trying to store with a "cas" command has been modified since you last fetched it.

* `NOT_FOUND\r\n` to indicate that the item you are trying to store with a "cas" command did not exist.

#### Retrieval

The commands `get` and `gets` have the following syntax:

`get <key>\r\n`

where `<key>` is a string that identifies a pair KEY VALUE already storaged

After this command, the client expects zero or more items, each of
which is received as a text line followed by a data block. After all
the items have been transmitted, the server sends the string

`END\r\n`

to indicate the end of a response.

Each item sent by the server looks like this:

    VALUE <key> <flags> <bytes> [<cas unique>]\r\n
    <data block>\r\n

- `<key>` is the key for the item being sent

- `<flags>` is the flags value set by the storage command

- `<bytes>` is the length of the data block to follow, _not_ including its delimiting \r\n

- `<cas unique>` is a unique 64-bit integer that uniquely identifies this specific item.

- `<data block>` is the data for this item.

#### Store sample command

    set kevin 0 300 0\r\n
    to-moovitr\r\n

the server responds with `STORED\r\n`.

#### Error sample commands

if you run command not supported, you will recibe `ERROR\r\n`, example command:

    $ store\r\n

If you run a supported command, but with incorrect number of params, you will recibe
`CLIENT_ERROR bad command line format\r\n`, example command:

    $ add kevin 0 300

## Testing

For execute the tests just run:

     $ yarn test

## References

- [protocol.txt](https://github.com/memcached/memcached/blob/master/doc/protocol.txt)
