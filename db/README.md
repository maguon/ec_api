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

