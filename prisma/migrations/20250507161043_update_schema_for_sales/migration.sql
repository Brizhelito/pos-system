/*
  Warnings:

  - The values [CASH,CARD,TRANSFER,OTHER] on the enum `sale_paymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `cedula` on the `customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idNumber]` on the table `customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "idType" AS ENUM ('VENEZOLANO', 'EXTRANJERO', 'PASAPORTE', 'JURIDICO', 'OTRO');

-- AlterEnum
BEGIN;
CREATE TYPE "sale_paymentMethod_new" AS ENUM ('EFECTIVO', 'PAGO_MOVIL', 'TRANSFERENCIA', 'PUNTO_DE_VENTA');
ALTER TABLE "sale" ALTER COLUMN "paymentMethod" TYPE "sale_paymentMethod_new" USING ("paymentMethod"::text::"sale_paymentMethod_new");
ALTER TYPE "sale_paymentMethod" RENAME TO "sale_paymentMethod_old";
ALTER TYPE "sale_paymentMethod_new" RENAME TO "sale_paymentMethod";
DROP TYPE "sale_paymentMethod_old";
COMMIT;

-- DropIndex
DROP INDEX "customer_cedula_idx";

-- DropIndex
DROP INDEX "customer_cedula_key";

-- AlterTable
ALTER TABLE "customer" DROP COLUMN "cedula",
ADD COLUMN     "idNumber" TEXT,
ADD COLUMN     "idType" "idType" NOT NULL DEFAULT 'VENEZOLANO';

-- CreateTable
CREATE TABLE "config" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "config_key_key" ON "config"("key");

-- CreateIndex
CREATE UNIQUE INDEX "customer_idNumber_key" ON "customer"("idNumber");

-- CreateIndex
CREATE INDEX "customer_idType_idNumber_idx" ON "customer"("idType", "idNumber");
