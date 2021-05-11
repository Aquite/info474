create table if not exists Users (
    ID int not null auto_increment primary key,
    Email varchar(255) not null UNIQUE,
    PassHash varbinary(1024) not null,
    UserName varchar(255) not null UNIQUE,
    FirstName varchar(128) not null,
    LastName varchar(128) not null,
    PhotoURL varchar(128) not null
);

create table if not exists SignIns (
    signInID int not null auto_increment primary key,
    userID int not null,
    signInTime datetime not null,
    clientIP varchar(15) not null
);