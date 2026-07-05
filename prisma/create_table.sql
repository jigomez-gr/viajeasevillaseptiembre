-- Crear el esquema ccmfalla si no existe
CREATE SCHEMA IF NOT EXISTS ccmfalla;

-- Crear la tabla ReservaViajeSevillaSeptiembre dentro del esquema ccmfalla
CREATE TABLE ccmfalla."ReservaViajeSevillaSeptiembre" (
    "id" VARCHAR(36) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(100) NOT NULL,
    "numeroPlazas" INTEGER NOT NULL,
    "tipoHabitacion" VARCHAR(50) NOT NULL,
    "importeTotal" DOUBLE PRECISION NOT NULL,
    "estado" VARCHAR(50) NOT NULL,
    "stripeSessionId" VARCHAR(255),
    "stripePaymentIntentId" VARCHAR(255),
    "comentarios" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReservaViajeSevillaSeptiembre_pkey" PRIMARY KEY ("id")
);

-- Crear los índices únicos requeridos para Stripe
CREATE UNIQUE INDEX "ReservaViajeSevillaSeptiembre_stripeSessionId_key" ON ccmfalla."ReservaViajeSevillaSeptiembre"("stripeSessionId");
CREATE UNIQUE INDEX "ReservaViajeSevillaSeptiembre_stripePaymentIntentId_key" ON ccmfalla."ReservaViajeSevillaSeptiembre"("stripePaymentIntentId");
