'use strict'

class MockRepo {
  constructor({ primary_key, items }) {
    this._primary_key = primary_key
    this.items = items || []
  }

  async insert(db, item) {
    this.items.push(item)
  }

  async upsert(db, item) {
    const existing = await this.get(db, {
      [this._primary_key]: item[this._primary_key]
    })

    if (existing) {
      this.items.forEach((existingItem, index) => {
        if (existingItem[this._primary_key] === item[this._primary_key]) {
          this.items[index] = item
        }
      })

      return
    }

    this.items.push(item);
  }

  async get(db, filter) {
    return this.items.find(existingItem => {
      return Object.keys(filter).every(key => {
        return existingItem[key] === filter[key]
      })
    })
  }
}

module.exports = MockRepo
