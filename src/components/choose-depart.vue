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
      setSessionStorage: function (choseAllDeparts) {
        console.log('***choose-depart*setSessionStorage*****')
        console.log('所有已选部门：' + JSON.stringify(choseAllDeparts))
        storage.setSessionStorage(consts.KEY_DEPARTS_CHILDREN_TREE, this.childrenTree)
        storage.setSessionSet(consts.KEY_ALL_CHOOSE_DEPARTS, choseAllDeparts)
      },
      setDepartStatus: function () {
        console.log('****choose-depart****setDepartStatus*****')
        let childDeparts = this.curDepartInfo.departList
        let choseAllDeparts = storage.getSessionSet(consts.KEY_ALL_CHOOSE_DEPARTS)
        console.log('***所有已选部门：' + JSON.stringify(Array.from(choseAllDeparts)))
        if (choseAllDeparts.has(this.curDepartInfo.value)) {
          this.curDepartInfo.isChecked = true
        } else {
          this.curDepartInfo.isChecked = false
        }
        console.log('获取的已选部门数组：' + JSON.stringify(Array.from(storage.getSessionMap(consts.KEY_CHOOSE_DEPARTS))))
        console.log('修改值后当前部门信息：' + JSON.stringify(this.curDepartInfo))
        for (let childDepart of childDeparts) {
          if (this.curDepartInfo.isChecked) {
            choseAllDeparts.add(childDepart.value)
//            Vue.set(childDepart,isChecked,true)
            childDepart.isChecked = true
          } else {
            childDepart.isChecked = choseAllDeparts.has(childDepart.value)
          }
        }
        console.log('修改值后当前部门信息：' + JSON.stringify(this.curDepartInfo))
        this.isLoading = false
        this.setSessionStorage(choseAllDeparts)
      },
      /**
       * 添加或删除部门的逻辑
       * @param{Object} depart 要处理的部门信息
       * @param{boolean} isAdd true 添加 false 删除
       */
      toggleChoseDepart: function (depart, isAdd) {
        if (depart.value === -1) {
          this.toggleAllDeparts(isAdd)
          return
        }
        console.log('****choose-depart****toggleChoseDepart*****')
        let ids = new Set()
        if (!isAdd) {//删除
          this.getParentIds(this.childrenTree, this.path.split('-'), ids)
          if (this.curDepartInfo.value === -1) {
            this.curDepartInfo.departList[0].isChecked = false
          }
        }
        this.getAllChildIds(depart, ids)//获取所有子部门ids
        console.log('获取的要删除的ids:' + JSON.stringify(Array.from(ids)))
        let allChoseDeparts = storage.getSessionSet(consts.KEY_ALL_CHOOSE_DEPARTS)
        let choseDeparts = storage.getSessionMap(consts.KEY_CHOOSE_DEPARTS)
        console.log('获取的已选部门数组：' + JSON.stringify(Array.from([...choseDeparts])))
        if (!isAdd) {//添加子部门的父部门的同级部门
          this.addParentChildDeparts(choseDeparts)
          console.log('已选的部门数据：' + JSON.stringify(choseDeparts))
        }
        for (let id of ids) {//
          if (isAdd) {//添加所有子部门
            allChoseDeparts.add(id)
          } else {
            //删除子部门 和父部门
            allChoseDeparts.delete(id)
          }
          choseDeparts.delete(id)
        }
        if (isAdd) {//添加
          allChoseDeparts.add(depart.value)
          choseDeparts.set(depart.value, depart.title)
        } else {//删除此部门
          allChoseDeparts.delete(depart.value)
          choseDeparts.delete(depart.value)
        }
        console.log('保存的已选部门map：' + JSON.stringify(Array.from([...choseDeparts])))
        console.log('保存的已选部门allSet:' + JSON.stringify(Array.from(allChoseDeparts)))
        storage.setSessionSet(consts.KEY_ALL_CHOOSE_DEPARTS, allChoseDeparts)
        storage.setSessionMap(consts.KEY_CHOOSE_DEPARTS, choseDeparts)
        this.emitChoseDeparts(choseDeparts)
      },
      /**
       * 全选的逻辑
       */
      toggleAllDeparts: function (isAdd) {
        console.log('****toggleAllDeparts*****')
        let allChoseDeparts = storage.getSessionSet(consts.KEY_ALL_CHOOSE_DEPARTS)
        let choseDeparts = storage.getSessionMap(consts.KEY_CHOOSE_DEPARTS)
        let ids = new Set()
        console.log('当前部门信息：' + JSON.stringify(this.curDepartInfo))
        this.getAllChildIds(this.curDepartInfo, ids)//获取所有子部门ids
        console.log('所有子部门ids:' + JSON.stringify(Array.from(ids)))
        choseDeparts.clear()
        if (isAdd) {//添加
          for (let id of ids) {
            allChoseDeparts.add(id)
          }
        } else {//删除
          allChoseDeparts.clear()
        }
        if (isAdd) {
          choseDeparts.set(this.curDepartInfo.value, this.curDepartInfo.title)
          for (let depart of this.curDepartInfo.departList) {
            if (depart.value > 0) {
              choseDeparts.set(depart.value, depart.title)
            }
          }
        }
        console.log('****allChoseDeparts*****' + JSON.stringify([...allChoseDeparts]))
        console.log('****choseDeparts****' + JSON.stringify(Array.from(choseDeparts)))
        storage.setSessionSet(consts.KEY_ALL_CHOOSE_DEPARTS, allChoseDeparts)
        storage.setSessionMap(consts.KEY_CHOOSE_DEPARTS, choseDeparts)
        this.setDepartStatus()
        this.emitChoseDeparts(choseDeparts)
      },
      emitChoseDeparts: function (choseDeparts) {
        choseDeparts.delete(-1)
        this.$emit('choseDeparts', choseDeparts)
        console.log('传递的choseDeparts:' + JSON.stringify(choseDeparts))
      },
      /**
       * 添加已选父部门的子部门
       *@param {Map} choseDeparts
       */
      addParentChildDeparts: function (choseDeparts) {
        console.log('****choose-depart****addParentChildDeparts****')
        let pathArr = this.path.split('-')
        let choseParent = this.getChoseParent(this.childrenTree, pathArr, choseDeparts)
        console.log('获得的已选父部门：' + JSON.stringify(choseParent))
        if (choseParent !== null) {
          this.addChildInSession(choseParent, choseDeparts)
        }
      },
      /**
       *
       * 将子部门设置为已选
       */
      addChildInSession: function (choseParent, choseDeparts) {
        console.log('****choose-depart****addChildInSession****')
        //判断是否为当前子部门  停止添加
        if (this.curDepartInfo.departList.length > 0 && choseParent.value === this.curDepartInfo.departList[0].value
          && this.curDepartInfo.value !== -1) {
          return
        }
        if (choseParent.departList.length > 0) {
          for (let depart of choseParent.departList) {
            if (depart.value !== -1) {
              choseDeparts.set(depart.value, depart.title)
            }
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
        if (choseDeparts.has(childTree[pathArr[0]].value)) {//如果最顶级部门为已选
          console.log('获取的父部门信息：' + childTree[pathArr[0]])
          return childTree[pathArr[0]]
        } else {
          if (pathArr.length > 1) {
            return this.getChoseParent(childTree[pathArr[0]].departList, pathArr.slice(1), choseDeparts)
          } else {
            return null
          }
        }

      },
      /**
       *获取部门的父部门ids
       */
      getParentIds: function (departTree, pathArr, parentsIds) {
        console.log('******获取此部门的父部门id*******')
        parentsIds.add(departTree[pathArr[0]].value)
        console.log('获取的parentIds:' + JSON.stringify(parentsIds))
        if (pathArr.length > 1) {
          this.getParentIds(departTree[pathArr[0]].departList, pathArr.slice(1), parentsIds)
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
        console.log(JSON.stringify(depart))
        let isAdd = event.target.checked
        depart.isChecked = isAdd
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
          console.log('depart-person获取的部门列表：' + JSON.stringify(response))
          com.childrenTree = com.getChildrenTree(response)
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
//        nodes = JSON.parse(JSON.stringify(this.getParentsTree(nodes)))
        nodes.sort(function (a, b) {
          return a.value - b.value
        })
        let map = {},
          node, roots = []
        for (let i = 0; i < nodes.length; i++) {
          node = nodes[i]
          node.isChecked = false
          node.departList = []
          node.personList = []
          if (node.value === -1) {
            node.parentvalue = -1
            node.departList.push({
              value: -1,
              parentvalue: 0,
              title: '全部',
              departList: [],
              personList: [],
              isChecked: false
            })
          }
          map[node.value] = i // use map to look-up the parents
          if (node.parentvalue > 0) {
            if (typeof(map[node.parentvalue]) !== 'undefined') {
              nodes[map[node.parentvalue]].departList.push(node)
            } else {
              nodes[map[-1]].departList.push(node)
            }
          } else {
            roots.push(node)
          }
        }
        console.log('getChildrenTree获取的数据：' + JSON.stringify(roots))
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
