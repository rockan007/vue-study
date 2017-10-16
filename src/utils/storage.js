export let storage = {
  /**
   * 在本地储存数组中 添加 或删除 value
   * @param {Object} key 键值
   * @param {Object} value 要存储或删除的值
   * @param {Object} isAdd 0删除 1添加
   */
  toggleValueInSessionArray: function (key, value, isAdd) {
    let arr = this.getSessionArray(key)
    console.log('获取的本地的值：' + JSON.stringify(arr))
    sessionStorage.setItem(key, JSON.stringify(this.toggleValueInArray(arr, value, isAdd)))
  },
  /**
   * 数组中删除或添加值
   * @param {Object} arr 数组
   * @param {Object} value 要添加或删除的值
   * @param {Object} isAdd 0删除 1添加
   */
  toggleValueInArray: function (arr, value, isAdd) {
    console.log('是否添加数据？' + isAdd + ',要处理的值:' + value)
    let arrs = this.isExistInArray(arr, value)
    if (isAdd) {
      if (arrs[1] < 0) {
        arrs[0].push(value)
      }
    } else {
      if (arrs[1] >= 0) {
        arrs[0].splice(arrs[1], 1)
      }
    }
    console.log('加载或删除后的数组：' + JSON.stringify(arrs[0]))
    return arrs[0]
  },
  /**
   * 获取存储在本地的localStorage
   * @param {Object} key 数组对应的key值
   */
  getSessionArray: function (key) {
    let arr
    if (sessionStorage.getItem(key)) {
      arr = JSON.parse(sessionStorage.getItem(key))
    } else {
      arr = []
    }
    console.log('获取的本地存储数组：' + JSON.stringify(arr))
    return arr
  },
  /**
   *
   * @param key 键值
   * @param value 存储的值
   */
  setSessionStorage: function (key, value) {
    console.log('***setSessionStorage****')
    if (typeof (value) === 'undefined') {
      console.log('要存储的值is undefined')
      return
    }
    console.log('要存储的值：' + JSON.stringify(value))
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  isExistInSessionArray: function (key, value) {
    let arr = this.getSessionArray(key)
    return this.isExistInArray(arr, value)
  },
  isExistInArray: function (arr, value) {
    let arrs = [arr, arr.indexOf(value)]
    console.log('获取的是否值是否存在于数组中：' + JSON.stringify(arrs))
    return arrs
  },
  /**
   * 在本地储存数组中 添加 或删除 value
   * @param {String} key 键值
   * @param {Object} value 要存储或删除的值
   * @param {Object} isAdd 0删除 1添加
   */
  toggleValueInSessionSet: function (key, value, isAdd) {
    let set = this.getSessionSet(key)
    console.log('获取的本地的值：' + JSON.stringify(set))
    sessionStorage.setItem(key, JSON.stringify(this.toggleValueInSet(set, value, isAdd)))
  },
  toggleValueInSet: function (set, value, isAdd) {
    if (isAdd) {
      set.add(value)
    } else {
      set.delete(value)
    }
    return set
  },
  setSessionSet: function (storageKey, set) {
    this.setSessionStorage(storageKey, Array.from(set))
  },
  /**
   * 获取存储在本地的localStorage
   * @param {String} key 数组对应的key值
   */
  getSessionSet: function (key) {
    let set
    if (sessionStorage.getItem(key)) {
      console.log('getSessionSet:' + sessionStorage.getItem(key))
      set = new Set(JSON.parse(sessionStorage.getItem(key)))
    } else {
      set = new Set()
    }
    console.log('获取的本地存储数组：' + JSON.stringify(set))
    return set
  },
  isExistInSessionSet: function (key, value) {
    let set = this.getSessionArray(key)
    return set.has(value)
  },
  getSessionMap: function (key) {
    console.log('****getSessionMap***获取的本地值:' + sessionStorage.getItem(key))
    if (sessionStorage.getItem(key)) {
      return new Map(JSON.parse(sessionStorage.getItem(key)))
    }
    return new Map()
  },
  getSessionMapValue: function (storageKey, key) {
    let map = this.getSessionMap(storageKey)
    console.log('***getSessionMapValue***' + JSON.stringify(map))
    if (map.has(key)) {
      return map.get(key)
    }
    return null
  },
  toggleValueInSessionMap: function (storageKey, key, value, isAdd) {
    console.log('***toggleValueInSessionMap***')
    let map = this.getSessionMap(storageKey)
    this.toggleValueInMap(map, key, value, isAdd)
    console.log('处理后的map' + JSON.stringify([...map]))
    this.setSessionMap(storageKey, map)
  },
  setSessionMap: function (storageKey, map) {
    console.log('***setSessionMap***')
    this.setSessionStorage(storageKey, [...map])
  },
  toggleValueInMap: function (map, key, value, isAdd) {
    console.log('***toggleValueInMap***')
    if (isAdd) {
      map.set(key, value)
    } else {
      if (map.has(key)) {
        map.delete(key)
      }
    }
  }
}
