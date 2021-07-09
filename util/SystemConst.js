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

module.exports = {
    status,
    purchaseStatus,
    paymentStatus,
    storageStatus,
    storageType,
    storageImportType,
    storageExportType,
    storageCheckStatus
}