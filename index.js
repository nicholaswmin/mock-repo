'use strict'

class MockRepo {
  constructor({ primary_key, items }) {
    this._primary_key = primary_key
    this.items = items || []
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
    } else {
      this.items.push(item);
    }

    return
  }

  async get(db, filter) {
    const filterKeys = Object.keys(filter)

    return this.items.find(existingItem => {
      return filterKeys.every(key => {
        return existingItem[key] === filter[key]
      })
    })
  }
}

module.exports = MockRepo
