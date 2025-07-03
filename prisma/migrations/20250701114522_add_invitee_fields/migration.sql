-- AlterTable
ALTER TABLE "MeetupInvite" ADD COLUMN     "availableTimes" TEXT[],
ADD COLUMN     "chosenTime" TEXT,
ADD COLUMN     "inviteeEmail" TEXT,
ADD COLUMN     "inviteeName" TEXT;
