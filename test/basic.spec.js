'use strict'

const chai = require('chai')
const MockRepo = require('../index.js')

const expect = chai.expect
chai.should()

let mockRepo

beforeEach(() => {
  mockRepo = new MockRepo({
    primary_key: 'id_user'
  })
})

describe('#Instantiation', () => {
  it('instantiates', () => {
    mockRepo.should.be.ok
  })
})

describe('#Insert', () => {
  beforeEach(() => {
    return mockRepo.insert(null, {
      id_user: 1,
      name: 'John Doe'
    })
  })

  it('inserts an item', () => {
    mockRepo.items.should.have.length(1)
  })

  it('inserts an item again, even if it already exists by primary key', () => {
    return mockRepo.upsert(null, {
      id_user: 1,
      name: 'John Doe'
    }).then(() => {
      mockRepo.items.should.have.length(1)
    })
  })
})

describe('#Upsert', () => {
  describe('Item does not already exist by primary key', () => {
    beforeEach(() => {
      return mockRepo.upsert(null, {
        id_user: 1,
        name: 'John Doe'
      })
    })

    it('inserts a new item', () => {
      mockRepo.items.should.have.length(1)
    })

    it('inserted item matches is the one we passed', () => {
      mockRepo.items.pop().should.deep.equal({
        id_user: 1,
        name: 'John Doe'
      })
    })
  })

  describe('Item already exists by primary_key', () => {
    beforeEach(() => {
      return mockRepo.upsert(null, {
        id_user: 1,
        name: 'John Doe'
      }).then(() => {
        return mockRepo.upsert(null, {
          id_user: 1,
          name: 'John Doe Updated'
        })
      })
    })

    it('does not insert a new item', () => {
      mockRepo.items.should.have.length(1)
    })

    it('existing item is updated to match the one we passed', () => {
      mockRepo.items.pop().should.deep.equal({
        id_user: 1,
        name: 'John Doe Updated'
      })
    })
  })
})

describe('#get', () => {
  beforeEach(() => {
    return mockRepo.upsert(null, {
      id_user: 1,
      name: 'John Doe'
    }).then(() => {
      return mockRepo.upsert(null, {
        id_user: 2,
        name: 'Mary Jane'
      })
    })
  })

  it('returns an item by primary key', () => {
    return mockRepo.get(null, { id_user: 1 }).then(result => {
      result.should.be.an('Object')
      result.name.should.equal('John Doe')
    })
  })

  it('returns an item by multiple criteria', () => {
    return mockRepo.get(null, { id_user: 1, name: 'John Doe' }).then(result => {
      result.should.be.an('Object')
      result.name.should.equal('John Doe')
    })
  })

  it('does not return an item if a criterion fails to match', () => {
    return mockRepo.get(null, { id_user: 1, name: 'John Wrong' }).then(result => {
      expect(result).to.be.undefined
    })
  })
})
