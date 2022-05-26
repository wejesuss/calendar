CREATE TYPE time_interval AS (
    time_from   time,
    time_to     time
);

CREATE TYPE replacement AS (
    r_date        date,
    r_time_from   time,
    r_time_to     time
);

CREATE TABLE "schedule" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "duration" smallint NOT NULL,
  "activation_interval" smallint NOT NULL,
  "activation_interval_type" smallint NOT NULL,
  "availability_0" time_interval[],
  "availability_1" time_interval[],
  "availability_2" time_interval[],
  "availability_3" time_interval[],
  "availability_4" time_interval[],
  "availability_5" time_interval[],
  "availability_6" time_interval[],
  "replacements" replacement[],
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "session" (
  "id" uuid DEFAULT (gen_random_uuid()),
  "s_date" date,
  "time_from" time,
  "time_to" time,
  "duration" smallint,
  "name" varchar NOT NULL,
  "email" varchar NOT NULL,
  "cpf" varchar NOT NULL,
  "phone" varchar NOT NULL,
  "description" text,
  "image_path" varchar,
  "price" numeric,
  "paid" boolean DEFAULT false,
  "user_id" uuid DEFAULT null,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

COMMENT ON COLUMN "session"."cpf" IS 'encrypted';
COMMENT ON COLUMN "session"."phone" IS 'encrypted';

INSERT INTO schedule (activation_interval, activation_interval_type, duration) VALUES (3, 30, 60);
INSERT INTO time_interval (time_from, time_to, week) VALUES ('09:00', '17:00', 0);
INSERT INTO time_interval (time_from, time_to, week) VALUES ('09:00', '17:00', 1);
INSERT INTO time_interval (time_from, time_to, week) VALUES ('09:00', '17:00', 2);
INSERT INTO time_interval (time_from, time_to, week) VALUES ('09:00', '17:00', 3);
INSERT INTO time_interval (time_from, time_to, week) VALUES ('09:00', '17:00', 4);
INSERT INTO time_interval (time_from, time_to, week) VALUES ('09:00', '17:00', 5);
INSERT INTO time_interval (time_from, time_to, week) VALUES ('09:00', '17:00', 6);
INSERT INTO replacement (r_date, r_time_from, r_time_to) VALUES ('2022/07/30', '17:00', '19:00');
INSERT INTO replacement (r_date, r_time_from, r_time_to) VALUES ('2022/10/30', '17:00', '19:00');
