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
        lsitData: []
      }
    }
  }
</script>
<style>

</style>
