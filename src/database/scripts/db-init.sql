create extension if not exists "uuid-ossp";
create type status_type as enum('OPEN', 'ORDERED');

create table if not exists carts(
	id uuid primary key default uuid_generate_v4(),
	user_id uuid not null,
    created_at date not null default CURRENT_DATE,
    updated_at date not null default CURRENT_DATE,
    status status_type
    foreign key(user_id) references users(id)
);

create table if not exists products(
	id uuid primary key default uuid_generate_v4(),
	title text not null,
    description text not null,
    price DECIMAL(8, 2) not null
);

create table if not exists cart_items(
	cart_id uuid not null,
	product_id uuid not null,
    count integer,
    foreign key(cart_id) references carts(id) on delete cascade,
    foreign key(product_id) references products(id)
);

create table if not exists users(
	id uuid primary key default uuid_generate_v4(),
	name text not null,
    password text not null
);

create table if not exists orders(
	id uuid primary key default uuid_generate_v4(),
	cart_id uuid not null,
	user_id uuid not null,
	payment Json not null,
  	delivery Json not null,
  	comments text,
  	status status_type,
    total DECIMAL(8, 2) not null,
    foreign key(cart_id) references carts(id),
    foreign key(user_id) references users(id)
);

insert into
	users
values
	('934a6f3d-63be-4316-893f-b6c4af01190a','olena', 'test1'),
	('f2b44b2f-faa2-48fc-884e-3213477336cb','test', 'test');

insert into
	carts(user_id, status)
values
	('934a6f3d-63be-4316-893f-b6c4af01190a','OPEN'),
	('f2b44b2f-faa2-48fc-884e-3213477336cb','ORDERED');

insert into
	products
values
	('82edaf2e-4535-415f-b6b8-ad9172ad3c17','Elemental', 'In a city where fire, water, land and air residents live together, a fiery young woman and a go-with-the-flow guy will discover something elemental: how much they have in common.',27.99),
	('4a3690ea-0d2c-4800-9a80-13d111cee9e5','Carls Date','Carl Fredricksen reluctantly agrees to go on a date with a lady friend—but admittedly has no idea how dating works these days.',9.99),
	('7567ec4b-b10c-48c5-9345-fc73c41a80a3','The Super Mario Bros','While working underground to fix a water main, Brooklyn plumbers—and brothers—Mario and Luigi are transported down a mysterious pipe and wander into a magical new world.',14.5);

insert into
	cart_items
values
	('8e9a14cc-fb5a-474d-a3ad-d8dde00ecabc','82edaf2e-4535-415f-b6b8-ad9172ad3c17',10),
	('8e9a14cc-fb5a-474d-a3ad-d8dde00ecabc','4a3690ea-0d2c-4800-9a80-13d111cee9e5',2),
	('ad440429-e6a7-4ecc-a372-a735ac7ef7dc','7567ec4b-b10c-48c5-9345-fc73c41a80a3',5);

insert into
	orders(cart_id, user_id, payment, delivery, comments, status, total)
values
	('8e9a14cc-fb5a-474d-a3ad-d8dde00ecabc', '934a6f3d-63be-4316-893f-b6c4af01190a', '{ "type": "applePay", "address": "test", "creditCard": "test" }', '{ "type": "delivery", "address": "test" }', 'test', 'OPEN', 200.5);
