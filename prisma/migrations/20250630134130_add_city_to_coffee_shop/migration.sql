/*
  Warnings:

  - Added the required column `city` to the `CoffeeShop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoffeeShop" ADD COLUMN     "city" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MeetupInvite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "organizerName" TEXT NOT NULL,
    "organizerEmail" TEXT NOT NULL,
    "cafeId" TEXT NOT NULL,
    "availableDates" TEXT[],
    "chosenDate" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MeetupInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MeetupInvite_token_key" ON "MeetupInvite"("token");

-- CreateIndex
CREATE INDEX "MeetupInvite_token_idx" ON "MeetupInvite"("token");

-- CreateIndex
CREATE INDEX "MeetupInvite_status_idx" ON "MeetupInvite"("status");

-- CreateIndex
CREATE INDEX "MeetupInvite_expiresAt_idx" ON "MeetupInvite"("expiresAt");

-- CreateIndex
CREATE INDEX "MeetupInvite_deletedAt_idx" ON "MeetupInvite"("deletedAt");

-- CreateIndex
CREATE INDEX "CoffeeShop_city_idx" ON "CoffeeShop"("city");

-- AddForeignKey
ALTER TABLE "MeetupInvite" ADD CONSTRAINT "MeetupInvite_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "CoffeeShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
