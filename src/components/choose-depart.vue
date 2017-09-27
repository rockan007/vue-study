<template>
  <div v-if="isLoading">loading</div>
  <div v-else class="weui-cells">
    <!--部门选项-->
    <a v-for="(item,index) in curDepartInfo.departList" class="weui-cell weui-cell_access">
      <div class="weui-cell__hd">
        <label v-bind:for="item.value">
          <input type="checkbox" class="" v-bind:id="item.value" v-bind:value="item.value"
                 v-bind:checked="isAllChecked||item.isChecked"
                 v-on:change="toggleDepart(item,$event)"/>
          <i class="weui-icon-checked"></i>
        </label>
      </div>
      <div class="weui-cell__bd" v-on:click="routerToChild(item,index)">
        <p>{{item.title}}</p>
      </div>
      <div class="weui-cell__ft" v-on:click="routerToChild(item,index)"></div>
    </a>
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
        departId: parseInt(this.$route.params.id),
        path: this.$route.params.path,
        childrenTree: [],
        isLoading: false
      }
    },
    created: function () {
      this.requireAllDepartList()
    },
    watch: {
      $route (to, from) {
        this.requireAllDepartList()
      }
    },
    methods: {
      setDepartStatus: function () {
        let childDeparts = this.curDepartInfo.departList
        let choseAllDeparts = storage.getSessionSet(consts.KEY_ALL_CHOOSE_DEPARTS)
        for (let childDepart of childDeparts) {
          if (choseAllDeparts.has(childDepart.value)) {//如果已存在数组中
            childDepart.isChecked = true
          } else {//不存在于已选数组中
            let departIds = new Set()
            this.getAllLastChildIds(childDepart, departIds)
            childDepart.isChecked = Array.from(departIds).every(function (departId) {
              return choseAllDeparts.has(departId)
            })
          }

        }
        this.isLoading = false
      },
      /**
       * 添加或删除部门的逻辑
       * @param{Object} depart 要处理的部门信息
       * @param{boolean} isAdd true 添加 false 删除
       */
      toggleChoseDepart: function (depart, isAdd) {
        let ids = new Set()
        if (!isAdd) {
          this.getAllParentIds(depart, ids)
        }
        this.getAllChildDeparts(depart, ids)
        let allChoseDeparts = storage.getSessionSet(consts.KEY_ALL_CHOOSE_DEPARTS)
        let choseDeparts = storage.getSessionMap(consts.KEY_CHOOSE_DEPARTS)
        for (let id of ids) {
          if (isAdd) {
            allChoseDeparts.set(id)
          } else {
            allChoseDeparts.delete(id)
            choseDeparts.delete(id)
          }
        }
        if (isAdd) {
          allChoseDeparts.set(depart.value)
          choseDeparts.set(depart.value, depart.title)
        } else {
          allChoseDeparts.delete(depart.value)
          choseDeparts.delete(depart.value)
        }
        storage.setSessionStorage(consts.KEY_ALL_CHOOSE_DEPARTS, allChoseDeparts)
        storage.setSessionStorage(consts.KEY_CHOOSE_DEPARTS, choseDeparts)

      },
      getAllLastChildIds: function (depart, ids) {
        if (depart.departList.length > 0) {
          for (let childDepart of depart.departList) {
            this.getAllChildIds(childDepart, ids)
          }
        } else {
          return ids.set(depart.value)
        }
      },
      /**
       * 递归获取部门的父部门
       */
      getAllParentIds: function (depart, ids) {
        if (typeof (depart.parentDepart.value) === 'number') {
          ids.set(depart.parentDepart.value)
          this.getAllParentIds(depart.parentDepart, ids)
        } else {
          return ids
        }
      },
      /**
       * 递归获取depart的子部门
       */
      getAllChildIds: function (depart, ids) {
        if (depart.departList.length > 0) {
          for (let childDepart of depart.departList) {
            ids.push(childDepart.value)
            this.getAllChildIds(childDepart, ids)
          }
        } else {
          return ids.push(depart.value)
        }
      },
      toggleDepart: function (depart, event) {
        let isAdd = event.target.checked
        this.toggleChoseDepart(depart, isAdd)
      },
      requireAllDepartList: function () {
        let com = this
        com.isLoading = true
        //如果有数据
        if (storage.getSessionArray(consts.KEY_DEPARTS_CHILDREN_TREE).length > 0) {
          com.childrenTree = storage.getSessionArray(consts.KEY_DEPARTS_CHILDREN_TREE)
          com.getCurDepartInfo()
          return
        }
        //没有数据，请求数据
        request.getDepartList(function (response) {
          console.log('depart-person获取的部门列表：' + JSON.stringify(response))
          com.childrenTree = com.getChildrenTree(response)
          com.getCurDepartInfo()
        })
      },
      /**
       *
       */
      getCurDepartInfo: function () {
        let pathArr = this.path.split('-')
        this.curDepartInfo = this.getNodeInTree(this.childrenTree, pathArr)
        this.departList = this.curDepartInfo.departList
        this.setDepartStatus()
      },
      /**
       * 根据路径获取在tree数组中的值
       * @param tree
       * @param pathArr 路径数组
       * @returns {*} departInfo
       */
      getNodeInTree: function (tree, pathArr) {
        if (pathArr.length === 1) {
          console.log('根据路径获取的node节点：' + JSON.stringify(tree[pathArr[0]]))
          return tree[pathArr[0]]
        } else {
          this.getNodeInTree(tree[pathArr[0]], pathArr.splice(0, 1))
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
      getParentsTree: function (nodes) {
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
      },
      routerToChild: function (item, index) {
        if (item.departList.length === 0) {
          return
        }
        router.push({
          name: 'depart-person',
          params: {
            id: item.value,
            path: path + '-' + index
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
