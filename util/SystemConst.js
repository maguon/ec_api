'use strict';

const status = { //使用状态
    unusable:0,//停用、无法使用
    usable:1//可用
}

//采购状态
const purchaseStatus = {
    ready_process:1,//待处理
    in_process:3,//处理中
    completed:7//完成
}

const paymentStatus = {
    non_payment:1,//未付款
    account_paid:7//付款
}

//仓储状态
const storageStatus = {
    not_put_in:1,//未入库
    put_in:7,//已入库
}

//是否需要出库
const storagePutsType ={
    no_need:0, //不需要
    need:1 //需要
}

//出库、入库
const storageType ={
    import:1, //入库
    export:2 //出库
}

const storageImportType ={
    purchaseImport:11, //采购入库
    storageMoveImport:12,//移库入库
    storageCountImport:13,//盘盈入库
    orderBackImport:14,//退单入库
    innerBackImport:15//内部退料入库
}
const storageExportType ={
    purchaseExport:21,//采购退货出库
    storageMoveExport:22,//移库出库
    storageCountExport:23,//盘亏出库
    orderExport:24,//订单出库
    innerExport:25//内部领料出库
}

//盘点状态
const storageCheckStatus = {
    not_check:0,//未盘点
    normal:1,//正常
    not_normal:2,//不正常
}

const serviceItemStatus = {
    unprocessed: 1 ,//未处理
    processing :3 ,//处理中，以派工
    processed :5 ,//施工完，未验收
    checked:7 ,  //验收完成
}

const prodItemStatus = {
    normal : 1 ,//未领取
    complete :3 ,//已领取
}

//退货状态
const prodRefundStatus = {
    normal : 1 ,//未退回
    complete :3 ,//已退回
}

const prodUniqueStatus = {
    not_check:0,//未验收
    check:1//验收
}

const orderStatus = {
    cancel:0,//取消
    normal: 1 ,//未处理
    processing :3 ,//处理中
    checking : 5 ,//处理完，未结算
    complete :7 //处理完成
}

const orderItemProdStatus = {
    not_outbound: 1 ,//未出库
    outbound :3 //已出库
}

const orderType = {
    interior: 1 ,//内部
    without :2 //外部
}

const orderPaymentStatus = {
    normal :1 ,//未付款
    in : 5,//支付中
    complete :7 //付款完成
}

//订单退单状态
const orderRefundStatus = {
    normal: 1 ,//未处理
    complete :7 //处理完成
}

//退单退仓状态
const orderRefundSrorageStatus = {
    not_refund :1 ,//未退仓
    refund : 5//已退仓
}

//退单退款状态
const orderRefundPaymentStatus = {
    normal :1 ,//未退款
    in : 5,//退款中
    complete :7 //退款完成
}

//支付状态
const paymentInfoStatus = {
    normal :0 ,//未支付
    complete :1 //支付完成
}

//支付类型（1.支付，2.退款）
const payType = {
    payment :1 ,//收款
    refund :2 //退款
}

//支付方式（1.挂账，2.现金）
const paymentType = {
    buyer_buying_on_credit :1 ,//挂账
    cash :2 //现金
}

//运费支付
const transferCostType = {
    opposite:1,//对方支付
    our:2//我方支付
}

//结算类型
const settleType = {
    monthly:1,//月结
    notMonthly:2//非月结
}

//定价方式
const priceType = {
    fixed:1,//固定售价
    ratio:2,//按采购价比率
    raise:3//按采购价加价
}

//是否全新
const oldFlag = {
    new:0,//是
    old:1//否
}

//系统类型
const deviceType = {
    android:1,//安卓
    ios:2//苹果
}

//供应商类型
const supplierType = {
    internal:1,//对内
    foreign:2//对外
}

//服务类型
const serviceType = {
    normal:1,//正常
    quick:2//快捷
}

//服务价格类型
const servicePriceType = {
    fixed:1,//固定售价
    unit:2//单价数量
}

//销售提成类型
const servicePerfType = {
    no:1,//无提成
    unit:2,//固定提成
    turnover:3,//营业额提成
    gross_margin:4//毛利提成
}

//客户来源
const sourceType = {
    interior: 1 ,//内部
    without :2 //外部
}

//客户类型
const clientType = {
    normal: 1 ,//普通
    vip:2 //大客户
}

//发票类型
const invoiceType = {
    firm: 1 ,//企业
    personage:2 //个人
}
module.exports = {
    status,
    purchaseStatus,
    paymentStatus,
    storageStatus,
    storageType,
    storageImportType,
    storageExportType,
    storageCheckStatus,
    orderStatus,
    orderType,
    serviceItemStatus,
    prodItemStatus,
    prodRefundStatus,
    orderRefundStatus,
    orderPaymentStatus,
    orderRefundPaymentStatus,
    paymentInfoStatus
}