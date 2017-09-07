<template>
  <div>
    <!--显示信息列表-->
    <template v-if="listData.length>0">
      <div v-for="(item,index) in listData">
        <div class="weui-flex">
          <div class="weui-flex__item">
            <p><span></span>{{item.title}}</p>
          </div>
          <p>{{item.date}}</p>
        </div>
        <p>{{item.content}}</p>
        <!--附件 圖片 視頻 及其他-->
        <div></div>
      </div>
    </template>
    <!--无信息时显示的界面-->
    <div v-else>

    </div>
  </div>
</template>
<script>
  export default {
    name: 'msg-list',
    data: function () {
      return {
        listData: []
      }
    },
    methods: {

    }
  }

</script>
