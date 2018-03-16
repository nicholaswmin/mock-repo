# mock-repo

[![Build Status](https://travis-ci.org/nicholaswmin/mock-repo.svg?branch=master)](https://travis-ci.org/nicholaswmin/mock-repo)

A Node.js generic mock repo for simulating repositories in the
[Repository Pattern][1]. Helps to avoid touching the database when testing
business logic

## Installation

```bash
$ npm install --save-dev mock-repo
```

## Overview

This module exports an ES6 Class with simple methods that are most commonly
present in Repositories. You can `extend` if you need more methods.

## Usage

A Class can be persisted if it satisfies the following criteria:

- 1st argument of it's constructor accepts an `Object` that contains
  *at least* all the persistable properties.
- It has a `props` property that contains all the props that should be
  persisted.

```javascript
class User {
  constructor({ id_user = Guid.raw(), name }) {
    this.props = {
      id_user,
      name
    }

    // Anything outside `props` will *not* be persisted
    // - e.g `age` property will not be persisted
    this.age = 15
  }

  getName() {
    return this.name
  }
}
```

- `upsert(db, instance)`

If the provided object pre-exists by `primaryKey`, then the repo will update
the existing object, otherwise it will insert it.

- `get(db, filter)`

Returns an item by some specified criteria.

You can include multiple criteria,
but be aware that *all* criteria must match (it simulates an SQL `andWhere()`).

- `getAll(db, filter)`

Same as `get()` but returns multiple instances. If no `filter` is provided,
it returns all instances.

### Example

In the following example we are going to:

- Insert a user with `name` 'John Doe' and `id_user` 1.
- Then update his `name` to 'John Doooe'.
- Then get him back by the `id_user` we used when we first inserted him.

The following example assumes your `Class` looks like this:

```javascript
class User {
  constructor({ id_user = Guid.raw(), name }) {
    this.props = {
      id_user,
      name
    }
  }
}
```

Then:

```javascript

const MockRepo = require('mock-repo')
const userRepo = new MockRepo({
  primaryKey: 'id_user',
  constructAs: data => new User(data)
})

/*
 * 1st argument on *all* methods is supposed to be the `db` object in
 * production, when you actually use a real database.
 *
 * You can pass `null` when using this module
 */
userRepo.upsert(null, new User({ id_user: 1, name: 'John Doe' }))
  .then(() => {
    return userRepo.upsert(null, new User({ id_user: 1, name: 'John Doooe' }))
  })
  .then(() => {
    return userRepo.get(null, { id_user: 1 })
  })
  .then(result => {
    console.log(result) // logs `User { id_user: 1, name: 'John Doooe' }`
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
