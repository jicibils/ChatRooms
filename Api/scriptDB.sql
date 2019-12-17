CREATE TABLE public.messages
(
    id serial NOT NULL DEFAULT,
    room_id integer,
    sender_id integer,
    created timestamp with time zone,
    message text ,
    sender_name text ,
    CONSTRAINT messages_pkey PRIMARY KEY (id)
)


CREATE TABLE public.rooms
(
    id serial NOT NULL DEFAULT,
    name text ,
    creator_name text ,
    creator_id text ,
    created timestamp(4) with time zone,
    participants integer[],
    CONSTRAINT rooms_pkey PRIMARY KEY (id)
)

CREATE TABLE public.users
(
    id serial NOT NULL DEFAULT,
    email text ,
    nickname text ,
    password text ,
    created date,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)