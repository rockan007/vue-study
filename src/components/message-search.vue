<template>
  <div class="weui-search-bar" id="searchBar">
    <form class="weui-search-bar__form">
      <div class="weui-search-bar__box">
        <i class="weui-icon-search"></i>
        <input type="search" class="weui-search-bar__input" placeholder="搜索" id="searchInput" required>
        <a class="weui-icon-clear" id="searchClear"></a>
      </div>
      <label class="weui-search-bar__label" id="searchText">
        <i class="weui-icon-search"></i>
        <span>搜索</span>
      </label>
    </form>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    name: 'msg-search',
    data: function () {
      return {}
    },
    created: function () {
      $(function () {
        let $searchBar = $('#searchBar'),
//      $searchResult = $('#searchResult'),
          $searchText = $('#searchText'),
          $searchInput = $('#searchInput'),
          $searchClear = $('#searchClear'),
          $searchCancel = $('#searchCancel')

        function hideSearchResult () {
//      $searchResult.hide()
          $searchInput.val('')
        }

        function cancelSearch () {
          hideSearchResult()
          $searchBar.removeClass('weui-search-bar_focusing')
          $searchText.show()
        }

        $searchText.on('click', function () {
          $searchBar.addClass('weui-search-bar_focusing')
          $searchInput.focus()
        })
        $searchInput
          .on('blur', function () {
            if (!this.value.length) cancelSearch()
          })
          .on('input', function () {
            if (this.value.length) {
//          $searchResult.show()
            } else {
//          $searchResult.hide()
            }
          })

        $searchClear.on('click', function () {
          hideSearchResult()
          $searchInput.focus()
        })
        $searchCancel.on('click', function () {
          cancelSearch()
          $searchInput.blur()
        })
      })
    },
    methods: {}
  }
</script>
<style>
  .weui-search-bar__label {
    transform-origin: 0 0 0;
    opacity: 1;
    transform: scale(1, 1);
  }
</style>
