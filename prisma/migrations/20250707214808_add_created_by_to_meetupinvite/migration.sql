-- AlterTable
ALTER TABLE "MeetupInvite" ADD COLUMN     "createdBy" TEXT;

-- CreateIndex
CREATE INDEX "MeetupInvite_createdBy_idx" ON "MeetupInvite"("createdBy");
