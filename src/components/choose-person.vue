<template>
  <div v-if="isLoading">loading</div>
  <div v-else class="weui-cells">
    <label v-for="(item,index) in curDepartInfo.personList" v-bind:for="item.userid"
           class="weui-cell weui-check__label">
      <div class="weui-cell__hd">
        <input type="checkbox" class="weui-check" v-bind:id="item.userid" v-bind:value="item.userid"
               v-bind:checked="isAllChecked||item.isChecked"
               v-on:change="togglePerson(item,$event)">
        <i class="weui-icon-checked"></i>
      </div>
      <divx class="weui-cell__bd">
        <p>{{item.name}}</p>
      </divx>
    </label>
    <a v-for="(item,index) in curDepartInfo.departList" class="weui-cell weui-cell_access">
      <div class="weui-cell__hd">
        <label v-bind:for="item.value">
          <input type="checkbox" class="" v-bind:id="item.value" v-bind:value="item.value"
                 v-bind:checked="isAllChecked||item.isChecked"
                 v-on:change="toggleDepart(item,$event)"/>
          <i class="weui-icon-checked"></i>
        </label>
      </div>
      <div class="weui-cell__bd" v-on:click="clickEvent(item,index)">
        <p>{{item.title}}</p>
      </div>
      <div class="weui-cell__ft" v-on:click="clickEvent(item,index)">
      </div>
    </a>
  </div>

</template>
<script>
  import consts from '../mock-data/consts'
  import events from '../utils/events'
  import request from '../utils/request'
  import router from '../router/index'

  export default {
    name: 'choose-person',
    data: function () {
      return {
        curDepartInfo: {},
        treeDepartList: [],
        isLoading: false,
        id: this.depart_id,
        path: this.$route.params.path,
        isAllChecked: false,
        departId: this.$route.params.id,
        nodes: [{'value': 2, 'title': '湖北大区', 'parentvalue': 1, 'order': 2147483447}, {
          'value': 3,
          'title': '荆门办事处',
          'parentvalue': 2,
          'order': 2147483447
        }, {'value': 4, 'title': '大区办公室', 'parentvalue': 2, 'order': 2147483247}, {
          'value': 5,
          'title': '黄冈办事处',
          'parentvalue': 2,
          'order': 2147483047
        }, {'value': 6, 'title': '黄石咸宁鄂州办事处', 'parentvalue': 2, 'order': 2147482847}, {
          'value': 7,
          'title': '襄阳孝感随州办事处',
          'parentvalue': 2,
          'order': 2147482647
        }, {'value': 8, 'title': '宜昌恩施办事处', 'parentvalue': 2, 'order': 2147482447}, {
          'value': 9,
          'title': '荆州江汉办事处',
          'parentvalue': 2,
          'order': 2147482247
        }, {'value': 11, 'title': '开发部', 'parentvalue': 1, 'order': 2147483047}, {
          'value': 12,
          'title': '测试子部门',
          'parentvalue': 11,
          'order': 100000000
        }, {'value': 13, 'title': '测试孙部门', 'parentvalue': 12, 'order': 100000000}, {
          'value': -1,
          'title': '全部',
          'parentvalue': 0,
          'order': 0
        }]
      }
    },
    created: function () {
      this.getAllDepartsList()
    },
    watch: {
      '$route' (to, from) {
        console.log('当前路由id:' + this.$route.params.id)
        console.log('当前路由的路径：' + this.$route.params.path)
        this.getAllDepartsList()
      },
    },
    methods: {
      /**
       * 获取所有部门信息
       */
      getAllDepartsList: function () {
        console.log('*********getAllpersonList******')
        let com = this
        com.getParentList()
//        com.rechargeList()
        com.isLoading = true
        if (events.getSessionArray(consts.KEY_TREE_DEPARTS.length > 0)) {
          com.treeDepartList = events.getSessionArray(consts.KEY_TREE_DEPARTS)
        } else {
          request.getDepartList(function (data) {
            console.log('getAllpersonList获取的部门列表：' + JSON.stringify(JSON.parse(data)))
            //获取的树形结构的数据（包含部门）
            com.treeDepartList = com.rechargeList(data)
            events.setSessionArray(consts.KEY_TREE_DEPARTS, com.treeDepartList)
            //获取当前部门子部门
            com.getCurDepartInfo()
            com.getCurPersons()
          })
        }

      },

      /**
       * 获取当前部门人员
       */
      getCurPersons: function () {
        console.log('********getCurPersen获取当前部门人员********')
        if (this.curDepartInfo.personList.length > 0) {
          this.isLoading = false
        } else {
          let com = this
          request.getDepartPersons(com.$route.params.id, 0, 0, function (data) {
            console.log('获取的本部门人员:' + JSON.stringify(data))
            com.setItemsStatus(data, 1)
            com.curDepartInfo.personList = data
            com.isLoading = false
          })
        }

      },
      /**
       * 列表cell
       * @param {Object} item
       */
      clickEvent: function (item, index) {
        console.log('********clickEvent********')
        if (typeof(item.value) !== 'undefined') {
          console.log('路由跳转')
          this.routerTo(item.value, index)
        }
      },
      /**
       *  显示组件状态
       *  @param {Array} items
       *  @param {Number} type
       */
      setItemsStatus: function (items, type) {

        if (this.curDepartInfo.isChecked) {//如何判断此部门已全选
          this.isAllChecked = true
          this.setCurListChecked()
          return
        }
        if (type) {//部门
          this.setDepartsStatus(items)
        } else {//人员
          this.setPersonsStatus(items)
        }
      },
      /**
       * 设置当前部门的列表的选择状态
       */
      setCurListChecked: function () {
        //此部门已选，则此部门的子部门设置全选
        this.curDepartInfo.departList = this.curDepartInfo.departList.map(function (depart) {

          events.toggleValueInSessionSet(consts.KEY_ALL_CHOOSE_DEPARTS, depart.value, true)
          return depart.isChecked = true
        })
        //此部门已选，则此部门的人员设置全选
        this.curDepartInfo.personList = this.curDepartInfo.personList.map(function (person) {
          return person.isChecked = true
        })
      },
      /**
       * 获取的父部门信息
       */
      getParentDepart: function () {
        let departList = events.getSessionArray(consts.KEY_TREE_DEPARTS)
        let arrPath = this.path.split('-')
        if (arrPath.length > 1) {
          return this.getNodeInTree(departList, arrPath.splice(arrPath.length - 1))
        }
        return null
      },
      /**
       * 设置部门状态
       *
       */
      setDepartsStatus: function (departs) {

      },
      /**
       * 设置人员状态
       * 如果人员存在于已选列表,则标记选择，否则，标记未选
       *
       */
      setPersonsStatus: function (persons) {
        for (let i in persons) {
          if (persons[i].department.length > 1) {
            persons[i].isChecked = events.isExistInSessionSet(consts.KEY_ALL_CHOOSE_PERSON, persons[i].userId)
          }
        }
      },
      /**
       * 选择或取消选择人员的响应方法
       * @param {Object} item
       * @param {Object} event
       */
      togglePerson: function (item, event) { //关注的人 选择
        console.log('********togglePerson人员选择********')
        let isAdd = event.target.checked
        console.log('********关注的人事件传递********')
        this.$emit('togglePerson', item, isAdd)
        this.toggleDepartsByPerson(item, isAdd)
        this.setItemsStatus(this.personList, 0)
      },
      /**
       *
       * @param {Object} person 选择或取消选择的信息
       * @param {Object} isAdd 添加删除逻辑
       */
      toggleDepartsByPerson: function (person, isAdd) { //
        console.log('********changeSessionByPerson人员选择后的响应********')
        let com = this
        if (person.deparment.length === 1) {//人员只存在于此部门中，删除人员
          if (!isAdd) {//取消选择人员
            if (com.curDepartInfo.isChecked) {
              com.curDepartInfo.isChecked = false
              com.isAllChecked = false

            }
          } else {//选择人员

          }
        }
      },
      toggleSingleDepartById: function (departId, isAdd) {
        let departList = events.getSessionArray(consts.KEY_TREE_DISORDER_DEPARTS)
        for (let i in departList) {
          if (departList[i].value === departId) {

          }
        }
        if (isAdd) {

        } else {

        }
      },
      getDepartInList: function () {

      },
      toggleSingleDepart: function () {

      },
      /**
       *
       */
      togglePersonInDepart: function (departId, person, isAdd) {

      },
      toggleCurDepartChecked: function () {

      },

      /**
       *
       * 如果此部门被选择，则所有子部门和人员被选择
       * 如果此部门取消选择，则此部门所有子部门和人员取消选择
       * 获取当前选中或反选的部门信息，并将所有子部门的属性设置为已选或取消选中的children
       /**
       * 选择或取消选择部门的响应方法
       * @param {Object} item
       * @param {Object} event
       */
      toggleDepart: function (item, event) { //关注的部门选择
        console.log('********toggleDepart部门选取事件********')
        let com = this
        let isAdd = event.target.checked
        console.log('******传递事件togglePerson******')
        com.$emit('togglePerson', item.allPersen, isAdd)
        let childDeparts = this.getAllChildDeparts(item.value)
        childDeparts.push(item)
        //添加或删除本地已选择部门数据
        //包括本部门 和所有子部门
        childDeparts.forEach(function (child) {
          events.toggleValueInSessionSet(consts.KEY_CHOOSE_DEPARTS, child.value, isAdd)
        })
        console.log('保存或删除本部门及子部门：' + events.getSessionSet(consts.KEY_CHOOSE_DEPARTS))
        //人员选择
        //item.persen 它的响应逻辑
        item.allPersen.forEach(function (person) {
          //单个人员选择或取消选择的响应逻辑
          com.changeSessionByPerson(person, isAdd)
        })
        //设置页面状态
        com.setItemsStatus(com.personList, 0)
      },
      //获取当前部门信息及子部门列表
      getCurDepartInfo: function () {
        let pathArr = this.path.split('-')
        this.curDepartInfo = this.getNodeInTree(this.treeDepartList, pathArr)
        this.setItemsStatus(this.curDepartInfo.children, 1)//设置item的状态
        this.departList = this.curDepartInfo.children
      },
      getNodeInTree: function (tree, pathArr) {
        if (pathArr.length === 1) {
          console.log('根据路径获取的node节点：' + JSON.stringify(tree[pathArr[0]]))
          return tree[pathArr[0]]
        } else {
          this.getNodeInTree(tree[pathArr[0]], pathArr.splice(0, 1))
        }
      },
      //通过部门id 更新界面
      routerTo: function (value, index) {
        console.log('********routerTo路由跳转********')
        router.push({
          name: 'choose-person',
          params: {
            id: parseInt(value),
            path: this.$route.params.path + '-' + index
          }
        })
      },
      rechargeList: function (nodes) {
        if (!nodes || nodes.length === 0) {
          nodes = this.nodes
        }
        nodes.sort(function (a, b) {
          return a.value - b.value
        })
        let map = {},
          node, roots = []
        for (let i = 0; i < nodes.length; i++) {
          node = nodes[i]
          node.departList = []
          map[node.value] = i // use map to look-up the parents
          if (node.parentvalue > 0) {
            if (node.parentvalue === 1) {
              nodes[map[-1]].departList.push(node)
            } else {
              nodes[map[node.parentvalue]].departList.push(node)
            }
          } else {
            roots.push(node)
          }
        }
        console.log('重拍数组后的数据：' + JSON.stringify(roots))
        return roots
      },
      getParentList: function (nodes) {
        if (!nodes || nodes.length === 0) {
          nodes = this.nodes
        }
        nodes.sort(function (a, b) {
          return a.value - b.value
        })
        let map = {},
          node,
          roots = []
        for (let i = 0; i < nodes.length; i++) {
          node = nodes[i]

          map[node.value] = i // use map to look-up the parents
          roots.push(node)
          if (node.parentvalue > 0) {
            if (node.parentvalue === 1) {
              nodes[i].parentDepart = nodes[map[-1]]
            } else {
              nodes[i].parentDepart = nodes[map[node.parentvalue]]
            }
          }
        }
        console.log('重拍数组后的数据：' + JSON.stringify(roots))
        return roots
      }
    }
  }
</script>
<style scoped>
  input[type=checkbox] {
    position: absolute;
    z-index: -9999;
    opacity: 0;
  }

  .weui-icon-checked:before {
    content: '\EA01';
    color: #C9C9C9;
    font-size: 23px;
    display: block;
  }

  input[type=checkbox]:checked + .weui-icon-checked:before {
    display: inline-block;
    content: '\EA06';
    color: #09BB07;
    font-size: 23px;
    display: block;
  }

  .weui-cells {
    margin-top: 0;
  }
</style>
