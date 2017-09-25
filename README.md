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

This module exports an ES6 Class with simple methods that are most commonly
present in Repositories. You can `extend` if you need more methods.

- `insert()`

Adds an item, even it already exists by `primary_key`

- `upsert()`

If the provided object pre-exists by `primary_key`, then the repo will update
the existing object, otherwise it just inserts it.

- `get()`

Returns an item by some specified criteria.

You can include multiple criteria,
but be aware that *all* criteria must match (it simulates an SQL `andWhere()`).

### Example

In the following example we are going to:

- Insert a user with `name` 'John Doe' and `id_user` 1.
- Then update his `name` to 'John Doooe'.
- Then get him back by the `id_user` we used when we first inserted him.

```javascript

const MockRepo = require('mock-repo')
const userRepo = new MockRepo({ primary_key: 'id_user' })

/*
 * 1st argument on *all* methods is supposed to be a `db` object in production,
 * when you actually use a real database.
 *
 * You can pass `null` when using this module
 */
userRepo.upsert(null, { id_user: 1, name: 'John Doe' })
  .then(() => {
    return userRepo.upsert(null, { id_user: 1, name: 'John Doooe' })
  })
  .then(() => {
    return userRepo.get(null, { id_user: 1 })
  })
  .then(result => {
    console.log(result) // logs `{ id_user: 1, name: 'John Doooe' }`
    console.log(userRepo.items.length) // logs '1'
    return
  })
```

**Note**: Stored items are held in the `items` prop of the Mock Repo, i.e
`userRepo.items`, will return all the stored users.

## Tests

```bash

$ npm test

```

## Authors

- Nicholas Kyriakides, [@nicholaswmin][2]

[1]: https://martinfowler.com/eaaCatalog/repository.html
[2]: https://github.com/nicholaswmin
