import { splitChunk } from "./main"
self.onmessage = async function (e) {
  console.log("子线程收到数据", e.data)
  let {
    file,
    CHUNK_SIZE,
    startChunkIndex,
    endChunkIndex
  } = e.data
  let promises = []
  for (let i = startChunkIndex; i < endChunkIndex; i++) {
    promises.push(splitChunk(file, i, CHUNK_SIZE))
  }
  let chunks = await Promise.all(promises)
  console.log(chunks)
  postMessage(chunks)
}