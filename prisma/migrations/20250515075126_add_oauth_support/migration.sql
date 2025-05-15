/*
  Warnings:

  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerAccountId` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "account" ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "providerAccountId" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");
