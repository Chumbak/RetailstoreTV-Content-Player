import RNFS from 'react-native-fs'
import deleteData from './DeleteData'

let contentFolder = RNFS.ExternalStorageDirectoryPath + '/StoreTV'

const updateData = function (storeContent, filePaths) {
  let totalFiles = 0
  let downloadResolve
  // check if file already exists in folder
  const fileExists = (fileName) => {
    let found = 0
    filePaths.map((content) => {
      let url = content.path
      let name = url.substring(url.lastIndexOf('/') + 1)
      if (name === fileName) {
        found = 1
      }
    })
    return found
  }

  const downloadFile = (url, fileName, background) => {
    totalFiles++
    const downloadDest = contentFolder + '/' + fileName
    const ret = RNFS.downloadFile({ fromUrl: url, toFile: downloadDest, undefined, undefined, background })
    ret.promise.then(res => {
      console.log('Downloaded: ' + url)
      checkComplete()
    }).catch(err => {
      checkComplete()
      console.log(err)
    })
  }

  const checkComplete = () => {
    totalFiles--
    // check if all files download
    if (!totalFiles) {
      // remove old data after update
      deleteData(storeContent, downloadResolve)
    }
  }

  return new Promise((resolve, reject) => {
    downloadResolve = resolve
    storeContent.map((content) => {
      let url = content.url
      let fileName = url.substring(url.lastIndexOf('/') + 1)
      // download files if not present in folder
      if (!fileExists(fileName)) {
        downloadFile(url, fileName, true)
      }
    })
    if (!totalFiles) {
      deleteData(storeContent, downloadResolve)
    }
  })
}

export default updateData
