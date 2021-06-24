'use strict';

const status = { //使用状态
    unusable:0,//停用、无法使用
    usable:1//可用
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
    storageCountExport:23,//盘盈出库
    orderExport:24,//订单出库
    innerExport:25//内部领料出库
}

module.exports = {
    status
}