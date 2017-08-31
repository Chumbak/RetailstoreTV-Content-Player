import RNFS from 'react-native-fs'

let contentFolder = RNFS.ExternalStorageDirectoryPath + '/StoreTV'

const deleteData = function (storeContent, downloadResolve) {
  // check if folder exists
  RNFS.readDir(contentFolder)
  .then((result) => {
    // read folder and delete files which are no longer used
    // file names which are not present in storeContent are old files
    for (let i = 0; i < result.length; i++) {
      let found = 0
      let fileUrl = result[i].path
      let fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1)
      for (let j = 0; j < storeContent.length; j++) {
        let url = storeContent[j].url
        let contentName = url.substring(url.lastIndexOf('/') + 1)
        if (contentName === fileName) {
          found = 1
          break
        }
      }
      if (!found) {
        console.log('Removed old file: ', result[i].path)
        RNFS.unlink(result[i].path)
      }
    }
    // resolve update finish which is handled by slideshow screen (Line 58)
    downloadResolve()
  })
  .catch((err) => {
    console.log('Folder not present to delete files!', err)
  })
}

export default deleteData
