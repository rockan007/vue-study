<template>
  <div v-if="isLoading">loading</div>
  <div v-else class="weui-cells">
    <template>
      <!--人员选项-->
      <label v-for="(item,index) in curDepartInfo.personList" v-bind:for="item.userid"
             class="weui-cell weui-check__label">
        <div class="weui-cell__hd">
          <input type="checkbox" class="weui-check" v-bind:id="item.userid" v-bind:value="item.userid"
                 v-bind:checked="isAllChecked||item.isChecked"
                 v-on:change="togglePerson(item,$event)">
          <i class="weui-icon-checked"></i>
        </div>
        <div class="weui-cell__bd">
          <p>{{item.name}}</p>
        </div>
      </label>
      <!--部门选项-->
      <a v-for="(item,index) in curDepartInfo.departList" class="weui-cell weui-cell_access"
         v-on:click="routerToChild(item,index)">
        <div class="weui-cell__bd">
          <p>{{item.title}}</p>
        </div>
        <div class="weui-cell__ft"></div>
      </a>
    </template>
  </div>
</template>
<script>
  import consts from '../mock-data/consts'
  import storage from '../utils/storage'
  import request from '../utils/request'
  import router from '../router/index'

  export default {
    name: 'depart-person',
    data: function () {
      return {
        curDepartInfo: {
          departList: [],
          personList: []
        },
        departId: -1,
        path: '0',
        childrenTree: [],
        isLoading: false
      }
    },
    created: function () {
      this.requireAllDepartList()
    },
    watch: {
      $route (to, from) {
        console.log('当前routeId:' + this.$route.params.id + ',当前routePath:' + this.$route.params.path)
        this.departId = parseInt(this.$route.params.id)
        this.path = this.$route.params.path
        console.log('当前的departId：' + this.departId + ',当前path:' + this.path)
        this.requireAllDepartList()
      }
    },
    methods: {
      setSessionStorage: function () {
        storage.setSessionStorage(consts.KEY_DEPARTS_PARENTS_TREE, this.childrenTree)
      },
      /**
       * 选中，或取消选中的人
       * @param {Object} person 添加或删除的人员
       * @param {e} event 事件
       */
      togglePerson: function (person, event) {
        console.log('***togglePerson***')
        let isAdd = event.target.checked
        storage.toggleValueInSessionMap(consts.KEY_CHOOSE_PERSONS, person.userid, person.name, isAdd)
        this.$emit('chosePersons', storage.getSessionMap(consts.KEY_CHOOSE_PERSONS))
      },

      setPersonListStatus: function () {
        console.log('****setPersonListStatus*****')
        let chosePersonMap = storage.getSessionMap(consts.KEY_CHOOSE_PERSONS)
        for (let person of this.curDepartInfo.personList) {
          person.isChecked = chosePersonMap.has(person.userid)
        }
      },
      /**
       * 获取所有部门列表
       */
      requireAllDepartList: function () {
        console.log('****获取所有部门列表****')
        let com = this
        com.isLoading = true
        //如果有数据
        if (storage.getSessionArray(consts.KEY_DEPARTS_CHILDREN_TREE).length > 0) {
          com.childrenTree = storage.getSessionArray(consts.KEY_DEPARTS_CHILDREN_TREE)
          console.log('requireAllDepartList获取的本地存储数组：' + JSON.stringify(com.childrenTree))
          com.getCurDepartInfo()
          return
        }
        //没有数据，请求数据
        request.getDepartList(function (response) {
          console.log('depart-person获取的部门列表：' + JSON.stringify(response))
          com.childrenTree = com.getChildrenTree(JSON.parse(response))
          com.getCurDepartInfo()
        })
      },
      /**
       * 获取当前部门人员
       */
      getCurDepartPersons: function () {
        let com = this
        if (com.curDepartInfo.personList.length === 0) {
          request.getDepartPersons(com.$route.params.id, 0, 1, function (data) {
            console.log('获取的本部门人员:' + JSON.stringify(data))
            com.curDepartInfo.personList = data
            com.setPersonListStatus()
            com.isLoading = false
            console.log('getCurDepartPersons获取的本部门数据：' + JSON.stringify(com.curDepartInfo))
            com.setSessionStorage()
          })
        } else {
          com.isLoading = false
          com.setSessionStorage()
        }
      },
      /**
       *获取当前部门信息
       */
      getCurDepartInfo: function () {
        let pathArr = this.path.split('-')
        console.log('本部门的路径：' + pathArr)
        this.curDepartInfo = this.getNodeInTree(this.childrenTree, pathArr)
        console.log('获取的本部门信息：' + JSON.stringify(this.curDepartInfo))
        this.getCurDepartPersons()
      },
      /**
       * 根据路径获取在tree数组中的值
       * @param tree
       * @param pathArr 路径数组
       * @returns {Object} departInfo
       */
      getNodeInTree: function (tree, pathArr) {
        if (pathArr.length === 1) {
          console.log('根据路径获取的node节点：' + JSON.stringify(tree[pathArr[0]]))
          return tree[pathArr[0]]
        } else {
          return this.getNodeInTree(tree[pathArr[0]].departList, pathArr.slice(1))
        }
      },
      /**
       * array转化为tree
       * @param nodes 数组
       * @returns {Array} tree结构数组
       */
      getChildrenTree: function (nodes) {
        if (typeof (nodes) === 'undefined' || nodes.length === 0) {
          return []
        }
        nodes.sort(function (a, b) {
          return a.value - b.value
        })
        let map = {},
          node, roots = []
        for (let i = 0; i < nodes.length; i++) {
          node = nodes[i]
          node.departList = []
          node.personList = []
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
      /**
       * 跳转到子部门
       * @param item 点击的部门信息
       * @param index 部门的index
       */
      routerToChild: function (item, index) {
        router.push({
          name: 'depart-person',
          params: {
            id: item.value,
            path: this.path + '-' + index
          }
        })
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
    color: #46bdff;
    font-size: 23px;
  }

  .weui-cells {
    margin-top: 0;
  }
</style>
