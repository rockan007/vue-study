<!--组件：消息回复列表-->
<template>
  <div>
    <div></div>
    <ul>
      <li v-for="(item,index) in listData">
        <!--头像-->
        <img/>
        <div>
          <div>
            <!--名字-->
            <p></p>
            <!--时间-->
            <p></p>
          </div>
          <!--内容-->
          <p></p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'reply-list',
    props: {
      msgId: {
        type: Number
      }
    },
    data: function () {
      return {
        listData: []
      }
    }
  }
</script>
<style>

</style>
