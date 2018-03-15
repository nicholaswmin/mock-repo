'use strict'

class MockRepo {
  constructor({ primary_key, Class }) {
    this.primary_key = primary_key
    this.Class = Class

    this.items = []
  }

  async upsert(db, instance) {
    let existing = await this.get(db, {
      [this.primary_key]: instance.props[this.primary_key]
    })

    if (existing) {
      existing = JSON.stringify(instance)
      return
    }

    await this.items.push(JSON.stringify(instance))
  }

  async get(db, filter) {
    const obj = this.items.map(item => JSON.parse(item)).find(item => {
      return Object.keys(filter).every(key => {
        return item.props[key] === filter[key]
      })
    })

    return obj ? new this.Class(obj.props) : null
  }
}

module.exports = MockRepo
