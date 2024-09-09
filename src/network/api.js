import http from '../utils/http';
import axios from "axios";

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

// 刷新等级
export function refreshLevel(param) {
  return http.get(`${resquest}/product/refreshGrade`, param)
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

// 产品款式信息
export function getModel(param) {
  return http.get(`${resquest}/model/getModel`, param)
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

// 订单详情
export function getOrderDetail(param) {
  return http.get(`${resquest}/order/info`, param)
}

// 刷新订单信息
export function refreshOrders(param) {
  return http.post(`${resquest}/order/refreshOrders`, param)
}

// 订单货物及数量统计信息
export function getOrderItem(param) {
  return http.get(`${resquest}/orderItem/getOrderItem`, param)
}

// 物流信息
export function getTrackingInfo(param) {
  return http.get(`${resquest}/trackingInfo/getTrackingInfo`, param)
}

// 订单调整信息
export function getPayoutInfo(param) {
  return http.get(`${resquest}/payoutInfo/getPayoutInfo`, param)
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

// 获取标签列表
export function getTagList(data) {
  return http.get(`${resquest}/tag/tagList`, data)
}

// 根据 id 获取标签
export function getTagDetail(data) {
  return http.get(`${resquest}/tag/getTag`, data)
}

// 根据 id 删除标签
export function deleteTag(data) {
  return http.post(`${resquest}/tag/delete`, data)
}

// 标签新增或修改
export function updateTag(data) {
  return http.post(`${resquest}/tag/saveOrUpdate`, data)
}

// 获取款号列表
export function getModelList(data) {
  return http.get(`${resquest}/sku/skuList`, data)
}

// 根据 id 获取款号
export function getModelDetail(data) {
  return http.get(`${resquest}/sku/getSkuInfo`, data)
}

// 根据 id 获取关联款号
export function getLinkSku(data) {
  return http.get(`${resquest}/sku/skuStatistics`, data)
}

// 根据 id 删除款号
export function deleteModel(data) {
  return http.post(`${resquest}/sku/delete`, data)
}

// 款号新增或修改
export function updateModel(data) {
  return http.post(`${resquest}/sku/save`, data)
}

// 图案列表
export function getPatternList(data) {
  return http.get(`${resquest}/photo/photoList`, data)
}

// 获取详情
export function getPatternDetail(data) {
  return http.get(`${resquest}/photo/getPhotoInfo`, data)
}

// 根据 id 删除图案
export function deletePattern(data) {
  return http.post(`${resquest}/photo/delete`, data)
}

// 图案新增或修改
export function updatePattern(data) {
  return http.post(`${resquest}/photo/save`, data)
}

// 刷新图案等级
export function refreshPhoto(param) {
  return http.get(`${resquest}/photo/refreshGrade`, param)
}


export function uploadImg(data) {
  return http.post(`${resquest}/photo/upload`, data, { "Content-Type": "multipart/form-data" })
}

// 产品详情保存标签
export function saveTagList(data) {
  return http.post(`${resquest}/product/saveTag`, data)
}

// 产品表现详细信息
export function getExpressionDetail(param) {
  return http.get(`${resquest}/product/getProductExpressionInfo`, param)
}

// 分类列表
export function getCategoryList(param) {
  return http.get(`${resquest}/category/categoryList`, param)
}

// 分类编辑
export function saveCategory(data) {
  return http.post(`${resquest}/category/saveOrUpdate`, data)
}

// 活动表现详细信息
export function getActiveDetail(param) {
  return http.get(`${resquest}/product/getActivityInfo`, param)
}

// 获取上传图片id
export function getUploadId(param) {
  return http.get(`${resquest}/photo/getUploadId`, param)
}

// 批量编辑标签
export function batchSaveTag(data) {
  return http.post(`${resquest}/photo/saveBatchTag`, data)
}

// 导出订单
export function exportOrder(data) {
  axios.post(`${resquest}/order/export`, data, { responseType: 'blob' }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '订单列表.xls');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  })
  // return http.post(`${resquest}/order/export`, data, { responseType: 'blob' })
}

// 导出产品
export function exportProduct(data) {
  axios.post(`${resquest}/product/export`, data, { responseType: 'blob' }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '产品信息.xls');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  })
  // return http.post(`${resquest}/order/export`, data, { responseType: 'blob' })
}

// 刷新标签
export function refreshTag(param) {
  return http.get(`${resquest}/order/refreshTag`, param)
}

// 衣服种类列表
export function getClothingList(param) {
  return http.get(`${resquest}/clothesType/clothesTypeList`, param)
}

// 编辑衣服种类
export function saveClothing(data) {
  return http.post(`${resquest}/clothesType/saveOrUpdate`, data)
}

// 删除衣服种类
export function deleteClothing(data) {
  return http.post(`${resquest}/clothesType/delete`, data)
}

// 批量编辑标签
export function batchSaveProductTag(data) {
  return http.post(`${resquest}/product/saveBatchTag`, data)
}

// 导入产品标签
export function importProductTag(data) {
  return http.post(`${resquest}/product/saveBatchTagByExcel`, data, { 'Content-Type': 'multipart/form-data' })
}

// 导入图案标签
export function importPatternTag(data) {
  return http.post(`${resquest}/photo/saveBatchTagByExcel`, data)
}