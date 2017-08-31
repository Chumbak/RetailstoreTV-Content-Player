import RNFS from 'react-native-fs'

let contentFolder = RNFS.ExternalStorageDirectoryPath + '/StoreTV'

const createFolder = function () {
  RNFS.mkdir(contentFolder)
  .then((success) => {
    console.log('Folder created successfully!')
  })
  .catch((err) => {
    console.log(err.message)
  })
}

const accessData = function () {
  let filePaths = []
  let contents = []
  return new Promise((resolve, reject) => {
    // check if folder exists
    RNFS.readDir(contentFolder)
    .then((result) => {
      console.log('Accessing data...')
      if (result.length === 0) {
        console.log('Empty folder!')
      } else {
        for (let i = 0; i < result.length; i++) {
          filePaths.push(result[i].path)
        }
        for (let i = 0; i < filePaths.length; i++) {
          contents.push({
            type: filePaths[i].indexOf('.mp4') > -1 ? 'video' : 'image',
            path: filePaths[i]
          })
        }
      }
      resolve(contents)
    })
    .catch((err) => {
      createFolder()
      console.log('Folder not present!', err)
      reject(err)
    })
  })
}

export default accessData
