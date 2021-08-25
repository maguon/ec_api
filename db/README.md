### Use postgresql plugin pg_cron

1.Installing pg_cron

```
yum install -y pg_cron_12
```
2.Update postgresql.conf

```
shared_preload_libraries = 'pg_cron'
cron.database_name = 'ec_db'
```
3.Setting pg

```sql
-- run as superuser in ec_db :
CREATE EXTENSION pg_cron;
GRANT USAGE ON SCHEMA cron TO ec_user;
```

4.Use pg_cron

```sql

select * from cron.job;
delete from cron.job where jobid=?;
```

5.Watch

```
log/postgresql connection failed

vi ~/.pgpass
hostname:port:database:username:password
chmod 0600 ~./pgpass

update pg_hba.conf
local   all  all trust

-- run as superuser in ec_db :
update cron.job set nodename='';
```

### Use postgresql plugin zhparser

1.update zhparser configfile

```
diff --git a/zhparser--2.0--2.1.sql b/zhparser--2.0--2.1.sql
index 2946045..95eee5d 100644
--- a/zhparser--2.0--2.1.sql
+++ b/zhparser--2.0--2.1.sql
@@ -12,8 +12,8 @@ begin
 	select setting from pg_settings where name='data_directory' into data_dir;
 	select oid from pg_database where datname=current_database() into database_oid;
 
-	select data_dir || '/base/' || database_oid || '/zhprs_dict_' || current_database() || '.txt' into dict_path;
-	select data_dir || '/base/' || database_oid || '/zhprs_dict_' || current_database() || '.tag' into time_tag_path;
+	select data_dir || '/base/' || '/zhprs_dict_' || current_database() || '.txt' into dict_path;
+	select data_dir || '/base/' || '/zhprs_dict_' || current_database() || '.tag' into time_tag_path;
 
 	query = 'copy (select word, tf, idf, attr from zhparser.zhprs_custom_word) to ' || chr(39) || dict_path || chr(39) || ' encoding ' || chr(39) || 'utf8' || chr(39) ;
 	execute query;
diff --git a/zhparser--2.1.sql b/zhparser--2.1.sql
index 29e57bd..21e7b61 100644
--- a/zhparser--2.1.sql
+++ b/zhparser--2.1.sql
@@ -43,8 +43,8 @@ begin
 	select oid from pg_database where datname=current_database() into database_oid;
 
 
-	select data_dir || '/base/' || database_oid || '/zhprs_dict_' || current_database() || '.txt' into dict_path;
-	select data_dir || '/base/' || database_oid || '/zhprs_dict_' || current_database() || '.tag' into time_tag_path;
+	select data_dir || '/base/' || '/zhprs_dict_' || current_database() || '.txt' into dict_path;
+	select data_dir || '/base/' || '/zhprs_dict_' || current_database() || '.tag' into time_tag_path;
 
 	query = 'copy (select word, tf, idf, attr from zhparser.zhprs_custom_word) to ' || chr(39) || dict_path || chr(39) || ' encoding ' || chr(39) || 'utf8' || chr(39) ;
 	execute query;
diff --git a/zhparser.c b/zhparser.c
index f23bb07..00d6e48 100644
--- a/zhparser.c
+++ b/zhparser.c
@@ -207,8 +207,8 @@ static void init(){
 			 )));
 	}
 
-	snprintf(dict_path, MAXPGPATH, "%s/base/%u/zhprs_dict_%s.txt",
-			DataDir, MyDatabaseId, get_database_name(MyDatabaseId));
+	snprintf(dict_path, MAXPGPATH, "%s/base/zhprs_dict_%s.txt",
+			DataDir, get_database_name(MyDatabaseId));
 	if(scws_add_dict(scws, dict_path, load_dict_mem_mode | SCWS_XDICT_TXT) != 0 ){
 		ereport(NOTICE,
 			    (errcode(ERRCODE_INTERNAL_ERROR),

```