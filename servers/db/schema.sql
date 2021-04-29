create table if not exists users (
    ID int not null auto_increment primary key,
    Email varchar(128) not null,
    UserName varchar(64) not null,
    PassHash varbinary(1024) not null,
    FirstName varchar(128) not null,
    LastName varchar(64) not null,
    PhotoURL varchar(128) not null
);