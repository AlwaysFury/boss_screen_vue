import http from '../utils/http';

/** * @parms resquest 请求地址 例如：http://197.82.15.15:8088/request/... * @param '/testIp'代表vue-cil中config，index.js中配置的代理 */
let resquest = "/api";

// 获取产品等级
export function getProductGradeSelect(param) {
  return http.get(`${resquest}/product/gradeSelect`, param)
}

// 获取产品标签
export function getProductTagSelect(param) {
  return http.get(`${resquest}/product/tagSelect`, param)
}

// 获取图案等级
export function getPhotoGradeSelect(param) {
  return http.get(`${resquest}/photo/gradeSelect`, param)
}

// 获取图案标签
export function getPhotoTagSelect(param) {
  return http.get(`${resquest}/photo/tagSelect`, param)
}

// 获取等级类型
export function getTagTypeSelect(param) {
  return http.get(`${resquest}/tag/typeSelect`, param)
}
