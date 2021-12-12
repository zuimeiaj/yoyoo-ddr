class Vector {
  constructor(lst) {
    this._values = lst
  }

  toString() {
    return `Vector(${this._values.join(', ')})`
  }

  get length() {
    return this._values.length
  }

  dot(vector) {
    if (vector instanceof Vector && this.length === vector.length) {
      return this._values.map((item, index) => item * vector._values[index]).reduce((a, b) => a + b)
    }
    throw Error('The param `vector` must instance of Vector')
  }

  get(index) {
    return this._values[index]
  }
}

export default Vector
