-- DDL Script to create authentication & payment tables in ccmfalla schema

-- 1. Table: ccmfalla.rolusuario
CREATE TABLE IF NOT EXISTS ccmfalla.rolusuario (
    idrolusuario integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    descripcion character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT pk_rolusuario PRIMARY KEY (idrolusuario)
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS ccmfalla.rolusuario OWNER to postgres;

-- Insert traveler role by default (ID 3 = Viajero)
INSERT INTO ccmfalla.rolusuario (idrolusuario, descripcion) 
OVERRIDING SYSTEM VALUE
VALUES (3, 'Viajero') 
ON CONFLICT (idrolusuario) DO NOTHING;

-- 2. Table: ccmfalla.usuario
CREATE TABLE IF NOT EXISTS ccmfalla.usuario
(
    idusuario integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    numerodocumentoidentidad character varying(50) COLLATE pg_catalog."default",
    nombre character varying(50) COLLATE pg_catalog."default",
    apellido character varying(50) COLLATE pg_catalog."default",
    correo character varying(50) COLLATE pg_catalog."default",
    clave character varying(50) COLLATE pg_catalog."default",
    idrolusuario integer,
    fechacreacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    movil character varying(50) COLLATE pg_catalog."default",
    telegram_id character varying(50) COLLATE pg_catalog."default",
    telegram_username character varying(100) COLLATE pg_catalog."default",
    codigo_verificacion character varying(6) COLLATE pg_catalog."default",
    fecha_expiracion_codigo timestamp without time zone,
    intentos_verificacion integer DEFAULT 0,
    telegram_verificado boolean DEFAULT false,
    resume_url character varying(500) COLLATE pg_catalog."default",
    estado_verificacion character varying(50) COLLATE pg_catalog."default" DEFAULT 'ninguno'::character varying,
    CONSTRAINT pk_usuario PRIMARY KEY (idusuario),
    CONSTRAINT uq_usuario_correo UNIQUE (correo),
    CONSTRAINT uq_usuario_telegram_id UNIQUE (telegram_id),
    CONSTRAINT fk_usuario_idrolusuario FOREIGN KEY (idrolusuario)
        REFERENCES ccmfalla.rolusuario (idrolusuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS ccmfalla.usuario OWNER to postgres;

CREATE INDEX IF NOT EXISTS idx_usuario_movil
    ON ccmfalla.usuario USING btree
    (numerodocumentoidentidad COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE UNIQUE INDEX IF NOT EXISTS idx_usuario_telegram_id_unique
    ON ccmfalla.usuario USING btree
    (telegram_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default
    WHERE telegram_id IS NOT NULL;

-- 3. Table: ccmfalla.pagosusuarios
CREATE TABLE IF NOT EXISTS ccmfalla.pagosusuarios (
    idpago integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    codigo_viaje character varying(50) COLLATE pg_catalog."default",
    fecha_salida date,
    idusuario integer,
    descripcion_viaje character varying(500) COLLATE pg_catalog."default",
    cantidad_abonada double precision,
    procesado character varying(1) COLLATE pg_catalog."default" DEFAULT 'N'::character varying,
    fecha_pago timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    stripe_session_id character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT pk_pagosusuarios PRIMARY KEY (idpago),
    CONSTRAINT fk_pagosusuarios_usuario FOREIGN KEY (idusuario)
        REFERENCES ccmfalla.usuario (idusuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS ccmfalla.pagosusuarios OWNER to postgres;
