export default {
  getSessionArray: function (key) {
      if(sessionStorage.getItem(key)){
        return JSON.parse(sessionStorage.getItem(key))
      }
      return [];
  },
  setSessionArray:function (key,arr) {
     sessionStorage.setItem(key,JSON.stringify(arr))
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
  /**
   * 获取存储在本地的localStorage
   * @param {String} key 数组对应的key值
   */
  getSessionSet: function (key) {
    let set
    if (sessionStorage.getItem(key)) {
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
    console.log('***getSessionMapValue***获取的部门已选择的人的数组' + JSON.stringify(map))
    if (map.has(key)) {
      return map.get(key)
    }
    return null
  },
  setSessionMapValue: function (storageKey, key, value) {
    let map = this.getSessionMap(storageKey)
    map.set(key, value)
    sessionStorage.setItem(storageKey, JSON.stringify([...map]))
    console.log('****setSessionMapValue***放置的本地值：' + JSON.stringify(map))
  }
}
