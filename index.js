'use strict'

class MockRepo {
  constructor({ primaryKey, Class }) {
    this.primaryKey = primaryKey
    this.Class = Class

    this.items = []
  }

  async upsert(db, instance) {
    let existing = await this.get(db, {
      [this.primaryKey]: instance.props[this.primaryKey]
    })

    if (existing) {
      existing = JSON.stringify(instance.props)
      return
    }

    await this.items.push(JSON.stringify(instance.props))
  }

  async get(db, filter) {
    const obj = this.items.map(item => JSON.parse(item)).find(item => {
      return Object.keys(filter).every(key => {
        return item[key] === filter[key]
      })
    })

    return obj ? new this.Class(obj) : null
  }
}

module.exports = MockRepo
