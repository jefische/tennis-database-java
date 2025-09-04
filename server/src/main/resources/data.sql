-- drop table if exists video;
-- drop table if exists message;
-- create table video (
--     videoId int primary key auto_increment,
--     url varchar(255) not null unique,
-- );
-- create table message (
--     messageId int primary key auto_increment,
--     postedBy int,
--     messageText varchar(255),
--     timePostedEpoch bigint,
--     foreign key (postedBy) references video(videoId)
-- );

-- Starting test values with ids of 9999 to avoid test issues
insert into video (videoId, url) values (9999, 'testurl-1');
insert into video (videoId, url) values (9998, 'testurl-2');
insert into video (videoId, url) values (9997, 'testurl-3');
insert into video (videoId, url) values (9996, 'testurl-4');

-- insert into message (messageId, postedBy, messageText, timePostedEpoch) values (9999, 9999, 'test message 1', 1669947792);
-- insert into message (messageId, postedBy, messageText, timePostedEpoch) values (9997, 9997, 'test message 2', 1669947792);
-- insert into message (messageId, postedBy, messageText, timePostedEpoch) values (9996, 9996, 'test message 3', 1669947792);