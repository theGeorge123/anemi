-- AlterTable
ALTER TABLE "MeetupInvite" ADD COLUMN     "declineReason" TEXT,
ADD COLUMN     "declinedAt" TIMESTAMP(3),
ADD COLUMN     "inviteeUserId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nickname" TEXT;

-- CreateIndex
CREATE INDEX "MeetupInvite_inviteeUserId_idx" ON "MeetupInvite"("inviteeUserId");
