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
        departId: parseInt(this.$route.params.id),
        path: this.$route.params.path,
        childrenTree: [],
        isLoading: false
      }
    },
    created: function () {
      if (this.departId === -1) {
        this.requireAllDepartList()
      }
    },
    watch: {
      $route (to, from) {

      }
    },
    methods: {
      /**
       * 选中，或取消选中的人
       * @param {Object} person 添加或删除的人员
       * @param {e} event 事件
       */
      togglePerson: function (person, event) {
        let isAdd = event.target.checked
        storage.toggleValueInSessionSet(consts.KEY_ALL_CHOOSE_PERSON, person.id, isAdd)
        storage.toggleVlaueInSessionMap(consts.KEY_CHOOSE_PERSONS, person.id, person.name, isAdd)
        if (!isAdd) {//删除人员
          for (let departId of person.departList) {
            this.delChoseDepart(departId)
          }
        }
      },
      /**
       * 删除部门及其父部门的选中状态
       * @param{Number} value 删除的部门id
       */
      delChoseDepart: function (value) {
        let parentTree = storage.getSessionArray(consts.KEY_DEPARTS_PARENTS_TREE)
        let choseDepart = parentTree.filter(function (depart) {
          return depart.value === value
        })[0]
        let parentIds = []
        this.getAllParentIds(choseDepart,parentIds)
        console.log("获取的所有父部门的id"+parentIds)
      },
      //添加选中部门，并添加选中部门的子部门
      addChoseDepart: function (value, index) {
        let choseDepart = this.curDepartInfo.departList[index]
        let childIds = []
        this.getAllChildIds(choseDepart, childIds)
        console.log('获取的部门的全部子部门的id' + childIds.toString())
      },
      /**
       * 递归获取部门的父部门
       */
      getAllParentIds: function (depart,ids) {

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
        if (isAdd) {
          //添加部门
          this.addChoseDepart(depart.value)
        } else {
          //删除部门
          this.delChoseDepart(depart.value)
        }
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
      getCurDepartPersons: function () {
        let com = this
        if (com.curDepartInfo.personList.length === 0) {
          request.getDepartPersons(com.$route.params.id, 0, 1, function (data) {
            console.log('获取的本部门人员:' + JSON.stringify(data))
            com.setItemsStatus(data, 1)
            com.curDepartInfo.personList = data
            com.isLoading = false
          })
        } else {
          com.isLoading = false
        }
      },
      /**
       *
       */
      getCurDepartInfo: function () {
        let pathArr = this.path.split('-')
        this.curDepartInfo = this.getNodeInTree(com.childrenTree, pathArr)
        this.departList = this.curDepartInfo.children
        this.getCurDepartPersons()
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
    color: #09BB07;
    font-size: 23px;
  }

  .weui-cells {
    margin-top: 0;
  }
</style>
