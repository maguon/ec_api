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
    "product_address" character varying(30),
    "category_id" smallint NOT NULL DEFAULT 0,
    "category_sub_id" smallint NOT NULL DEFAULT 0,
    "brand_id" smallint NOT NULL DEFAULT 0,
    "brand_model_id" smallint NOT NULL DEFAULT 0,
    "image" character varying(200),
    "standard_type" smallint,
    "barcode" character varying(30),
    "unit_name" character varying(10),
    "price" decimal(10,2),

    PRIMARY KEY ("id")
);
COMMENT ON COLUMN public.product_info.product_name IS '商品名称';
COMMENT ON COLUMN public.product_info.product_s_name IS '商品别名';
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
    "order_id" bigserial ,
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
