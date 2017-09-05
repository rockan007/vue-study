<template>
  <div v-bind:class="['weui-uploader']">
  <div v-bind:class="['weui-uploader__hd']">
    <p v-bind:class="['weui-uploader__title']">{{getHintInfo()}}</p>
    <div v-bind:class="['weui-uploader__info']">{{uploadedFiles.length}}'/1</div>
    </div>
  <div v-bind:class="['weui-uploader__bd']">
    <ul v-bind:class="['weui-uploader__files']" id="uploaderFiles">
      <li v-for="file in uploadedFiles" v-bind:class="['weui-uploader__file']" v-bind:style="{'background-image':'url('+file.fileurl+')'}"></li>
      </ul>
    <div v-bind:class="['weui-uploader__input-box']" v-on:click="toExtra()">
      <input v-if="((msgType!==2&&msgType!==5)||uploadReal)&&msgType!==1" id="uploaderInput"
             v-bind:class="['weui-uploader__input']" type="file" v-bind:accept="getAcceptType()" v-on:change="selectFile($event)">
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'extra-file',
    data(){
      return {
        uploadFiles:[]
      }
    },
    created:function () {

    },
    methods:{
      getAcceptType:function () {

      },
      selectFile:function (event) {

      },
      getHintInfo:function () {

      }
    }
  }
</script>
