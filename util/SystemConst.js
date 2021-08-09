'use strict';

const status = { //使用状态
    unusable:0,//停用、无法使用
    usable:1//可用
}

const purchaseStatus = {
    ready_process:1,//待处理
    in_process:3,//处理中
    completed:7//完成
}

const paymentStatus = {
    non_payment:1,//未付款
    account_paid:7//付款
}

const storageStatus = {
    not_put_in:1,//未入库
    put_in:7,//已入库
}

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

const orderStatus = {
    normal: 1 ,//未处理
    processing :3 ,//处理中
    checking : 5 ,//处理完，未结算
    complete :7 //处理完成
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
    orderPaymentStatus

}