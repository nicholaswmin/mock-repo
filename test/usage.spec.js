'use strict'

const chai = require('chai')
const MockRepo = require('../index.js')

const expect = chai.expect
chai.should()

let userRepo

beforeEach(() => {
  userRepo = new MockRepo({
    primary_key: 'id_user'
  })
})

describe('README usage instructions', () => {
  it('README usage example does what it says on the label', () => {
    return userRepo.upsert(null, { id_user: 1, name: 'John Doe' })
      .then(() => {
        return userRepo.upsert(null, { id_user: 1, name: 'John Doooe' })
      })
      .then(() => {
        return userRepo.get(null, { id_user: 1 })
      })
      .then(result => {
        result.should.deep.equal({ id_user: 1, name: 'John Doooe' })
        return
      })
      .then(() => {
        userRepo.items.length.should.equal(1)
      })
  })
})
