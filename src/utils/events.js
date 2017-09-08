export default {
  /**
   * 在本地储存数组中 添加 或删除 value
   * @param {String} key 键值
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
  isExistInSessionArray: function (key, value) {
    let arr = this.getSessionArray(key)
    return this.isExistInArray(arr, value)
  },
  isExistInArray: function (arr, value) {
    let arrs = [arr, arr.indexOf(value)]
    console.log('获取的是否值是否存在于数组中：' + JSON.stringify(arrs))
    return arrs
  },
  getSessionMap: function (key) {
    console.log('****getSessionMap***获取的本地值:' + sessionStorage.getItem(key))
    if (sessionStorage.getItem(key)) {
      return JSON.parse(sessionStorage.getItem(key))
    }
    return {}
  },
  getSessionMapValue: function (storageKey, key) {
    let map = this.getSessionMap(storageKey)
    console.log('***getSessionMapValue***获取的部门已选择的人的数组' + JSON.stringify(map))
    if (map[key]) {
      return map[key]
    }
    return []
  },
  setSessionMapValue: function (storageKey, key, value) {
    let map = this.getSessionMap(storageKey)
    map[key] = value
    sessionStorage.setItem(storageKey, JSON.stringify(map))
    console.log('****setSessionMapValue***放置的本地值：' + JSON.stringify(map))
  }
}
