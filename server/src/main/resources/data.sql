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
-- insert into video (videoId, tournament, year, youtubeId, player1, player2) values 
-- (9999, 'Australian Open', 2025, '9_3APf0X_-8', 'Jannik Sinner', 'Alexander Zverev'),
-- (9998, 'Wimbledon', 2019, 'wZnCcqm_g-E', 'Roger Federer', 'Rafael Nadal'),
-- (9997, 'US Open', 2023, 'qwg_pIJlNtI', 'Ben Shelton', 'Frances Tiafoe'),
-- (9996, 'French Open', 2025, 'ckbX699wngs', 'Carlos Alcaraz', 'Jannik Sinner');


-- Starting test values with ids of 9999 to avoid test issues
INSERT INTO videos (videoId, tournament, video_year, youtubeId, player1, player2, title, round) VALUES 
(1, 'Australian Open', 2025, '9_3APf0X_-8', 'Jannik Sinner', 'Alexander Zverev', 'Jannik Sinner v Alexander Zverev | Australian Open 2025 Final (2hr 36min)', 'Finals'),
(2, 'Wimbledon', 2019, 'wZnCcqm_g-E', 'Roger Federer', 'Rafael Nadal', 'Roger Federer vs Rafael Nadal | Wimbledon 2019 Semifinals (3hr 05min)', 'Semifinals'),
(3, 'US Open', 2023, 'qwg_pIJlNtI', 'Ben Shelton', 'Frances Tiafoe', 'Ben Shelton vs. Frances Tiafoe | 2023 US Open Quarterfinal (2hr 19min)', 'Quarterfinals'),
(4, 'French Open', 2025, 'ckbX699wngs', 'Carlos Alcaraz', 'Jannik Sinner', 'Carlos Alcaraz vs Jannik Sinner | Roland-Garros 2025 Final (5hr 53min)', 'Finals');


-- insert into message (messageId, postedBy, messageText, timePostedEpoch) values (9999, 9999, 'test message 1', 1669947792);
-- insert into message (messageId, postedBy, messageText, timePostedEpoch) values (9997, 9997, 'test message 2', 1669947792);
-- insert into message (messageId, postedBy, messageText, timePostedEpoch) values (9996, 9996, 'test message 3', 1669947792);