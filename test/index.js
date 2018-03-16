'use strict'

const chai = require('chai')
const Guid = require('guid')
const MockRepo = require('../index.js')

chai.should()

class User {
  constructor({ id_user = Guid.raw(), name }) {
    this.props = {
      id_user,
      name
    }
  }
}

let repo

beforeEach(() => {
  repo = new MockRepo({
    primaryKey: 'id_user',
    Class: User
  })
})

describe('#upsert', () => {
  it('Saves an instance if it does not exist by PK', () => {
    return repo.upsert(null, new User({ id_user: 'foo', name: 'John Doe' }))
      .then(result => {
        repo.items.should.have.length(1)
        JSON.parse(repo.items[0]).should.deep.equal({
          id_user: 'foo',
          name: 'John Doe'
        })
      })
  })

  it('Updates the instance if it exists by PK', () => {
    return repo.upsert(null, new User({ id_user: 'foo', name: 'Mary Jane' }))
      .then(result => {
        repo.items.should.have.length(1)
        JSON.parse(repo.items[0]).should.deep.equal({
          id_user: 'foo',
          name: 'Mary Jane'
        })
      })
  })
})

describe('#get', () => {
  it('Retrieves an instance that matches the filter ', () => {
    return repo.upsert(null, new User({ id_user: 'foo', name: 'John Doe' }))
      .then(() => {
        return repo.get(null, { name: 'John Doe' })
      })
      .then(result => {
        result.should.be.an.instanceof(User)
        result.should.deep.equal({
          props: {
            id_user: 'foo',
            name: 'John Doe'
          }
        })
      })
  })
})

describe('#getAll', () => {
  it('Retrieves instances that match the filter ', () => {
    return repo.upsert(null, new User({ id_user: 'foo', name: 'John' }))
      .then(() => {
        return repo.upsert(null, new User({ id_user: 'bar', name: 'John' }))
      })
      .then(() => {
        return repo.getAll(null, { name: 'John' })
      })
      .then(result => {
        result.forEach(result => {
          result.should.be.an.instanceof(User)
        })
      })
  })
})
