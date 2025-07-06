-- ENUMS
CREATE TYPE "MeetupStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');
CREATE TYPE "MeetupCategory" AS ENUM ('SOCIAL', 'NETWORKING', 'STUDY_GROUP', 'BOOK_CLUB', 'LANGUAGE_EXCHANGE', 'TECH_MEETUP', 'CREATIVE', 'FITNESS', 'FOOD_DRINK', 'OTHER');
CREATE TYPE "VenueType" AS ENUM ('COFFEE_SHOP', 'RESTAURANT', 'BAR', 'PARK', 'LIBRARY', 'COMMUNITY_CENTER', 'OFFICE_SPACE', 'OTHER');
CREATE TYPE "ParticipantRole" AS ENUM ('HOST', 'CO_HOST', 'ATTENDEE', 'OBSERVER');
CREATE TYPE "ParticipantStatus" AS ENUM ('INVITED', 'ACCEPTED', 'DECLINED', 'MAYBE', 'ATTENDED', 'NO_SHOW');
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');
CREATE TYPE "NotificationType" AS ENUM ('MEETUP_INVITATION', 'MEETUP_REMINDER', 'MEETUP_CANCELLED', 'MEETUP_RESCHEDULED', 'PARTICIPANT_JOINED', 'NEW_REVIEW', 'COFFEE_SUGGESTION', 'SYSTEM_UPDATE');
CREATE TYPE "Theme" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');
CREATE TYPE "PriceRange" AS ENUM ('BUDGET', 'MODERATE', 'EXPENSIVE', 'LUXURY');

-- TABLES (add your CREATE TABLE statements here, as in your migration.sql)
-- ... (for brevity, copy all CREATE TABLE statements from your migration.sql)

-- INDEXES (add your CREATE INDEX statements here)
-- ... (copy all CREATE INDEX statements from your migration.sql)

-- ENABLE RLS
ALTER TABLE "CoffeeShop" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Meetup" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Favorite" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MeetupInvite" ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "read_public" ON "CoffeeShop" FOR SELECT USING (true);
CREATE POLICY "write_admin" ON "CoffeeShop" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "read_public_meetups" ON "Meetup" FOR SELECT USING (
  "isPrivate" = false OR 
  auth.uid()::text = "createdBy" OR
  EXISTS (
    SELECT 1 FROM "Participant" 
    WHERE "meetupId" = "Meetup".id AND "userId" = auth.uid()::text
  )
);
CREATE POLICY "write_own_meetups" ON "Meetup" FOR ALL USING (auth.uid()::text = "createdBy");
CREATE POLICY "read_own_profile" ON "User" FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "update_own_profile" ON "User" FOR UPDATE USING (auth.uid()::text = id);
CREATE POLICY "read_public_reviews" ON "Review" FOR SELECT USING (true);
CREATE POLICY "write_own_reviews" ON "Review" FOR ALL USING (auth.uid()::text = "userId");
CREATE POLICY "read_own_favorites" ON "Favorite" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "write_own_favorites" ON "Favorite" FOR ALL USING (auth.uid()::text = "userId");
CREATE POLICY "read_public_invites" ON "MeetupInvite" FOR SELECT USING (true);
CREATE POLICY "write_public_invites" ON "MeetupInvite" FOR ALL USING (true);

-- ADDITIONAL INDEXES
CREATE INDEX idx_meetup_active_location ON "Meetup" (latitude, longitude) WHERE "deletedAt" IS NULL;
CREATE INDEX idx_meetup_deleted_at ON "Meetup" ("deletedAt") WHERE "deletedAt" IS NOT NULL; 