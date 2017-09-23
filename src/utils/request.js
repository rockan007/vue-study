import consts from '../mock-data/consts';
export default {
  getData: function (url, data, callback) {
    $.getJSON(url, data, callback)
  },
  postData: function (url, data, callback) {
    $.post(url, data, callback)
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
   * @param id
   * @param colv
   * @param callcol
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
   * 发送消息
   * @param {Object} users 用户
   * @param {Object} dataInfo 发送的数据信息
   */
  postMessage: function (users, dataInfo, callback) {
    let userids = users.map(function (user) {
      return user.userid
    })
    let usernames = users.map(function (user) {
      return user.name
    })
    let comData = {
      cmd: 'msg',
      touser: userids.join('|'),
      toparty: '',
      totag: '',
      safe: 0,
      tousername: usernames.join('|'),
      topartyname: '',
      totagname: ''
    }
    $.extend(comData, dataInfo)
    console.log('发布信息传递的值：' + JSON.stringify(comData))
    this.postData(consts.MAINURL, JSON.stringify(comData), function (response) {
      console.log('发布消息返回的值：' + JSON.stringify(response))
      callback(response)
    })

  }
}
