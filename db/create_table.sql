SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS=0;
-- CREATE FUNCTION UPDATE_TIMESTAMP_FUNC

create or replace function update_timestamp_func() returns trigger as
$$
begin
  new.updated_on = current_timestamp;
  return new;
end
$$
language plpgsql;

--CREATE TABLE user_info
CREATE TABLE IF NOT EXISTS public.user_info
(
    id smallserial NOT NULL,
    created_on timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_on timestamp with time zone NOT NULL DEFAULT NOW(),
    status smallint NOT NULL,
    user_name character varying(50),
    real_name character varying(50),
    password character varying(50) NOT NULL,
    phone character varying(50) NOT NULL,
    email character varying(100),
    gender smallint,
    type integer NOT NULL,
    PRIMARY KEY (id)
);

COMMENT ON COLUMN public.user_info.status IS '状态（0-停用，1-可用）';
COMMENT ON COLUMN public.user_info.user_name IS '用户名称';
COMMENT ON COLUMN public.user_info.real_name IS '真实姓名';
COMMENT ON COLUMN public.user_info.password IS '密码';
COMMENT ON COLUMN public.user_info.phone IS '联系方式';
COMMENT ON COLUMN public.user_info.email IS '邮箱';
COMMENT ON COLUMN public.user_info.gender IS '性别（0-女，1-男）';
COMMENT ON COLUMN public.user_info.type IS '用户类型（99-超级管理员）';

create trigger user_info_upt before update on user_info for each row execute procedure update_timestamp_func();
select setval('user_info_id_seq',1000,false);

CREATE UNIQUE INDEX uk_user_info_phone ON user_info(phone);

INSERT INTO user_info (status , user_name , real_name , password , phone , email , gender , type)
VALUES (1 , '超级管理员' , '管理员' , 'E10ADC3949BA59ABBE56E057F20F883E' , '19999999999' , '1234567@qq.com' , 0 , 99 )
on conflict(phone) DO NOTHING RETURNING id

--CREATE TABLE supplier_info
CREATE TABLE IF NOT EXISTS public.supplier_info (
    "id" smallserial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 0,
    "remark" character varying(200),
    "supplier_name" character varying(50),
    "supplier_type" smallint NOT NULL DEFAULT 1,
    "contact_name" character varying(20),
    "email" character varying(100),
    "tel" character varying(20),
    "mobile" character varying(15),
    "fax" character varying(15),
    "address" character varying(100),
    "invoice_title" character varying(50),
    "invoice_bank" character varying(50),
    "invoice_bank_ser" character varying(20),
    "invoice_address" character varying(50),
    "settle_type" smallint NOT NULL DEFAULT 0,
    "settle_month_day" smallint,

    PRIMARY KEY ("id")
);

COMMENT ON COLUMN public.supplier_info.supplier_name IS '供应商名称';
COMMENT ON COLUMN public.supplier_info.supplier_type IS '供应商类型';
COMMENT ON COLUMN public.supplier_info.contact_name IS '联系人姓名';
COMMENT ON COLUMN public.supplier_info.email IS '邮箱';
COMMENT ON COLUMN public.supplier_info.tel IS '电话';
COMMENT ON COLUMN public.supplier_info.mobile IS '手机';
COMMENT ON COLUMN public.supplier_info.fax IS '传真';
COMMENT ON COLUMN public.supplier_info.address IS '地址';
COMMENT ON COLUMN public.supplier_info.op_user IS '操作用户';
COMMENT ON COLUMN public.supplier_info.invoice_title IS '公司抬头';
COMMENT ON COLUMN public.supplier_info.invoice_bank IS '开户行';
COMMENT ON COLUMN public.supplier_info.invoice_bank_ser IS '开户账号';
COMMENT ON COLUMN public.supplier_info.invoice_address IS '发票地址';
COMMENT ON COLUMN public.supplier_info.settle_type IS '结算类型';
COMMENT ON COLUMN public.supplier_info.settle_month_day IS '月结日期';
COMMENT ON COLUMN public.supplier_info.remark IS '备注';

create trigger supplier_info_upt before update on supplier_info for each row execute procedure update_timestamp_func();
select setval('supplier_info_id_seq',1000,false);
--CREATE TABLE storage_info
CREATE TABLE IF NOT EXISTS public.storage_info (
    "id" smallserial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 0,
    "remark" character varying(200),
    "storage_name" character varying(50),
    PRIMARY KEY ("id")
);
create trigger storage_info_upt before update on storage_info for each row execute procedure update_timestamp_func();
select setval('storage_info_id_seq',1000,false);

--CREATE TABLE storage_area_info
CREATE TABLE IF NOT EXISTS public.storage_area_info (
    "id" smallserial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 0,
    "remark" character varying(200),
    "storage_area_name" character varying(50),
    "storage_id" smallint NOT NULL,
    PRIMARY KEY ("id")
);
create trigger storage_area_info_upt before update on storage_area_info for each row execute procedure update_timestamp_func();
select setval('storage_area_info_id_seq',1000,false);

--CREATE TABLE brand_info
CREATE TABLE IF NOT EXISTS public.brand_info (
    "id" smallserial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 0,
    "remark" character varying(200),
    "brand_name" character varying(50),
    PRIMARY KEY ("id")
);
create trigger brand_info_upt before update on brand_info for each row execute procedure update_timestamp_func();
select setval('brand_info_id_seq',1000,false);

--CREATE TABLE brand_model_info
CREATE TABLE IF NOT EXISTS public.brand_model_info (
    "id" smallserial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 0,
    "remark" character varying(200),
    "brand_model_name" character varying(50),
    "brand_id" smallint NOT NULL,
    PRIMARY KEY ("id")
);
create trigger brand_model_info_upt before update on brand_model_info for each row execute procedure update_timestamp_func();
select setval('brand_model_info_id_seq',1000,false);

--CREATE TABLE category_info
CREATE TABLE IF NOT EXISTS public.category_info (
    "id" smallserial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 0,
    "remark" character varying(200),
    "category_name" character varying(50),
    PRIMARY KEY ("id")
);
create trigger category_info_upt before update on category_info for each row execute procedure update_timestamp_func();
select setval('category_info_id_seq',1000,false);

--CREATE TABLE category_sub_info
CREATE TABLE IF NOT EXISTS public.category_sub_info (
    "id" smallserial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 0,
    "remark" character varying(200),
    "category_sub_name" character varying(50),
    "category_id" smallint NOT NULL,
    PRIMARY KEY ("id")
);
create trigger category_sub_info_upt before update on category_sub_info for each row execute procedure update_timestamp_func();
select setval('category_sub_info_id_seq',1000,false);

--CREATE TABLE user_type_menu
CREATE TABLE IF NOT EXISTS public.user_type_menu
(
    id smallserial NOT NULL,
    created_on timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_on timestamp with time zone NOT NULL DEFAULT NOW(),
    status smallint NOT NULL DEFAULT 1,
    type_name character varying(50) NOT NULL,
    menu_list jsonb NOT NULL DEFAULT '{}',
    remarks character varying(400),
    PRIMARY KEY (id)
);
COMMENT ON COLUMN public.user_type_menu.status IS '状态';
COMMENT ON COLUMN public.user_type_menu.type_name IS '类型名称';
COMMENT ON COLUMN public.user_type_menu.menu_list IS '菜单列表';

create trigger user_type_menu_upt before update on user_type_menu for each row execute procedure update_timestamp_func();
select setval(' user_type_menu_id_seq',1000,false);


--CREATE TABLE product_info
CREATE TABLE IF NOT EXISTS public.product_info (
    "id" smallserial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 0,
    "remark" character varying(200),
    "product_name" character varying(50),
    "product_s_name" character varying(30),
    "product_serial" character varying(30),
    "product_address" character varying(30),
    "category_id" smallint NOT NULL DEFAULT 0,
    "category_sub_id" smallint,
    "brand_id" smallint NOT NULL DEFAULT 0,
    "brand_model_id" smallint  ,
    "image" character varying(200),
    "standard_type" smallint,
    "barcode" character varying(30),
    "unit_name" character varying(10),
    "price" decimal(10,2),

    PRIMARY KEY ("id")
);
COMMENT ON COLUMN public.product_info.product_name IS '商品名称';
COMMENT ON COLUMN public.product_info.product_s_name IS '商品别名';
COMMENT ON COLUMN public.product_info.product_serial IS '商品序列号';
COMMENT ON COLUMN public.product_info.product_address IS '产地';
COMMENT ON COLUMN public.product_info.standard_type IS '标准类型';
COMMENT ON COLUMN public.product_info.unit_name IS '单位';
COMMENT ON COLUMN public.product_info.price IS '价格';

create trigger product_info_upt before update on product_info for each row execute procedure update_timestamp_func();
select setval(' product_info_id_seq',1000,false);

--CREATE TABLE app_info
CREATE TABLE IF NOT EXISTS public.app_info
(
    id smallserial NOT NULL,
    created_on timestamp with time zone NOT NULL NOW(),
    updated_on timestamp with time zone NOT NULL NOW(),
    status smallint NOT NULL,
    app_type smallint NOT NULL,
    device_type smallint NOT NULL,
    version character varying(20) NOT NULL,
    version_num smallint NOT NULL,
    min_version_num smallint NOT NULL,
    force_update smallint NOT NULL,
    url character varying(200) NOT NULL,
    remarks character varying(400),
    PRIMARY KEY (id)
);

COMMENT ON COLUMN public.app_info.status IS '状态(0:停用,1:启用)';
COMMENT ON COLUMN public.app_info.app_type IS 'app类型';
COMMENT ON COLUMN public.app_info.device_type IS '设备类型(1-安卓 2-苹果)';
COMMENT ON COLUMN public.app_info.version IS '版本号';
COMMENT ON COLUMN public.app_info.version_num IS '版本序号';
COMMENT ON COLUMN public.app_info.min_version_num IS '最小支持版本';
COMMENT ON COLUMN public.app_info.force_update IS '是否强制更新(0-不更新 1-更新)';
COMMENT ON COLUMN public.app_info.url IS '下载地址';
COMMENT ON COLUMN public.app_info.remarks IS '备注';

create trigger app_info_upt before update on app_info for each row execute procedure update_timestamp_func();

--CREATE TABLE date_base
CREATE TABLE IF NOT EXISTS public.date_base
(
    id integer NOT NULL,
    day integer NOT NULL,
    week integer NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    y_month integer NOT NULL,
    y_week integer NOT NULL,
    PRIMARY KEY (id)
);
SELECT cron.schedule('add_date_sdl', '0 16 * * *', $$insert into date_base (id,day,week,month,year,y_month,y_week) values
( CAST (to_char(current_timestamp, 'YYYYMMDD') AS NUMERIC)  ,
CAST(ltrim(to_char(current_timestamp, 'DD'),'0') AS NUMERIC) ,
CAST(ltrim(to_char(current_timestamp, 'WW'),'0')  AS NUMERIC) ,
CAST(ltrim(to_char(current_timestamp, 'MM'),'0') AS NUMERIC) ,
CAST(to_char(current_timestamp, 'YYYY') AS NUMERIC),
CAST(to_char(current_timestamp, 'YYYYMM') AS NUMERIC) ,
CAST(to_char(current_timestamp, 'YYYYWW') AS NUMERIC));$$);

--CREATE TABLE purchase_info
CREATE TABLE IF NOT EXISTS public.purchase_info
(
    "id" bigserial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 1,
    "remark" character varying(200),
    "supplier_id" smallint NOT NULL DEFAULT 0,
    "supplier_name" character varying(50),
    "plan_date_id" integer ,
    "finish_date_id" integer ,
    "storage_status" smallint NOT NULL DEFAULT 1,
    "payment_status" smallint NOT NULL DEFAULT 1,
    "payment_date_id" integer,
    "transfer_cost_type" smallint NOT NULL DEFAULT 1,
    "transfer_cost" decimal(8,2)  NOT NULL DEFAULT 0,
    "product_cost" decimal(8,2)  NOT NULL DEFAULT 0,
    "total_cost" decimal(8,2)  NOT NULL DEFAULT 0,
    "order_id" bigint ,
    PRIMARY KEY (id)
);

COMMENT ON COLUMN public.purchase_info.plan_date_id IS '创建日期';
COMMENT ON COLUMN public.purchase_info.finish_date_id IS '完成日期';
COMMENT ON COLUMN public.purchase_info.storage_status IS '仓储状态';
COMMENT ON COLUMN public.purchase_info.payment_status IS '付款状态';
COMMENT ON COLUMN public.purchase_info.payment_date_id IS '付款日期';
COMMENT ON COLUMN public.purchase_info.transfer_cost_type IS '运费类型1:对方支付2:我方支付';
COMMENT ON COLUMN public.purchase_info.transfer_cost IS '运费';
COMMENT ON COLUMN public.purchase_info.product_cost IS '商品成本';
COMMENT ON COLUMN public.purchase_info.total_cost IS '总成本';

create trigger purchase_info_upt before update on purchase_info for each row execute procedure update_timestamp_func();

SELECT cron.schedule('purchase_id_sdl', '0 16 * * *', $$select setval(' purchase_info_id_seq',(CAST(to_char(current_timestamp, 'YYYYMMDD0001') AS BIGINT)),false);$$);


--CREATE TABLE purchase_item
CREATE TABLE IF NOT EXISTS public.purchase_item
(
    "id" serial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "storage_status" smallint NOT NULL DEFAULT 1,
    "payment_status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 1,
    "remark" character varying(200),
    "supplier_id" smallint NOT NULL DEFAULT 0,
    "purchase_id" bigint NOT NULL DEFAULT 0,
    "product_id" smallint NOT NULL DEFAULT 0,
    "product_name" character varying(40),
    "unit_cost" decimal(8,2)  NOT NULL DEFAULT 0,
    "purchase_count" smallint  NOT NULL DEFAULT 0,
    "total_cost" decimal(8,2)  NOT NULL DEFAULT 0,
    "order_id" bigint ,
    PRIMARY KEY (id)
);

COMMENT ON COLUMN public.purchase_item.purchase_id IS '采购单ID';
COMMENT ON COLUMN public.purchase_item.product_id IS '商品ID';
COMMENT ON COLUMN public.purchase_item.unit_cost IS '商品单价';
COMMENT ON COLUMN public.purchase_item.purchase_count IS '采购数量';
COMMENT ON COLUMN public.purchase_item.total_cost IS '总成本';
create trigger purchase_item_upt before update on purchase_item for each row execute procedure update_timestamp_func();
select setval(' purchase_item_id_seq',10000,false);

--CREATE TABLE purchase_refund
CREATE TABLE IF NOT EXISTS public.purchase_refund
(
    "id" serial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 1,
    "remark" character varying(200),
    "supplier_id" smallint NOT NULL DEFAULT 0,
    "purchase_id" bigint NOT NULL DEFAULT 0,
    "purchase_item_id" int NOT NULL DEFAULT 0,
    "product_id" smallint NOT NULL DEFAULT 0,
    "product_name" character varying(40),
    "storage_type" smallint NOT NULL DEFAULT 0,
    "storage_rel_id" bigint,
    "date_id" integer,
    "payment_status" smallint NOT NULL DEFAULT 1,
    "refund_unit_cost" decimal(8,2)  NOT NULL DEFAULT 0,
    "refund_count" smallint  NOT NULL DEFAULT 0,
    "transfer_cost_type" smallint NOT NULL DEFAULT 1,
    "transfer_cost" decimal(8,2)  NOT NULL DEFAULT 0,
    "total_cost" decimal(8,2)  NOT NULL DEFAULT 0,
    "refund_profile" decimal(8,2)  NOT NULL DEFAULT 0,
    "order_id" bigint ,
    PRIMARY KEY (id)
);
COMMENT ON COLUMN public.purchase_refund.purchase_id IS '采购单ID';
COMMENT ON COLUMN public.purchase_refund.purchase_item_id IS '采购条目ID';
COMMENT ON COLUMN public.purchase_refund.product_id IS '商品ID';
COMMENT ON COLUMN public.purchase_refund.storage_type IS '需要出库0不出库,1出库';
COMMENT ON COLUMN public.purchase_refund.storage_rel_id IS '出库操作ID';
COMMENT ON COLUMN public.purchase_refund.date_id IS '完成日期';
COMMENT ON COLUMN public.purchase_refund.payment_status IS '退款完成';
COMMENT ON COLUMN public.purchase_refund.refund_unit_cost IS '退货单价';
COMMENT ON COLUMN public.purchase_refund.transfer_cost IS '退货运费';
COMMENT ON COLUMN public.purchase_refund.refund_profile IS '退货盈亏';

create trigger purchase_refund_upt before update on purchase_refund for each row execute procedure update_timestamp_func();
select setval(' purchase_refund_id_seq',10000,false);

--CREATE TABLE storage_product_rel
CREATE TABLE IF NOT EXISTS public.storage_product_rel
(
    "id" serial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 1,
    "remark" character varying(200),
    "storage_id" smallint NOT NULL DEFAULT 0,
    "storage_area_id" smallint NOT NULL DEFAULT 0,
    "supplier_id" smallint ,
    "product_id" smallint NOT NULL DEFAULT 0,
    "product_name" character varying(50),
    "purchase_id" bigint,
    "purchase_item_id" integer,
    "unit_cost" decimal(8,2)  NOT NULL DEFAULT 0,
    "storage_count" smallint NOT NULL DEFAULT 0,
    "date_id" integer ,
    "order_id" bigint ,
    PRIMARY KEY (id)
);

COMMENT ON COLUMN public.storage_product_rel.unit_cost IS '入库单价';
COMMENT ON COLUMN public.storage_product_rel.storage_count IS '库存量';
COMMENT ON COLUMN public.storage_product_rel.date_id IS '入库日期';

create trigger storage_product_rel_upt before update on storage_product_rel for each row execute procedure update_timestamp_func();
select setval(' storage_product_rel_id_seq',10000,false);

--CREATE TABLE storage_product_rel_detail
CREATE TABLE IF NOT EXISTS public.storage_product_rel_detail
(
    "id" serial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 1,
    "remark" character varying(200),
    "storage_id" smallint NOT NULL DEFAULT 0,
    "storage_area_id" smallint NOT NULL DEFAULT 0,
    "storage_product_rel_id" smallint NOT NULL DEFAULT 0,
    "supplier_id" smallint ,
    "product_id" smallint NOT NULL DEFAULT 0,
    "purchase_id" bigint,
    "purchase_item_id" integer,
    "storage_type" smallint NOT NULL DEFAULT 0,
    "storage_sub_type" smallint NOT NULL DEFAULT 0,
    "storage_count" smallint NOT NULL DEFAULT 0,
    "date_id" integer ,
    "re_user_id" smallint ,
    "order_id" bigint ,
    PRIMARY KEY (id)
);

COMMENT ON COLUMN public.storage_product_rel_detail.storage_type IS '入库=1出库=2';
COMMENT ON COLUMN public.storage_product_rel_detail.storage_sub_type IS '出入库原因';
COMMENT ON COLUMN public.storage_product_rel_detail.storage_count IS '出入库量';
COMMENT ON COLUMN public.storage_product_rel_detail.date_id IS '出入库日期';

create trigger storage_product_rel_detail_upt before update on storage_product_rel_detail for each row execute procedure update_timestamp_func();

SELECT cron.schedule('storage_product_rel_detail_id_sdl', '0 16 * * *', $$select setval(' storage_product_rel_detail_id_seq',(CAST(to_char(current_timestamp, 'YYYYMMDD0001') AS BIGINT)),false);$$);

--CREATE TABLE client_agent
CREATE TABLE IF NOT EXISTS public.client_agent
(
    "id" smallserial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 1,
    "remark" character varying(200),
    "name" character varying(200) NOT NULL,
    "client_type" smallint NOT NULL DEFAULT 0,
    "tel" character varying(20),
    "address" character varying(50),
    "id_serial" character varying(20),
    "date_id" integer ,
    "sales_user_id" smallint,
    "source_type" smallint NOT NULL DEFAULT 0,

    PRIMARY KEY (id)
);

COMMENT ON COLUMN public.client_agent.client_type IS '客户类型';
COMMENT ON COLUMN public.client_agent.id_serial IS '身份证号';
COMMENT ON COLUMN public.client_agent.date_id IS '创建日期';
COMMENT ON COLUMN public.client_agent.sales_user_id IS '销售人员编号';
COMMENT ON COLUMN public.client_agent.source_type IS '客户来源';

create trigger client_agent_upt before update on client_agent for each row execute procedure update_timestamp_func();
select setval(' client_agent_id_seq',10000,false);

--CREATE TABLE client_agent_invoice
CREATE TABLE IF NOT EXISTS public.client_agent_invoice(
    "id" smallserial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 1,
    "remark" character varying(200),
    "client_agent_id" smallint NOT NULL DEFAULT 1 ,
    "invoice_type" smallint,
    "invoice_title" character varying(50),
    "invoice_bank" character varying(50),
    "invoice_bank_ser" character varying(20),
    "invoice_address" character varying(50),
    "settle_type" smallint NOT NULL DEFAULT 0,
     PRIMARY KEY (id)
);
create trigger client_agent_invoice_upt before update on client_agent_invoice for each row execute procedure update_timestamp_func();
select setval(' client_agent_invoice_id_seq',10000,false);

--CREATE TABLE sale_service_info

CREATE TABLE IF NOT EXISTS public.sale_service_info(
    "id" smallserial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1,
    "op_user" smallint NOT NULL DEFAULT 1,
    "remark" character varying(200),
    "service_name" character varying(200),
    "service_type" smallint NOT NULL DEFAULT 1 ,
    "service_price_type" smallint NOT NULL DEFAULT 1 ,
    "fixed_price" decimal(10,2) NOT NULL DEFAULT 0,
    "unit_price" decimal(10,2) NOT NULL DEFAULT 0,
    "service_price_count" decimal(10,2) NOT NULL DEFAULT 0,
    "service_cost_type" smallint NOT NULL DEFAULT 1 ,
    "fixed_cost" decimal(10,2) NOT NULL DEFAULT 0,
    "unit_cost" decimal(10,2) NOT NULL DEFAULT 0,
    "service_cost_count" decimal(10,2) NOT NULL DEFAULT 0,
    "total_price" decimal(10,2)NOT NULL DEFAULT 0,
    "total_cost" decimal(10,2)NOT NULL DEFAULT 0,
    "total_profit" decimal(10,2)NOT NULL DEFAULT 0,
    "sale_perf_type" smallint NOT NULL DEFAULT 1 ,
    "sale_perf_fixed" decimal(10,2) NOT NULL DEFAULT 0,
    "sale_perf_ratio" decimal(10,2) NOT NULL DEFAULT 0,
    "deploy_perf_type" smallint NOT NULL DEFAULT 1 ,
    "deploy_perf_fixed" decimal(10,2) NOT NULL DEFAULT 0,
    "deploy_perf_ratio" decimal(10,2) NOT NULL DEFAULT 0,
    "check_perf_type" smallint NOT NULL DEFAULT 1 ,
    "check_perf_fixed" decimal(10,2) NOT NULL DEFAULT 0,
    "check_perf_ratio" decimal(10,2) NOT NULL DEFAULT 0,
     PRIMARY KEY (id)
);

COMMENT ON COLUMN public.sale_service_info.service_type IS '服务类型';
COMMENT ON COLUMN public.sale_service_info.service_price_type IS '服务价格类型1:固定2:单价数量';
COMMENT ON COLUMN public.sale_service_info.fixed_price IS '固定售价';
COMMENT ON COLUMN public.sale_service_info.unit_price IS '销售单价';
COMMENT ON COLUMN public.sale_service_info.service_price_count IS '销售数量';
COMMENT ON COLUMN public.sale_service_info.service_cost_type IS '服务成本类型1:固定2:单价数量';
COMMENT ON COLUMN public.sale_service_info.fixed_cost IS '固定成本';
COMMENT ON COLUMN public.sale_service_info.unit_cost IS '成本单价';
COMMENT ON COLUMN public.sale_service_info.service_cost_count IS '成本数量';
COMMENT ON COLUMN public.sale_service_info.total_price IS '销售额';
COMMENT ON COLUMN public.sale_service_info.total_cost IS '总承包';
COMMENT ON COLUMN public.sale_service_info.total_profit IS '毛利率';
COMMENT ON COLUMN public.sale_service_info.sale_perf_type IS '销售提成类型1:无提成2:固定提成3:营业额提成4:毛利提成';
COMMENT ON COLUMN public.sale_service_info.sale_perf_fixed IS '固定提成金额';
COMMENT ON COLUMN public.sale_service_info.sale_perf_ratio IS '提成比例';
COMMENT ON COLUMN public.sale_service_info.deploy_perf_type IS '施工提成类型';
COMMENT ON COLUMN public.sale_service_info.check_perf_type IS '验收提成类型';
create trigger sale_service_info_upt before update on sale_service_info for each row execute procedure update_timestamp_func();
select setval(' sale_service_info_id_seq',10000,false);

--CREATE TABLE sale_service_prod_rel
CREATE TABLE IF NOT EXISTS public.sale_service_prod_rel(
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "op_user" smallint NOT NULL DEFAULT 1,
    "sale_service_id" smallint NOT NULL,
    "service_name" character varying(200),
    "product_id" smallint NOT NULL,
    "product_name" character varying(200),
    "product_count" smallint NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX uk_sale_service_prod_rel ON sale_service_prod_rel(sale_service_id,product_id);

--CREATE TABLE storage_check
CREATE TABLE IF NOT EXISTS public.storage_check(
    "id" smallserial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1 ,
    "check_status" smallint NOT NULL DEFAULT 0 ,
    "op_user" smallint NOT NULL DEFAULT 1,
    "remark" character varying(200),
    "date_id" integer NOT NULL,
    "plan_check_count" smallint  NOT NULL DEFAULT 0,
    "checked_count" smallint  NOT NULL DEFAULT 0,
    "check_desc" character varying(200),
    PRIMARY KEY (id)
);
COMMENT ON COLUMN public.storage_check.status IS '1:未完成2:已完成';
COMMENT ON COLUMN public.storage_check.check_status IS '盘点结果1:正常2:异常';
COMMENT ON COLUMN public.storage_check.date_id IS '盘点完成日期';
COMMENT ON COLUMN public.storage_check.plan_check_count IS '计划盘点数量';
COMMENT ON COLUMN public.storage_check.checked_count IS '已盘点数量';
COMMENT ON COLUMN public.storage_check.check_desc IS '盘点描述';

create trigger storage_check_upt before update on storage_check for each row execute procedure update_timestamp_func();
select setval(' storage_check_id_seq',10000,false);

--CREATE TABLE storage_check_rel
CREATE TABLE IF NOT EXISTS public.storage_check_rel(
    "id" smallserial NOT NULL,
    "created_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_on" timestamp with time zone NOT NULL DEFAULT NOW(),
    "status" smallint NOT NULL DEFAULT 1 ,
    "check_status" smallint NOT NULL DEFAULT 0 ,
    "op_user" smallint NOT NULL DEFAULT 1,
    "remark" character varying(200),
    "storage_check_id" smallint NOT NULL,
    "date_id" integer NOT NULL,
    "storage_count" smallint  NOT NULL DEFAULT 0,
    "check_count" smallint  NOT NULL DEFAULT 0,
    "storage_product_rel_id" integer NOT NULL DEFAULT 0,
    "storage_id" smallint  NOT NULL DEFAULT 0,
    "storage_area_id" smallint  NOT NULL DEFAULT 0,
    "product_id" smallint  NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

COMMENT ON COLUMN public.storage_check_rel.check_status IS '库存等于盘库数量1,否则异常2';
COMMENT ON COLUMN public.storage_check_rel.storage_count IS '库存数量';
COMMENT ON COLUMN public.storage_check_rel.check_count IS '盘库数量';
create trigger storage_check_rel_upt before update on storage_check_rel for each row execute procedure update_timestamp_func();
select setval(' storage_check_rel_id_seq',10000,false);