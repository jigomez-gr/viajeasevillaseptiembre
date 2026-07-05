-- CreateTable
CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "numeroPlazas" INTEGER NOT NULL,
    "tipoHabitacion" TEXT NOT NULL,
    "importeTotal" REAL NOT NULL,
    "estado" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "comentarios" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_stripeSessionId_key" ON "Reserva"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_stripePaymentIntentId_key" ON "Reserva"("stripePaymentIntentId");
