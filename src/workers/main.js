import SparkMD5 from "spark-md5";
import axios from "axios";
// import 

const UPLOAD_URL = "/api/photo/uploadChunk"

const CHUNK_SIZE = 1024 * 1024 * 2 // 分片大小5M
const KERNEL_COUNT = navigator.hardwareConcurrency || 4 // 内核数量，如果取不到则为4

/**
 * @description 切片
 * @param {Object} file: file对象
 * @param {Number} i: 当前处理的第几个任务
 * @param {Number} size: 一个切片的大小
 */
export function splitChunk(file, i, size) {
  return new Promise((resolve) => {
    let start = i * size
    let end = (i + 1) * size
    let blob = file.slice(start, end)
    // 获取文件hash值
    getFileHash(blob)
      .then(res => {
        resolve({
          blob: blob,
          start,
          end,
          index: i,
          hash: res
        })
      })
  })
}

/**
 * @description 获取文件hash值
 * @param {Object} file: 源文件信息
 */
function getFileHash(file) {
  let spark = new SparkMD5.ArrayBuffer()
  return new Promise(function (resolve, reject) {
    let fileReader = new FileReader()

    fileReader.onload = function (e) {
      let buffer = e.target.result
      if (file.size != buffer.byteLength) {
        reject("获取文件hash失败，按理说不可能");
      } else {
        spark.append(buffer) // 解析 Buffer
        resolve(spark.end())
      }
    };

    fileReader.onerror = function () {
      reject("文件初始化读取Buffer失败");
    };

    fileReader.readAsArrayBuffer(file);
  });
}

/**
 * @description 进行分片
 * @param {Object} file: 当前要处理的任务对象
 */
function createChunk(file) {
  return new Promise(((resolve) => {
    // 结果
    let result = []
    // 计算分片数量
    let count = Math.ceil(file.size / CHUNK_SIZE)
    // 计算线程开启数量
    let workerCount = Math.ceil(count / KERNEL_COUNT)
    // 当前线程执行完毕的数量
    let finishCount = 0
    for (let i = 0; i < workerCount; i++) {
      // 创建一个线程，并且分配任务
      const worker = new Worker(new URL('./worker.js', import.meta.url))
      // 开始
      let start = i * KERNEL_COUNT
      // 因为线程数量是向上取整，有除不尽的情况，这里要处理下结束的chunkIndex，如果最后一个chunk大于总chunk数，则写死
      let end = (i + 1) * KERNEL_COUNT
      if (end > count) {
        end = count
      }
      try {
        // 分配任务
        worker.postMessage({
          file,
          CHUNK_SIZE,
          startChunkIndex: start,
          endChunkIndex: end
        })
      } catch (e) {
        console.log("error", e)
      }
      // 接收处理结果
      worker.onmessage = e => {
        // 这里为了避免顺序乱，取当前的执行索引
        for (let i = start; i < end; i++) {
          result[i] = e.data[i - start]
        }
        worker.terminate() // 结束任务
        finishCount++ // 完成数量++
        if (finishCount === workerCount) {
          resolve(result)
        }
      }
    }
  }))
}

export async function uploadFile(file, uploadId) {
  const res = await createChunk(file);
  if (!res || res?.length == 0) {
    return;
  }
  const fileName = file.name;
  try {
    for (let index = 0; index < res.length; index++) {
      const chunk = res[index]
      const data = new FormData();
      data.append('filename', fileName)
      data.append('identifier', chunk.hash)
      data.append('totalChunks', res.length);
      data.append('chunkSize', CHUNK_SIZE);
      data.append("file", new File([chunk.blob], fileName));
      data.append('chunkNumber', index + 1);
      data.append("uploadId", uploadId);
      await axios.post(UPLOAD_URL, data)
    }

  } catch (e) {
    console.log("文件处理失败")
  }
}
