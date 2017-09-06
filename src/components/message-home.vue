<template>
  <div class="page tabbar js_show">
    <div class="page__bd" style="height:100%;">
      <div class="weui-tab">
        <div class="weui-tab__panel"></div>
        <div class="weui-tabbar">
          <a v-for="bar in bars" class="weui-tabbar__item weui-tabbar__item_on">
        <span class="tabbar-span">
          <img src="../images/icon_tabbar.png"/>
        </span>
            <p class="weui-tabbar__label">{{bar.label}}</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import consts from '../mock-data/consts'

  export default {
    name: 'msg-home',
    data: function () {
      return {
        bars: consts.MSGHOMEBARS
      }
    }
  }
</script>
<style>
  .tabbar-span {
    display: inline-block;
    position: relative;
  }
</style>
