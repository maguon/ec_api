SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS=0;

-- Drop table

-- DROP TABLE public.app_version;

CREATE TABLE public.app_version (
	id bigserial NOT NULL,
	app_type int2 NOT NULL, -- app类型
	device_type int2 NOT NULL, -- 设备类型(1-安卓 2-苹果)
	version_ser varchar(20) NULL, -- 版本号
	version_num int4 NULL, -- 版本序号
	min_version_num int4 NULL, -- 最小支持版本
	force_up_flag int2 NULL, -- 是否强制更新(0-不更新 1-更新)
	url varchar(200) NULL, -- 下载地址
	remarks varchar(200) NULL, -- 备注
	status int2 NOT NULL, -- 状态(0:停用,1:启用)
	created_on timestamptz NOT NULL DEFAULT now(),
	updated_on timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT app_version_pk PRIMARY KEY (id)
);

-- Column comments

COMMENT ON COLUMN public.app_version.app_type IS 'app类型';
COMMENT ON COLUMN public.app_version.device_type IS '设备类型(1-安卓 2-苹果)';
COMMENT ON COLUMN public.app_version.version_ser IS '版本号';
COMMENT ON COLUMN public.app_version.version_num IS '版本序号';
COMMENT ON COLUMN public.app_version.min_version_num IS '最小支持版本';
COMMENT ON COLUMN public.app_version.force_up_flag IS '是否强制更新(0-不更新 1-更新)';
COMMENT ON COLUMN public.app_version.url IS '下载地址';
COMMENT ON COLUMN public.app_version.remarks IS '备注';
COMMENT ON COLUMN public.app_version.status IS '状态(0:停用,1:启用)';

