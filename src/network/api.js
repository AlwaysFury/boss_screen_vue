import http from '../utils/http';

/** * @parms resquest 请求地址 例如：http://197.82.15.15:8088/request/... * @param '/testIp'代表vue-cil中config，index.js中配置的代理 */
let resquest = "/api"

export function getAuth(type = 'shop', uuid) {
  return http.get(`${resquest}/shopee/getAuthUrl?type=${type}&userId=${uuid}`)
}

// 商铺列表
export function getShopList(param) {
  return http.get(`${resquest}/shop/shopList`, param)
}

// 单选框获取店铺
export function getShopSelect(param) {
  return http.get(`${resquest}/shop/shopSelect`, param)
}

// 修改店铺名称
export function updateShopName(param) {
  return http.post(`${resquest}/shop/saveName`, param)
}

// 产品列表
export function getProductList(param) {
  return http.get(`${resquest}/product/productList`, param)
}

// 刷新产品信息
export function refreshProducts(param) {
  return http.post(`${resquest}/product/refreshProducts`, param)
}

// 单选框获取分类
export function getCategorySelect(param) {
  return http.get(`${resquest}/product/categorySelect`, param)
}

// 单选框获取商品状态
export function getStatusSelect(param) {
  return http.get(`${resquest}/product/statusSelect`, param)
}

// 产品详情
export function getProductDetail(param) {
  return http.get(`${resquest}/product/info`, param)
}

// 日志列表
export function getLogList(param) {
  return http.get(`${resquest}/optLog/optLogList`, param)
}

// 日志详情
export function getLogDetail(param) {
  return http.get(`${resquest}/optLog/getOptLog`, param)
}

// 日志修改
export function updateLogInfo(param) {
  return http.post(`${resquest}/optLog/saveOrUpdateLog`, param)
}

// 日志删除
export function deleteLogInfo(param) {
  return http.post(`${resquest}/optLog/delete`, param)
}

// 订单列表
export function getOrderList(param) {
  return http.get(`${resquest}/order/orderList`, param)
}

// 单选框获取订单状态
export function getOrderStatusSelect(param) {
  return http.get(`${resquest}/order/statusSelect`, param)
}

// 订单详情
export function getOrderDetail(param) {
  return http.get(`${resquest}/order/info`, param)
}

// 更新店铺状态
export function updateShopStatus(data) {
  return http.get(`${resquest}/shop/updateShopStatus`, data)
}

// 账号列表
export function getAccountList(param) {
  return http.get(`${resquest}/mainAccount/accountList`, param)
}

// 更新账号状态
export function updateAccountStatus(data) {
  return http.get(`${resquest}/mainAccount/updateAccountStatus`, data)
}

// 成本列表
export function getCostList(data) {
  return http.get(`${resquest}/cost/costList`, data)
}

// 单选框获取成本类型
export function getCostTypeSelect(data) {
  return http.get(`${resquest}/cost/costTypeSelect`, data)
}

// 成本新增或修改
export function updateCost(data) {
  return http.post(`${resquest}/cost/saveOrUpdate`, data)
}

// 根据 id 获取成本
export function getCostDetail(data) {
  return http.get(`${resquest}/cost/costList`, data)
}

// 删除成本
export function deleteCost(data) {
  return http.post(`${resquest}/cost/delete`, data)
}


// 获取等级规则列表
export function getLevelList(data) {
  return http.get(`${resquest}/rule/ruleList`, data)
}

// 根据 id 获取等级规则
export function getLevelDetail(data) {
  return http.get(`${resquest}/rule/getRuleInfo`, data)
}

// 等级规则新增或修改
export function updateLevel(data) {
  return http.post(`${resquest}/rule/saveOrUpdate`, data)
}

// 删除等级规则
export function deleteLevel(data) {
  return http.post(`${resquest}/rule/delete`, data)
}


