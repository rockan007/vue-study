<template>
  <div class="container" id="container">
    <div class="page tabbar js_show">
      <div class="page__bd" style="height:100%;">
        <div class="weui-tab">
          <div class="weui-tab__panel">
            <router-view></router-view>
          </div>
          <div class="weui-tabbar">
            <router-link   v-for="(bar,index) in bars" v-bind:key="index" class="weui-tabbar__item"
                           v-bind:to="bar.routerLink" active-class="weui-bar__item_on">
              <span class="tabbar-span">
                <img src="../images/icon_tabbar.png"/>
              </span>
              <p class="weui-tabbar__label">{{bar.label}}</p>
            </router-link>
          </div>
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
        bars: consts.MSGHOMEBARS,
        activeLink:0
      }
    },
    methods:{
    }
  }
</script>
<style>
  .tabbar-span {
    display: inline-block;
    position: relative;
  }
  .weui-tab__panel {
    padding-bottom: 80px;
  }
</style>
