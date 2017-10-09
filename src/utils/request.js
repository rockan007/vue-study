import consts from '../mock-data/consts'

export default {
  /**
   * 发送数据
   * @param url  接口地址
   * @param data 发送的数据
   * @param callback 回调
   */
  postData: function (url, data, callback) {
    let request = new XMLHttpRequest()
    request.responseType = 'json'
    request.onreadystatechange = function () {
      console.log('此时的状态：' + request.readyState)
      console.log('此时的数据：' + JSON.stringify(request.response))
      if (request.readyState === 4) {
        if (request.response === null) {
          return
        }
        callback(request.response)
      }
    }
    request.open('POST', url, true)
    request.send(data)
  },
  //获取部门列表
  getDepartList: function (callback) {
    this.postData(consts.MAINURL, JSON.stringify({
      cmd: 'persondeparts',
      type: 'findpage'
    }), function (response) {
      console.log('获取的部门列表值：' + JSON.stringify(response))
      if (response.RspCode === '0000') {
        callback(response.RspData)
      }
    })
  },
  /**
   *
   * @param id  部门id
   * @param colv 0 1  是否递归
   * @param callcol 0 1 是否获取详情
   * @param callback
   */
  getDepartPersons: function (id, colv, callcol, callback) {
    if (callcol) {
      callcol = 'info'
    } else {
      callcol = 'base'
    }
    if (typeof(id.value) !== 'undefined') {
      id = id.value
    }
    this.postData(consts.MAINURL, JSON.stringify({
      cmd: 'departpersons',
      type: 'findpage',
      colid: id,
      colv: colv,
      callcol: callcol
    }), function (response) {
      console.log('获取的部门人员列表列表值：' + JSON.stringify(response))
      if (response.RspCode === '0000') {
        callback(response.RspData)
      } else {
        callback([])
      }
    })
  },
  publishMessage: function (users, content, callback) {

    let comData = {
      cmd: 'msg',
      type: 'text',
      touser: userids.join('|'),
      toparty: '',
      totag: '',
      content: content,
      tousername: usernames.join('|'),
      topartyname: '',
      totagname: ''
    }
    this.postData(consts.MAINURL, JSON.stringify(comData), function (response) {
      console.log('发布消息返回的值：' + JSON.stringify(response))
      callback(response)
    })
  },
  /**
   * 发送通知接口
   * @param users 用户
   * @param departs 部门
   * @param dataInfo 数据
   * @param callback 回调
   */
  postMessage: function (users, departs, dataInfo, callback) {
    let comData = {
      cmd: 'msg',
      touser: Array.from(users.keys()).join('|'),
      toparty: Array.from(departs.keys()).join('|'),
      totag: '',
      safe: 0,
      tousername: Array.from(users.values()).join('|'),
      topartyname: Array.from(departs.values()).join('|'),
      totagname: ''
    }
    Object.assign(comData, dataInfo)
    console.log('发布信息传递的值：' + JSON.stringify(comData))
    this.postData(consts.MAINURL, JSON.stringify(comData), function (response) {
      console.log('发布消息返回的值：' + JSON.stringify(response))
      callback(response)
    })

  }
}
