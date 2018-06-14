drop table if exists devices;
drop table if exists followers;
drop table if exists post;
drop table if exists scheduler;
drop table if exists "user";
drop table if exists users;
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
create table "user" (
  id integer,
  username varchar(64),
  email varchar(120),
  password_hash varchar(128),
  about_me varchar(140),
  last_seen timestamp,
  height integer,
  weight integer,
  dob date
);
create table users (
  id integer,
  email varchar(20),
  password varchar(255),
  height integer,
  weight integer,
  dob date,
  username varchar(255),
  sched_name varchar(255),
  sched_start varchar(255),
  sched_end varchar(255),
  sched_date date,
  sched_start_ind integer,
  sched_end_ind integer
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
insert into "user" values(83, 'Karli', 'karli@gmail.com', 'passwordhash123', 'Im a sedentary desk worker', '2016-06-22 19:10:25-07', 183, 200, '19830127');
insert into "user" values(24, 'Mikel', 'mikel@gmail.com', 'passwordhash444', 'Im an active desk worker', '2016-06-21 19:30:25-07', 154, 175, '19830126');
insert into users values(83, 'karli@gmail.com', 'passwordhash123', 183, 200, '19830127', 'Karli','Karli', '1200', '1230', '2016-06-22', 55);
insert into users values(24, 'mikel@gmail.com', 'passwordhash444', 154, 175, '19830126','Mikel','Mikel','1100', '1120', '2016-06-22', 66);
