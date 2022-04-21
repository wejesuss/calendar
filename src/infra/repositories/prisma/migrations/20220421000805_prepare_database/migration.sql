-- CreateTable
CREATE TABLE "time_interval" (
    "id" SERIAL NOT NULL,
    "week" SMALLINT NOT NULL,
    "time_from" TIME,
    "time_to" TIME,

    CONSTRAINT "time_interval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "replacement" (
    "id" SERIAL NOT NULL,
    "r_date" DATE,
    "r_time_from" TIME,
    "r_time_to" TIME,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "replacement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" SERIAL NOT NULL,
    "duration" SMALLINT NOT NULL,
    "activation_interval" SMALLINT NOT NULL,
    "activation_interval_type" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" UUID NOT NULL,
    "s_date" DATE NOT NULL,
    "time_from" TIME NOT NULL,
    "time_to" TIME NOT NULL,
    "duration" SMALLINT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT,
    "image_path" TEXT,
    "price" INTEGER NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

CREATE EXTENSION pgcrypto;
