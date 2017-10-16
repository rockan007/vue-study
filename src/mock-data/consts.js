/**
 * 常量文件
 */
export let consts = {
  MAINURL: 'https://jsypay.jiaobaowang.net/wxth/appschweb/schwebapi.aspx',//主url
  CONFIGURL: 'https://jsypay.jiaobaowang.net/wxth/jssdkapi.aspx',//微信config设置获取url
  UPLOADURL: 'https://jsypay.jiaobaowang.net/wxth/appschweb/FileUpLoad.ashx',//文件上传url
  KEY_DEPARTS: 'key-departments',//部门数据
  KEY_DEPARTS_CHILDREN_TREE: 'key-tree-departs',//树形结构的部门数据
  KEY_DEPARTS_PARENTS_TREE: 'key-tree-disorder-departs',
  KEY_ALL_CHOOSE_PERSON: 'key-all-choose-person',//全部已选人员，包括已选部门内人员
  KEY_ALL_CHOOSE_DEPARTS: 'key-all-choose-departs',//全部已选部门，包括已选部门的子部门
  KEY_CHOOSE_PERSONS: 'key-choosePersons',//已选人员
  KEY_CHOOSE_DEPARTS: 'key-chooseDeparts',//已选部门
  KEY_CHOSE_MAP: 'key-choseMap',
  KEY_DEPART_POSITION: 'key-depart-position',//当前部门位置
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
