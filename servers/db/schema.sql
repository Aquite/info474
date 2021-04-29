create table if not exists users (
    ID int not null auto_increment primary key,
    Email varchar(255) not null UNIQUE,
    UserName varchar(255) not null UNIQUE,
    PassHash varbinary(1024) not null,
    FirstName varchar(128) not null,
    LastName varchar(128) not null,
    PhotoURL varchar(128) not null
);