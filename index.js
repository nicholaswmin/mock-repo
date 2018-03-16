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
      this._updateByPK(
        existing.props[this.primaryKey],
        JSON.stringify(instance.props)
      )
      return
    }

    await this.items.push(JSON.stringify(instance.props))
  }

  async get(db, filter) {
    const obj = this.items.map(item => JSON.parse(item))
      .find(this._matchesFilter(filter))

    return obj ? new this.Class(obj) : null
  }

  async getAll(db, filter) {
    return this.items.map(item => JSON.parse(item))
      .filter(this._matchesFilter(filter))
      .map(item => new this.Class(item))
  }

  _updateByPK(pk, newValue) {
    this.items.forEach((item, i) => {
      const parsed = JSON.parse(item)

      if (parsed[this.primaryKey] === pk) {
        this.items[i] = newValue
      }
    })
  }

  _matchesFilter(filter) {
    return filter ? item => {
      return Object.keys(filter).every(key => {
        return item[key] === filter[key]
      })
    } : item
  }
}

module.exports = MockRepo
