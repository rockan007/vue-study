export default {
  MAINURL: 'https://jsypay.jiaobaowang.net/wxth/appschweb/schwebapi.aspx',
  CONFIGURL: 'https://jsypay.jiaobaowang.net/wxth/jssdkapi.aspx',
  UPLOADURL: 'https://jsypay.jiaobaowang.net/wxth/appschweb/FileUpLoad.ashx',
  KEY_DEPARTS: 'key-departments',
  KEY_CHOOSE_PERSONS: 'key-choosePersons',
  KEY_CHOOSE_DEPARTS: 'key-chooseDeparts',
  KEY_CHOSE_MAP: 'key-choseMap',
  KEY_DEPART_POSITION: 'key-depart-position',
  MSGHOMEBARS: [{
    img: '../images/icon_tabbar.png',
    label: '新建通知',
    routerLink: 'dynamic-publish'
  }, {
    img: '../images/icon_tabbar.png',
    label: '查看通知',
    routerLink: 'message-container'
  }],
  MSGSTYLES: [{
    type: 'text',
    msgtype: 'text',
    typeNo: 0,
    typeName: '文字'
  }, {
    type: 'textcard',
    msgtype: 'textcard',
    typeNo: 1,
    typeName: '文本卡片'
  }, {
    type: 'news',
    msgtype: 'news',
    typeNo: 2,
    typeName: '图文'
  }, {
    type: 'image',
    msgtype: 'image',
    typeNo: 3,
    typeName: '图片'
  }, {
    type: 'voice',
    msgtype: 'voice',
    typeNo: 4,
    typeName: '语音'
  }, {
    type: 'video',
    msgtype: 'video',
    typeNo: 5,
    typeName: '视频'
  }, {
    type: 'file',
    msgtype: 'file',
    typeNo: 6,
    typeName: '文件'
  }],
  MSGBANNERS: [
    {
      type: 0,
      content: '全部'
    },
    {
      type: 1,
      content: '已阅读'
    },
    {
      type: 2,
      content: '未阅读'
    },
    {
      type: 3,
      content: '我发的'
    }
  ]
}
