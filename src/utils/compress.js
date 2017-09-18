/**
 * 图片压缩和上传
 */
import consts from '../mock-data/consts'

export default {
  uploadImg: function (file, maxSize, callback) {
    maxSize = maxSize * 1024 * 1024
    console.log('要处理的图片地址：' + file.name)
    this.getFileReader(file, maxSize, callback)
  },
  getFileReader: function (file, maxSize, callback) {
    let com = this
    let reader = new FileReader()
    reader.onload = function () {
      let result = this.result
      let formData = new FormData()
      com.getImgInfo(result, function (img, imgInfo) {
        console.log('获取的文件信息：' + JSON.stringify(imgInfo))
        console.log('原图尺寸：' + result.length)
        if (result.length > maxSize) {
          let newDataUrl = com.getCanvasDataUrl(img, com.getSuitableSize(imgInfo, Math.ceil(result.length / maxSize)))
          let blob = com.base64ToBlob(newDataUrl, 'image/jpeg')
          console.log('blob.type:' + blob.type)
          console.log('要传递的文件大小：' + blob.size)
          //					let newFile = new File([blob], Date.now() + '.png');
          formData.append('image', blob, Date.now() + '.jpg')
        } else {
          formData.append('image', file)
        }
        com.postFile(formData, callback)
      })
    }

    reader.readAsDataURL(file)
  },
  postFile: function (formData, callback) {
    console.log('开始上传')
    $.ajax({
      url: consts.UPLOADURL,
      type: 'POST',
      cache: false,
      contentType: false,
      processData: false,
      data: formData,
      dataType: 'json',
      success: function (response) {
        console.log('上传文件获取的回调：' + JSON.stringify(response))
        callback(response)
      },
      error: function (errRes) {
        callback(errRes)
        console.log('发生未知错误：' + JSON.stringify(errRes))
        console.log(errRes)
      }
    })
  },
  getCanvasDataUrl: function (img, suitableSize) {
    console.log('*****重绘图片的宽高******')
    let imageType = 'image/jpeg',
      imageArgu = 0.7
    let canvas = document.createElement('canvas')
    canvas.width = suitableSize.width
    canvas.height = suitableSize.height
    let ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, suitableSize.width, suitableSize.height)
    return canvas.toDataURL(imageType, imageArgu)
  },
  getSuitableSize: function (imgInfo, multi) {
    imgInfo.width = imgInfo.width / multi
    imgInfo.height = imgInfo.height / multi
    console.log('获取的图片要裁剪的尺寸：' + JSON.stringify(imgInfo))
    return imgInfo
  },
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

  base64ToBlob: function (base64Url, mime) {
    let base64 = base64Url.replace(/^data:image\/(png|jpeg|jpg);base64,/, '')
    //		console.log("处理后的database64:" + base64);
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
  }
}
