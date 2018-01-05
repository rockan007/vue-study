/**
 * 图片压缩和上传
 */
import { consts } from '../mock-data/consts'
import { request } from './request'
import EXIF from 'exif-js'

export let compress = {
  /**
   *
   * @param file
   * @param maxSize
   * @param callback
   */
  uploadImg: function (file, maxSize, callback) {
    maxSize = maxSize * 1024 * 1024
    console.log('要处理的图片地址：' + file.name)
    this.getFileReader(file, maxSize, callback)
  },
  /**
   *
   * @param file
   * @param maxSize
   * @param callback
   */
  getFileReader: function (file, maxSize, callback) {
    let com = this
    com.getOrientation(file, function (orientation) {
      let reader = new FileReader()
      reader.onload = function () {
        let result = this.result
        let formData = new FormData()
        com.getImgInfo(result, function (img, imgInfo) {
          // com.getOrientation(img, function (orientation) {
          console.log('获取的文件信息：' + JSON.stringify(imgInfo))
          console.log('原图尺寸：' + result.length)
          if (result.length > maxSize) {
            let newDataUrl = com.getCanvasDataUrl(img, com.getSuitableSize(imgInfo, Math.ceil(result.length / maxSize)), orientation)
            let blob = com.base64ToBlob(newDataUrl, 'image/jpeg')
            console.log('blob.type:' + blob.type)
            console.log('要传递的文件大小：' + blob.size)
            formData.append('image', blob, Date.now() + Math.random() * 1000 + '.jpg')
          } else {
            formData.append('image', file)
          }
          com.postFile(formData, callback)
        })
      }

      reader.readAsDataURL(file)
    })

  },
  getOrientation: function (img, callback) {
    EXIF.getData(img, function () {
      let orientation = EXIF.getTag(img, 'Orientation')
      console.log('获取的方向数据：' + orientation)
      callback(orientation)
    })
  },
  /**
   *
   * @param formData
   * @param callback
   */
  postFile: function (formData, callback) {
    console.log('开始上传')
    request.postData(consts.UPLOADURL, formData, callback)
  },
  /**
   *
   * @param img
   * @param suitableSize
   * @param orientation
   * @return {string}
   */
  getCanvasDataUrl: function (img, suitableSize, orientation) {
    console.log('*****重绘图片的宽高******')
    let imageType = 'image/jpeg',
      imageArgu = 0.7
    let canvas = document.createElement('canvas')
    canvas.width = suitableSize.width
    canvas.height = suitableSize.height
    let ctx = canvas.getContext('2d')
    switch (orientation) {
      case 3:
        // 180° rotate left
        ctx.translate(canvas.width, canvas.height)
        ctx.rotate(Math.PI)
        break
      case 6:
        // 90° rotate right
        canvas.width = suitableSize.height
        canvas.height = suitableSize.width
        ctx.translate(suitableSize.height, 0);
        ctx.rotate(0.5 * Math.PI)
        break
      case 8:
        // 90° rotate left
        canvas.width = suitableSize.height
        canvas.height = suitableSize.width
        ctx.translate(0, suitableSize.width);
        ctx.rotate(-0.5 * Math.PI)
        break
      default:
        break
    }
    ctx.drawImage(img, 0, 0, suitableSize.width, suitableSize.height)
    return canvas.toDataURL(imageType, imageArgu)
  },
  /**
   *
   * @param imgInfo
   * @param multi
   * @return {*}
   */
  getSuitableSize: function (imgInfo, multi) {
    imgInfo.width = imgInfo.width / multi
    imgInfo.height = imgInfo.height / multi
    console.log('获取的图片要裁剪的尺寸：' + JSON.stringify(imgInfo))
    return imgInfo
  },
  /**
   *
   * @param result
   * @param callback
   */
  getImgInfo: function (result, callback) {
    let img = new Image()
    let imgInfo = {}
    img.onload = function () {
      console.log(img)
      imgInfo.width = img.naturalWidth
      imgInfo.height = img.naturalHeight
      console.log('获取的图片宽高：' + JSON.stringify(imgInfo))
      callback(img, imgInfo)
    }

    img.src = result
  },
  /**
   *
   * @param base64Url
   * @param mime
   * @return {*}
   */
  base64ToBlob: function (base64Url, mime) {
    let base64 = base64Url.replace(/^data:image\/(png|jpeg|jpg);base64,/, '')
    let sliceSize = 1024
    let byteChars = window.atob(base64)
    let byteArrays = []

    for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      let slice = byteChars.slice(offset, offset + sliceSize)

      let byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      let byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }
    console.log('文件类型：' + mime)
    return new Blob(byteArrays, {
      type: mime
    })
  },
  /**
   *
   * @param videoUrl
   * @param callback
   */
  getVideoCover: function (videoUrl, callback) {
    let com = this
    let video = document.createElement('video')
    video.addEventListener('loadeddata', function () {
      callback(com.captureImage(video))
    })
    video.src = videoUrl
  },
  /**
   *
   * @param video
   * @return {*}
   */
  captureImage: function (video) {
    let suitableSize = {
      width: video.videoWidth,
      height: video.videoHeight
    }
    console.log('compress获取的视频宽高：' + JSON.stringify(suitableSize))
    return this.getCanvasDataUrl(video, suitableSize)
  }

}
