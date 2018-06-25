--!!!! CAUTION do not run this when connected to the production ERGONOMYX DB !!!
-- \i ./devel/nodejs/webservice/create_schema.sql in PGSQL
drop table if exists devices;
drop table if exists followers;
drop table if exists post;
drop table if exists scheduler;
create table devices (
  device_name varchar(255),
  user_id integer,
  device_id varchar(255),
  device_type varchar(255)
);
create table followers (
  follower_id integer
);
create table post (
  id integer,
  body varchar(40),
  timestamp timestamp,
  user_id integer
);
create table scheduler (
  id integer,
  sched_name varchar(20),
  sched_start varchar(20),
  sched_end varchar(20),
  sched_date timestamp,
  sched_start_ind integer,
  sched_end_ind integer,
  user_id integer,
  preset_1 integer,
  preset_2 integer,
  preset_3 integer,
  device_id varchar(255)
);
--Test data
insert into devices values( 'Smart Desk', 2451, 'OrangeDesk1123', 'Desk');
insert into devices values( 'Smart Chair', 1124, 'BlueChair3451', 'Chair');
insert into followers values( 1 );
insert into followers values( 83 );
insert into followers values( 24 );
insert into post values( 12, 'This is a message from the post table', '20180126', 83 );
insert into scheduler values( 83, 'Karli', '1200', '1300', '20180126', 12, 13, 83, 88, 22, 19, 'OrangeDesk1123');
insert into scheduler values( 24, 'Mikel', '1130', '1150', '20180126', 15, 14, 7, 88, 22, 19, 'BlueChair3451');
