<template>
  <div v-if="isLoading">loading</div>
  <div v-else class="weui-cells">
    <template v-for="(item,index) in listData">
      <!--人员选项-->
      <label v-if="item.name" v-bind:for="item.userid" class="weui-cell weui-check__label">
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
      <a class="weui-cell weui-cell_access" v-else>
        <div class="weui-cell__hd">
          <label v-bind:for="item.value">
            <input type="checkbox" class="" v-bind:id="item.value" v-bind:value="item.value"
                   v-bind:checked="isAllChecked||item.isChecked"
                   v-on:change="toggleDepart(item,$event)"/>
            <i class="weui-icon-checked"></i>
          </label>
        </div>
        <div class="weui-cell__bd" v-on:click="clickEvent(item)">
          <p>{{item.title}}</p>
        </div>
        <div class="weui-cell__ft" v-on:click="clickEvent(item)"></div>
      </a>
    </template>
  </div>
</template>
<script>
  import consts from '../mock-data/consts'
  import events from '../utils/events'
  import request from '../utils/request'
  import router from '../router/index'
  import jQuery from 'jquery'

  export default {
    name: 'choose-person',
    data: function () {
      return {
        listData: [],
        isLoading: false,
        choseItems: [],
        isAllChecked: false,
        count: 0,
        allCount: 0
      }
    },
    created: function () {
      console.log('获取的的id' + parseInt(this.$route.params.id))
      this.setPosition()
      if (parseInt(this.$route.params.id) === -1) {
        this.getAllListData()
      } else {
        this.getCurDeparts()
      }
    },
    watch: {
      $route (to, from) {
        console.log('当前路由id:' + parseInt(this.$route.params.id))
        this.setPosition()
        if (parseInt(this.$route.params.id) === -1) {
          this.getAllListData()
        } else {
          this.getCurDeparts()
        }
      }
    },
    methods: {
      getAllListData: function () {
        console.log('*********getAllListData******')
        let com = this
        com.isLoading = true
        request.getDepartList(function (data) {
          console.log('getAllListData获取的部门列表：' + JSON.stringify(JSON.parse(data)))
          sessionStorage.setItem(consts.KEY_DEPARTS, data)
          com.getCurDeparts()
        })
      },
      /**
       * 获取当前部门人员
       */
      getCurDeparts: function () {
        console.log('*********getCurDeparts******')
        this.isLoading = true
        let children = this.getLocalChildren()
        console.log('获取当前部门*****' + JSON.stringify(children))
        if (children && children.length > 0) {
          this.setItemsStatus(children)
          this.listData = children
          this.isLoading = false
        } else {
          this.requestChildren()
        }
      },
      requestChildren: function () { //获取部门内部信息
        console.log('*********requestChildren获取本页列表数据******')
        let parentId = 0
        if (parseInt(this.$route.params.id) === -1) {
          parentId = 1
        } else {
          parentId = parseInt(this.$route.params.id)
        }
        let list = JSON.parse(sessionStorage.getItem(consts.KEY_DEPARTS))
        console.log(list)
        let childDeparts = list.filter(function (el) {
          return el.parentvalue === parentId
        })
        console.log('获取的当前部门的子部门:' + JSON.stringify(childDeparts))
        this.getChildDepartsPersen(childDeparts)
      },
      //获取的子部门的人员数据
      getChildDepartsPersen: function (departs) {
        console.log('********getChildDepartsPersen********')

        let com = this
        if (departs.length > 0) {
          for (let i in departs) {
            departs[i].children = this.getAllChildDeparts(departs[i].value)
            this.getSingleDepartAllPersen(departs[i], departs)
            this.getSingleDepartPersen(departs[i], departs)
          }
        } else {
          console.log('沒有子部门时，获取成员，子部门：' + JSON.stringify(departs))
          com.getCurPersen(departs)
        }
      },

      getDepartAllPersen: function (depart, callback) {
        console.log('********getDepartAllPersen********')
        request.getDepartPersons(depart, 1, 0, function (data) {
          console.log('递归获取的本部门人员:' + JSON.stringify(data))
          callback(data)
        })
      },
      getSingleDepartAllPersen: function (depart, departs) {
        console.log('********getSingleDepartAllPersen********')
        let mod = this
        mod.getDepartAllPersen(depart, function (data) {
          mod.allCount++
          depart.allPersen = data
          console.log('当前的depart:' + JSON.stringify(depart))
          if (mod.allCount === departs.length) {
            console.log('获取的部门所有人员:' + JSON.stringify(departs))
            if (mod.allCount === departs.length && mod.count === departs.length) {
              //获取当前部门的人员
              mod.getCurPersen(departs)
              mod.allCount = 0
              mod.count = 0
            }
          }
        })
      },
      getSingleDepartPersen: function (depart, departs) {
        console.log('********getSingleDepartPersen********')
        let mod = this
        mod.getDepartPersen(depart, function (data) {
          mod.count++
          depart.persen = data
          console.log('当前的depart:' + JSON.stringify(depart))
          if (mod.count === departs.length) {
            console.log('获取的部门人员:' + JSON.stringify(departs))
            if (mod.allCount === departs.length && mod.count === departs.length) {
              //获取当前部门的人员
              mod.getCurPersen(departs)
              mod.allCount = 0
              mod.count = 0
            }
          }
        })
      },
      /**
       * 获取部门所有人员 包括子部门
       * @param {Object} departId
       * @param {Function} callback 回调
       */
      getDepartPersen: function (depart, callback) {
        console.log('********getDepartAllPersen********')
        request.getDepartPersons(depart, 0, 0, function (data) {
          console.log('递归获取的本部门人员:' + JSON.stringify(data))
          callback(data)
        })
      },
      /**
       * 获取当前部门人员
       */
      getCurPersen: function (departs) {
        console.log('********getCurPersen获取当前部门人员********')
        let com = this
        request.getDepartPersons(com.$route.params.id, 0, 0, function (data) {
          console.log('获取的本部门人员:' + JSON.stringify(data))
          let children = data.concat(departs)
          com.setItemsStatus(children)
          com.listData = children
          com.isLoading = false
          com.setAsChildren()
        })
      },
      /**
       * 列表cell
       * @param {Object} item
       */
      clickEvent: function (item) {
        console.log('********clickEvent********')
        if (item.value) {
          console.log('路由跳转')
          this.routerTo(item)
        }
      },
      //向下传递事件
      setItemsStatus: function (items) {
        console.log('********setItemsStatus设置列表选择状态********')
        console.log('要改变的部门和人员数据:' + JSON.stringify(items))
        let arr = events.isExistInSessionArray(consts.KEY_CHOOSE_DEPARTS, parseInt(this.$route.params.id))
        console.log('此部门是否存在于已选部门列表中:' + JSON.stringify(arr))
        if (arr[1] >= 0) { //如果此部门为已选
          this.isAllChecked = true
        } else { //未选择此部门
          this.isAllChecked = false
          //重复情况
          this.getSingleChecked(items) //人员或部门的选择状态
        }
        console.log('是否已全选？' + this.isAllChecked)
      },
      /**
       * 人员 或 部门是否已选择
       * @param {Object} items
       */
      getSingleChecked: function (items) {
        console.log('********getSingleChecked人员部门选择状态获取********')
        for (let i in items) {
          items[i].isChecked = this.isItemChecked(items[i])
        }
        console.log('遍历获取部门或人员状态后的值：' + JSON.stringify(items))
      },
      isItemChecked: function (item) {
        console.log('********isItemChecked********')
        console.log('要设置的item的数据：' + JSON.stringify(item))
        console.log('部门对应的人员的map值：' + JSON.stringify(events.getSessionMap(consts.KEY_CHOSE_MAP)))
        console.log('已选部门的值：' + JSON.stringify(events.getSessionArray(consts.KEY_CHOOSE_DEPARTS)))
        if (item.userid) { //如果是人员 测试
          return events.isExistInArray(events.getSessionMapValue(consts.KEY_CHOSE_MAP, parseInt(this.$route.params.id)), item.userid)[1] >= 0
        } else { //如果是部门
          events.toggleValueInSessionArray(consts.KEY_CHOOSE_DEPARTS, item.value, this.isAllChildrenChose(item))
          if (events.isExistInSessionArray(consts.KEY_CHOOSE_DEPARTS, item.value)[1] >= 0) {
            return true
          } else {
            return false
          }
        }
      },
      isAllChildrenChose: function (item) {
        console.log('********isAllChildrenInLocal********')
        console.log('要处理的部门数据:' + JSON.stringify(item))
        for (let i in item.children) {
          if (events.isExistInSessionArray(consts.KEY_CHOOSE_DEPARTS, item.children[i].value)[1] < 0) {
            return false
          }
        }
        if (events.getSessionMapValue(consts.KEY_CHOSE_MAP, item.value).length === item.persen.length) {
          return true
        }
        return false
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
        this.$emit('togglePerson', [item], isAdd)
        this.changeSessionByPerson(item, isAdd)
        this.setItemsStatus(this.listData)
      },
      /**
       *
       * @param {Object} person 选择或取消选择的信息
       * @param {Object} isAdd 添加删除逻辑
       */
      changeSessionByPerson: function (person, isAdd) { //
        console.log('********changeSessionByPerson人员选择后的响应********')
        let com = this
        person.department.forEach(function (departId) {
          com.togglePersonInDepart(departId, person, isAdd)
          if (!isAdd) { //如果是刪除 刪除其所在所有部门的选择状态
            events.toggleValueInSessionArray(consts.KEY_CHOOSE_DEPARTS, departId, isAdd)
          }
        })
      },
      togglePersonInDepart: function (departId, person, isAdd) {
        console.log('********togglePersonInDepart相关部门内数据的存取********')
        let personArr = events.toggleValueInArray(events.getSessionMapValue(consts.KEY_CHOSE_MAP, departId), person.userid, isAdd)
        events.setSessionMapValue(consts.KEY_CHOSE_MAP, departId, personArr)
        console.log('保存的map数据:' + JSON.stringify(events.getSessionMap(consts.KEY_CHOSE_MAP)))
      },

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
          events.toggleValueInSessionArray(consts.KEY_CHOOSE_DEPARTS, child.value, isAdd)
        })
        console.log('保存或删除本部门及子部门：' + events.getSessionArray(consts.KEY_CHOOSE_DEPARTS))
        //人员选择
        //item.persen 它的响应逻辑
        item.allPersen.forEach(function (person) {
          //单个人员选择或取消选择的响应逻辑
          com.changeSessionByPerson(person, isAdd)
        })

        //设置页面状态
        console.log('选择部门时的数据列表：' + JSON.stringify(com.listData))
        com.setItemsStatus(com.listData)
      },
      /**
       * 获取所有的子部门
       * 包括递归的子部门
       */
      getAllChildDeparts: function (departId) {
        console.log('********getAllChildDeparts 递归获取所有子部门********')
        if (departId === -1) {
          departId = 1
        }
        let allDeparts = events.getSessionArray(consts.KEY_DEPARTS)
        let childDeparts = allDeparts.filter(function (depart) {
          return depart.parentvalue === departId
        })
        if (childDeparts.length > 0) {
          for (let i in childDeparts) {
            childDeparts = childDeparts.concat(this.getAllChildDeparts(childDeparts[i].value))
          }
        }
        console.log('departId为:' + departId + '的获取的所有子部门' + JSON.stringify(childDeparts))
        return childDeparts
      },
      setAsChildren: function () { //将列表数据设置为副部门的children
        console.log('********setAsChildren将子部门数据保存至本地数组中********')
        let parentId = parseInt(this.$route.params.id)
        let departList = events.getSessionArray(consts.KEY_DEPARTS)
        departList[this.getDepartIndex(parentId)].children = this.listData
        console.log('要保存至本地的列表数据：' + JSON.stringify(departList))
        //将修改后的数据保存到本地储存列表
        sessionStorage.setItem(consts.KEY_DEPARTS, JSON.stringify(departList))
      },
      getDepartIndex: function (id) { //获取部门再部门列表中的序号
        console.log('********getDepartIndex获取部门在部门列表中的序号********')
        let departList = JSON.parse(sessionStorage.getItem(consts.KEY_DEPARTS))
        console.log('获取的本地部门列表数据：' + JSON.stringify(departList))
        for (let i in departList) {
          console.log('遍历的部门：' + JSON.stringify(departList[i]) + ',部门id类型：' + typeof(departList[i].value))
          console.log('id类型：' + typeof(id))
          if (parseInt(departList[i].value) === id) {
            console.log('获取的部门列表的位置：' + i)
            return i
          }
        }
      },
      getLocalChildren: function () { //获取本地的子项
        console.log('********getLocalChildren获取保存至本地的本部门子部门和人員********')
        let id = parseInt(this.$route.params.id)
        let departList = events.getSessionArray(consts.KEY_DEPARTS)

        let departs = departList.filter(function (depart) {
          return depart.value === id
        })
        if (departs && departs.length > 0) {
          return departs[0].children
        } else {
          return []
        }
      },
      getDepartInfo: function () {
        let list = JSON.parse(sessionStorage.getItem(consts.KEY_DEPARTS))
        for (let i in list) {
          if (parseInt(this.$route.params.id) === list[i].value) {
            return list[i]
          }
        }
      },
      setPosition: function () {
        console.log('********setPosition********')
        if (parseInt(parseInt(this.$route.params.id)) === -1) {
          events.setSessionMapValue(consts.KEY_DEPART_POSITION, 1, 1)
        } else {
          let departInfo = this.getDepartInfo()
          let parentPosition = events.getSessionMapValue(consts.KEY_DEPART_POSITION, departInfo.parentvalue)
          events.setSessionMapValue(consts.KEY_DEPART_POSITION, departInfo.value, parseInt(parentPosition) + 1)
        }
        console.log('本地存储的部门位置:' + JSON.stringify(events.getSessionMap(consts.KEY_DEPART_POSITION)))
      },
      //通过部门id 更新界面
      routerTo: function (item) {
        console.log('********routerTo路由跳转********')
        router.push(
          {
            name: 'choose-person',
            params: {
              id: item.value
            }
          }
        )
      },
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
