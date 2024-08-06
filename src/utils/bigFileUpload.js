import SparkMD5 from "spark-md5";
import axios from "axios";

const URL = "/api/photo/uploadChunk"

const chunkSize = 10 * 1024 * 1024;
let fileMd5;

async function calculateFileMD5(file) {
  try {
    fileMd5 = await getFileMd5(file);
    const res = await uploadFile(file, fileMd5);
    return res;
  } catch (error) {
    return { upload: false }
  }
  // getFileMd5(file).then(async (md5) => {
  //   fileMd5 = md5;
  //   const res =uploadFile(file)
  // })
}

async function uploadFile(file) {
  if (!file) return;
  const fileArr = sliceFile(file);
  const fileName = file.name;
  let uploadId = "";

  try {
    let data = new FormData()
    data.append('filename', fileName)
    data.append('identifier', fileMd5)
    data.append('totalChunks', fileArr.length);
    data.append('chunkSize', chunkSize);
    data.append("file", new File([fileArr[0]], fileName))
    data.append('chunkNumber', 1);
    const res = await upload(data);
    uploadId = res.uploadId;

    const uploadPromises = fileArr.map((chunk, index) => {
      data = new FormData(); // 创建新的 FormData 对象
      data.append('filename', fileName)
      data.append('identifier', fileMd5)
      data.append('totalChunks', fileArr.length);
      data.append('chunkSize', chunkSize);
      data.append("file", new File([chunk], fileName));
      data.append('chunkNumber', index + 1);
      data.append("uploadId", uploadId);

      return upload(data);
    });

    // 等待所有分块上传完成
    const allRes = await Promise.all(uploadPromises);
    const imgUrlObj = allRes.find(item => item.url);
    if (imgUrlObj) {
      return { upload: true, src: imgUrlObj.url }
    } else {
      return { upload: false }
    }
  } catch (e) {
    console.log("e-------------", e)
  }
}

function getFileMd5(file) {
  return new Promise((resolve) => {
    let fileReader = new FileReader()
    fileReader.onload = function (event) {
      let fileMd5 = SparkMD5.ArrayBuffer.hash(event.target.result)
      resolve(fileMd5)
    }
    fileReader.readAsArrayBuffer(file)
  })
}

// 文件上传
function upload(data) {
  return new Promise((resolve, reject) => {
    axios.post(URL, data)
      .then((response) => {
        resolve(response?.data?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  // axios.post(URL, data).then((res) => {
  //   console.log("上传成功")
  // })
}

// 检查文件上传成功与否
// function checkFile() {
//   var xhr = new XMLHttpRequest();
//   // 当上传完成时调用
//   xhr.onload = function () {
//     if (xhr.status === 200) {
//       checkFileRes.innerHTML = '检测文件完整性成功:' + xhr.responseText;
//     }
//   }
//   xhr.onerror = function () {
//     checkFileRes.innerHTML = '检测文件完整性失败';
//   }
//   // 发送请求
//   xhr.open('POST', '/checkFile', true);
//   let data = new FormData();
//   data.append("md5", fileMd5)
//   xhr.send(data);
// }

// 切割文件
function sliceFile(file) {
  const chunks = [];
  let start = 0;
  let end;
  while (start < file.size) {
    end = Math.min(start + chunkSize, file.size);
    chunks.push(file.slice(start, end));
    start = end;
  }
  return chunks;
}

export { calculateFileMD5, uploadFile }