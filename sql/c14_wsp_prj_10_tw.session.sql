CREATE TABLE Users(
    id SERIAL primary key,
    last_name VARCHAR(255) not null,
    first_name VARCHAR(255) not null,
    email VARCHAR(255) not null,
    password VARCHAR(255) not null,
    phone_number INTEGER,
    sex VARCHAR(255),
    age INTEGER,
    occupation VARCHAR(255),
    qualification text,
    experience text,
    is_active boolean not null,
    is_contributor boolean not null,
    image VARCHAR(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
CREATE TABLE Injuries(
    id SERIAL primary key,
    injury_name VARCHAR(255) not null,
    link text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
CREATE TABLE Medlog(
    id SERIAL primary key,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    injury_id INTEGER,
    FOREIGN KEY (injury_id) REFERENCES Injuries(id),
    diagnosis jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
CREATE TABLE Blogs(
    id SERIAL primary key,
    contributor_id INTEGER,
    FOREIGN KEY (contributor_id) REFERENCES Users(id),
    content text not null,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
CREATE TABLE Likes(
    id SERIAL primary key,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    blog_id INTEGER,
    FOREIGN KEY (blog_id) REFERENCES Blogs(id),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

insert into Injuries (injury_name, created_at, updated_at) values ('Patellofemoral Pain Syndrome', now(), now());
insert into Injuries (injury_name, created_at, updated_at) values ('Patellar Tendinopathy', now(), now());
insert into Injuries (injury_name, created_at, updated_at) values ('Patellar Tendon Tear', now(), now());
insert into Injuries (injury_name, created_at, updated_at) values ('ACL torn', now(), now());
insert into Injuries (injury_name, created_at, updated_at) values ('ACL sprain', now(), now());
insert into Injuries (injury_name, created_at, updated_at) values ('Meniscal torn', now(), now());
insert into Injuries (injury_name, created_at, updated_at) values ('Meniscal leison', now(), now());

SELECT * from medlog;

select * from medlog inner join injuries on injury_id = injuries.id inner join users on user_id = users.id where user_id = 2;

update injuries set link = 'patellofemoral-pain-syndrome.html' where injury_name = 'Patellofemoral Pain Syndrome';
update injuries set link = 'patellar-tendinopathy.html' where injury_name = 'Patellar Tendinopathy';
update injuries set link = 'patellar-tendinopathy.html' where injury_name = 'Patellar Tendon Tear';
update injuries set link = 'meniscal-lesions.html' where injury_name = 'Meniscal torn';
update injuries set link = 'meniscal-lesions.html' where injury_name = 'Meniscal leison';
update injuries set link = 'anterior-cruciate-ligament.html' where injury_name = 'ACL torn';
update injuries set link = 'anterior-cruciate-ligament.html' where injury_name = 'ACL sprain';