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


CREATE TABLE IF NOT EXISTS public.user_info
(
    id bigserial NOT NULL,
    created_on timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_on timestamp with time zone NOT NULL DEFAULT NOW(),
    status smallint NOT NULL,
    user_name character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    phone character varying(50) NOT NULL,
    gender smallint,
    type integer NOT NULL,
    PRIMARY KEY (id)
);
COMMENT ON COLUMN public.user_info.status IS '状态（0-停用，1-可用）';
COMMENT ON COLUMN public.user_info.user_name IS '用户名称';
COMMENT ON COLUMN public.user_info.password IS '密码';
COMMENT ON COLUMN public.user_info.phone IS '联系方式';
COMMENT ON COLUMN public.user_info.gender IS '性别（0-女，1-男）';
COMMENT ON COLUMN public.user_info.type IS '用户类型（99-超级管理员）';
-- UPDATE TIMESTAMP TRIGGER
create trigger user_info_upt before update on user_info for each row execute procedure update_timestamp_func();



CREATE TABLE IF NOT EXISTS public.user_menu_list
(
    id bigserial NOT NULL,
    created_on timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_on timestamp with time zone NOT NULL DEFAULT NOW(),
    type integer NOT NULL,
    menu_list jsonb NOT NULL,
    PRIMARY KEY (id)
);
COMMENT ON COLUMN public.user_menu_list.type IS '用户类型（99-超级管理员）';
COMMENT ON COLUMN public.user_menu_list.menu_list IS '菜单列表';
-- UPDATE TIMESTAMP TRIGGER
create trigger user_menu_list_upt before update on user_menu_list for each row execute procedure update_timestamp_func();