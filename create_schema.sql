drop table if exists devices
drop table if exists followers
drop table if exists post
drop table if exists scheduler
drop table if exists test_table
drop table if exists user
drop table if exists users

create table devices (
  device_name varchar(255),
  user_id integer,
  device_id varchar(255) primary key,
  device_type varchar(255)
  --REGEX example
	--check( student_id ~ 'V00\d\d\d\d\d\d' )
);
create table followers (
  follower_id integer
);
