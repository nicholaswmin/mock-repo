# mock-repo

[![Build Status](https://travis-ci.org/nicholaswmin/mock-repo.svg?branch=master)](https://travis-ci.org/nicholaswmin/mock-repo)

A Node.js generic mock repo for simulating repositories in the
[Repository Pattern][1]. Helps to avoid touching the database when testing
business logic

## Installation

```bash
$ npm install --save-dev mock-repo
```

## Usage

This module provides an ES6 Class with 2 methods that are most commonly
present in Repositories.

The 3 methods are:

- `insert()`

Simply adds an item, even it already exists by `primary_key`

- `upsert()`

You guessed it. If you provide the same object twice to this method, with
identical `primary_key`, the repo will update the existing object, instead
of creating a new one, otherwise it just inserts it.

- `get()`

Simply fetches an item by some specified key. You can include multiple criteria,
but be aware that ALL criteria must match (it simulates an SQL `andWhere()`)

`MockRepo` is an ES6 Class you can `extend` if you need more methods.


### Example

```javascript

const MockRepo = require('mock-repo')
const userRepo = new MockRepo({ primary_key: 'id_user' })

/*
 * 1st argument on methods should be `null` since it simulates the `db` object
 * in a real Repository
 */
userRepo.upsert(null, { id_user: 1, name: 'John Doe' })
  .then(() => {
    return userRepo.upsert(null, { id_user: 1, name: 'John Doooe' })
  })
  .then(() => {
    return userRepo.get(null, { id_user: 1 })
  })
  .then(result => {
    console.log(result)
    return
    // logs `{ id_user: 1, name: 'John Doooe' }`
  })
  .then(() => {
    console.log(userRepo.items.length)
    // logs `1`
  })

```

## Tests

```bash

$ npm test

```

## Authors

- Nicholas Kyriakides, [@nicholaswmin][2]

[1]: https://martinfowler.com/eaaCatalog/repository.html
[2]: https://github.com/nicholaswmin
