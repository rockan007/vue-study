<template>
  <div v-if="isLoading">loading</div>
  <div v-else>
    <div v-if="curDepartInfo.departList.length>0" class="weui-cells">
      <!--部门选项-->
      <a v-for="(item,index) in curDepartInfo.departList" class="weui-cell"
         v-bind:class="[{'weui-cell_access':item.departList.length>0}]">
        <div class="weui-cell__hd">
          <label v-bind:for="item.value">
            <input type="checkbox" class="" v-bind:id="item.value" v-bind:value="item.value"
                   v-bind:checked="item.isChecked"
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
    <div class="page" v-else>
      <img src="../assets/images/none.png" style="width: 50%;padding: 25% 25% 10%;height: auto;z-index: 800;"/>
      <p style="width: 100%;text-align: center;color: darkgray">此部门暂无子部门！</p>
    </div>
  </div>
</template>
<script>
  import { consts } from '../mock-data/consts'
  import { storage } from '../utils/storage'
  import { request } from '../utils/request'
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
        console.log('路径：' + this.$route.params.path)
        this.departId = parseInt(this.$route.params.id)
        this.path = this.$route.params.path
        this.requireAllDepartList()
      }
    },
    methods: {
      setSessionStorage: function () {
        storage.setSessionStorage(consts.KEY_DEPARTS_CHILDREN_TREE, this.childrenTree)
      },
      setDepartStatus: function () {
        console.log('****choose-depart****setDepartStatus*****')
        let childDeparts = this.curDepartInfo.departList
        let choseAllDeparts = storage.getSessionSet(consts.KEY_ALL_CHOOSE_DEPARTS)
        console.log('获取的已选部门数组：' + JSON.stringify(Array.from(storage.getSessionMap(consts.KEY_CHOOSE_DEPARTS))))
        for (let childDepart of childDeparts) {
          childDepart.isChecked = choseAllDeparts.has(childDepart.value)
        }
        this.isLoading = false
        this.setSessionStorage()
      },
      /**
       * 添加或删除部门的逻辑
       * @param{Object} depart 要处理的部门信息
       * @param{boolean} isAdd true 添加 false 删除
       */
      toggleChoseDepart: function (depart, isAdd) {
        console.log('****choose-depart****toggleChoseDepart*****')
        let ids = new Set()
        if (!isAdd) {
          this.getAllParentIds(depart, ids)
        }
        this.getAllChildIds(depart, ids)
        console.log('获取的要删除的ids:' + JSON.stringify(Array.from(ids)))
        let allChoseDeparts = storage.getSessionSet(consts.KEY_ALL_CHOOSE_DEPARTS)
        let choseDeparts = storage.getSessionMap(consts.KEY_CHOOSE_DEPARTS)
        console.log('获取的已选部门数组：' + JSON.stringify(Array.from([...choseDeparts])))
        if (!isAdd) {//如果是删除的部门的父部门为已选，则已选部门添加子部门数据
          //删除部门，删除父部门的子部门
          this.addParentChildDeparts(choseDeparts)
        }
        for (let id of ids) {
          if (isAdd) {//添加
            allChoseDeparts.add(id)
          } else {
            //如果删除当前部门， 此部门的父部门，如何添加此部门的旁系部门为已选择部门？
            allChoseDeparts.delete(id)
          }
          choseDeparts.delete(id)
        }
        if (isAdd) {//添加
          allChoseDeparts.add(depart.value)
          choseDeparts.set(depart.value, depart.title)
          //添加父部门
//          this.setParentIsChose(choseDeparts, allChoseDeparts)
          //如果添加当前部门，则判断当前部门的父部门是否为全选？
          //如果为全选,则此部门父部门的父部门是否为全选？递归？
          //如果只记录全部已选部门
          //最后 在已选部门中 删除 已选部门的子部门,然后将set重组为已选部门
        } else {
          allChoseDeparts.delete(depart.value)
          choseDeparts.delete(depart.value)
        }
        console.log('保存的已选部门map：' + JSON.stringify(Array.from([...choseDeparts])))
        console.log('保存的已选部门allSet:' + JSON.stringify(Array.from(allChoseDeparts)))
        storage.setSessionSet(consts.KEY_ALL_CHOOSE_DEPARTS, allChoseDeparts)
        storage.setSessionMap(consts.KEY_CHOOSE_DEPARTS, choseDeparts)
        this.$emit('choseDeparts', choseDeparts)
      },
      setParentIsChose: function (choseDeparts, allChoseDeparts) {
        console.log('****choose-depart****setParentIsChose*****')
        console.log('本部门信息：' + JSON.stringify(this.curDepartInfo))
        let pathArr = this.path.split('-')
        this.setParentChoseInSession(pathArr, choseDeparts, allChoseDeparts)
      },
      /**
       *
       */
      setParentChoseInSession: function (pathArr, choseDeparts, allChoseDeparts) {
        console.log('****choose-depart****setParentChoseInSession****')
        let curDepart = this.getNodeInTree(this.childrenTree, pathArr)
        console.log('获取的父部门信息:' + JSON.stringify(curDepart))
        let isChose = curDepart.departList.every(function (depart) {
          return choseDeparts.has(depart.value)
        })
        console.log('部门是否已选择：' + isChose)
        if (isChose) {
          allChoseDeparts.add(curDepart.value)
          choseDeparts.set(curDepart.value, curDepart.title)
          console.log('选择后的数组：' + JSON.stringify(choseDeparts))
          for (let depart of curDepart.departList) {
            choseDeparts.delete(depart.value)
          }
          console.log('获取的当前路径数组：' + pathArr)
          if (pathArr.length > 1) {
            this.setParentChoseInSession(pathArr.slice(0, pathArr.length - 1), choseDeparts, allChoseDeparts)

          }
        }
      },
      /**
       * 添加已选父部门的子部门
       *@param {Map} choseDeparts
       */
      addParentChildDeparts: function (choseDeparts) {
        console.log('****choose-depart****addParentChildDeparts****')
        let pathArr = this.path.split('-')
        let choseParent = this.getChoseParent(this.childrenTree, pathArr, choseDeparts)
        if (choseParent !== null) {
          this.addChildInSession(choseParent, choseDeparts)
        }
      },
      /**
       *
       */
      addChildInSession: function (choseParent, choseDeparts) {
        console.log('****choose-depart****addChildInSession****')
        if (this.curDepartInfo.departList.length > 0 && choseParent.value === this.curDepartInfo.departList[0].value) {
          return
        }
        if (choseParent.departList.length > 0) {
          for (let depart of choseParent.departList) {
            choseDeparts.set(depart.value, depart.title)
            this.addChildInSession(depart, choseDeparts)
          }
        }
      },
      /**
       *
       * @param {Array} childTree
       * @param {Array} pathArr
       * @param {Map} choseDeparts
       * @return {Object}
       */
      getChoseParent: function (childTree, pathArr, choseDeparts) {
        console.log('****choose-depart****getChoseParent****')
        if (pathArr.length > 1) {
          if (choseDeparts.has(childTree[pathArr[0]].value)) {
            console.log('获取的父部门信息：' + childTree[pathArr[0]])
            return childTree[pathArr[0]]
          } else {
            return this.getChoseParent(childTree[pathArr[0]].departList, pathArr.slice(1), choseDeparts)
          }
        } else {
          return null
        }
      },
      /**
       * 递归获取部门的父部门
       */
      getAllParentIds: function (depart, ids) {
        console.log('****choose-depart**** getAllParentIds****')
        console.log('当前部门信息：' + JSON.stringify(depart))
        if (typeof (depart.parentDepart) !== 'undefined') {
          console.log(typeof(ids))
          console.log(ids)
          ids.add(depart.parentDepart.value)
          this.getAllParentIds(depart.parentDepart, ids)
        } else {
          return ids
        }
      },
      /**
       * 递归获取depart的子部门
       */
      getAllChildIds: function (depart, ids) {
        console.log('****choose-depart**** getAllChildIds****')
        console.log(JSON.stringify(Array.from(ids)))
        console.log(ids.size)
        if (depart.departList.length > 0) {
          for (let childDepart of depart.departList) {
            ids.add(childDepart.value)
            console.log(JSON.stringify(Array.from(ids)))
            console.log(ids.size)
            this.getAllChildIds(childDepart, ids)
          }
        } else {
          return ids.add(depart.value)
        }
      },
      /**
       *
       */
      toggleDepart: function (depart, event) {
        console.log('****choose-depart****toggleDepart****')
        let isAdd = event.target.checked
        this.toggleChoseDepart(depart, isAdd)
      },
      /**
       *
       */
      requireAllDepartList: function () {
        console.log('****choose-depart****requireAllDepartList****')
        let com = this
        com.isLoading = true
        //如果有数据
        if (storage.getSessionArray(consts.KEY_DEPARTS_CHILDREN_TREE).length > 0) {
          com.childrenTree = storage.getSessionArray(consts.KEY_DEPARTS_CHILDREN_TREE)
          console.log('获取的所有部门数据信息：' + JSON.stringify(com.childrenTree))
          com.getCurDepartInfo()
          return
        }
        //没有数据，请求数据
        request.getDepartList(function (response) {
          console.log('depart-person获取的部门列表：' + response)
          com.childrenTree = com.getChildrenTree(JSON.parse(response))
//        com.parentTree = com.getParentsTree(response)
          com.getCurDepartInfo()
        })
      },
      /**
       *
       */
      getCurDepartInfo: function () {
        console.log('****choose-depart****getCurDepartInfo****')
        let pathArr = this.path.split('-')
        console.log('获取的路径数组：' + pathArr)
        this.curDepartInfo = this.getNodeInTree(this.childrenTree, pathArr)
        console.log('获取的本部门数据：' + JSON.stringify(this.curDepartInfo))
        this.setDepartStatus()
      },
      /**
       * 根据路径获取在tree数组中的值
       * @param tree
       * @param pathArr 路径数组
       * @returns {*} departInfo
       */
      getNodeInTree: function (tree, pathArr) {
        console.log('****choose-depart****getNodeInTree****')
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
        console.log('****choose-depart***getChildrenTree***')
        if (typeof (nodes) === 'undefined' || nodes.length === 0) {
          return []
        }
        nodes = JSON.parse(JSON.stringify(this.getParentsTree(nodes)))
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
        console.log('getChildrenTree获取的数据：' + JSON.stringify(roots))
        return roots
      },
      /**
       * 获取包含父部门的tree
       * @param nodes 列表
       * @returns {Array} 含父部门的列表
       */
      getParentsTree: function (nodes) {
        console.log('****choose-depart***getParentsTree***')
        if (!nodes || nodes.length === 0) {
          return []
        }
//        nodes = JSON.parse(JSON.stringify(this.getChildrenList(nodes)))
        nodes.sort(function (a, b) {
          return a.value - b.value
        })
        console.log('要处理的数组：' + JSON.stringify(nodes))

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
        console.log('getParentsTree获取的数据：' + JSON.stringify(roots))
        return roots
      },
      routerToChild: function (item, index) {
        console.log('routerToChild')
        if (item.departList.length === 0) {
          return
        }
        router.push({
          name: 'choose-depart',
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
    font-size: 17px;
    display: block;
  }

  input[type=checkbox]:checked + .weui-icon-checked:before {
    display: inline-block;
    content: '\EA06';
    color: #46bdff;
    font-size: 17px;
  }

  .weui-cells {
    margin-top: 0;
  }

  .weui-cell__bd > p {
    font-size: 15px;
  }

  .page {
    opacity: 1;
  }
</style>
