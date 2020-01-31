
# memcached.js
memcached.js is inspired in memcached server. This implementantion it's just a subset, not include all commands, the commands currently supported are listed bellow.  
The server is useful if you want a simple memcached server that integrates with your existing node.js infrastructure; otherwise just use [the original memcached](http://memcached.org/) which is a very lightweight.
  
### Usage

    $ yarn start

memcached going to run on default port 11211, for a custom port, set a PORT environment variable.

### Server Commands

nodecached accepts the following commands, based on [the original commands](https://github.com/memcached/memcached/blob/master/doc/protocol.txt):

#### Storage

There are a few storage commands that start with a header like this:  

    <command> <key> <flags> <exptime> <bytes>\r\n

for cas implementation need extra value

    cas <key> <flags> <exptime> <bytes> <cas unique>


* `<command>` is `set`, `add`, `replace`, `cas`, `append` or `prepend`.

* `<key>` is a string that will identify the element.

* `<flags>` is a 16-bit integer to store with the value.

* `<exptime>` is expiration time in seconds.

* `<bytes>` is the length of the data in bytes.

* `<cas unique>` is a unique 64-bit value of an existing entry.
Clients should use the value returned from the "gets" command
when issuing "cas" updates.

Afterwards the server will expect the data block:

`<data>\r\n`

with a length of `<bytes>`.

The server will respond with:

* `STORED\r\n` to indicate success.

* `NOT_STORED\r\n` to indicate failure.

#### Retrieval
The command `get` has the following syntax:

`get <key>\r\n`

where `<key>` is a string that identifies an element.

## References

* [protocol.txt](https://github.com/memcached/memcached/blob/master/doc/protocol.txt)
