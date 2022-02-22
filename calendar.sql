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
