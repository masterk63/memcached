
  

# memcached.js

memcached.js is inspired in memcached server. This implementantion it's just a subset, not include all commands, the commands currently supported are listed bellow.

The server is useful if you want a simple memcached server that integrates with your existing node.js infrastructure; otherwise just use [the original memcached](http://memcached.org/) which is a very lightweight.

### Usage

  

    $ yarn start

  

memcached going to run on default port 11211, for a custom port, set a PORT environment variable.

  

### Server Commands

  

nodecached accepts the following commands, based on [the original commands](https://github.com/memcached/memcached/blob/master/doc/protocol.txt):

Retrieval commands:

-   get
-   gets

Storage commands:

-   set
-   add
-   replace
-   append
-   prepend
-   cas
  

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

* `EXISTS\r\n` to indicate that the item you are trying to store with a "cas" command has been modified since you last fetched it.

* `NOT_FOUND\r\n` to indicate that the item you are trying to store with a "cas" command did not exist.

  

#### Retrieval

The commands `get` and `gets` have the following syntax:

`get <key>\r\n`

where `<key>` is a string that identifies an element.

After this command, the client expects zero or more items, each of
which is received as a text line followed by a data block. After all
the items have been transmitted, the server sends the string

`END\r\n`

to indicate the end of response.
 
Each item sent by the server looks like this:

    VALUE <key> <flags> <bytes> [<cas unique>]\r\n
    <data block>\r\n

* `<key>` is the key for the item being sent

 * `<flags>` is the flags value set by the storage command

* `<bytes>` is the length of the data block to follow, *not* including its delimiting \r\n

* `<cas unique>` is a unique 64-bit integer that uniquely identifies this specific item.

* `<data block>` is the data for this item.

## References

  

* [protocol.txt](https://github.com/memcached/memcached/blob/master/doc/protocol.txt)

