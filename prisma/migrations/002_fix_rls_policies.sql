-- Enable Row Level Security
ALTER TABLE "CoffeeShop" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Meetup" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Favorite" ENABLE ROW LEVEL SECURITY;

-- CoffeeShop Policies (public read, admin write)
CREATE POLICY "read_public" ON "CoffeeShop" FOR SELECT USING (true);
CREATE POLICY "write_admin" ON "CoffeeShop" FOR ALL USING (auth.role() = 'service_role');

-- Meetup Policies
CREATE POLICY "read_public_meetups" ON "Meetup" FOR SELECT USING (
  "isPrivate" = false OR 
  auth.uid()::text = "createdBy" OR
  EXISTS (
    SELECT 1 FROM "Participant" 
    WHERE "meetupId" = "Meetup".id AND "userId" = auth.uid()::text
  )
);
CREATE POLICY "write_own_meetups" ON "Meetup" FOR ALL USING (auth.uid()::text = "createdBy");

-- User Policies
CREATE POLICY "read_own_profile" ON "User" FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "update_own_profile" ON "User" FOR UPDATE USING (auth.uid()::text = id);

-- Review Policies
CREATE POLICY "read_public_reviews" ON "Review" FOR SELECT USING (true);
CREATE POLICY "write_own_reviews" ON "Review" FOR ALL USING (auth.uid()::text = "userId");

-- Favorite Policies
CREATE POLICY "read_own_favorites" ON "Favorite" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "write_own_favorites" ON "Favorite" FOR ALL USING (auth.uid()::text = "userId");

-- MeetupInvite Policies
ALTER TABLE "MeetupInvite" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_public_invites" ON "MeetupInvite" FOR SELECT USING (true);
CREATE POLICY "write_public_invites" ON "MeetupInvite" FOR ALL USING (true);

-- Create composite index for meetup queries with soft delete
CREATE INDEX idx_meetup_active_location ON "Meetup" (latitude, longitude) WHERE "deletedAt" IS NULL;

-- Create index for soft delete queries
CREATE INDEX idx_meetup_deleted_at ON "Meetup" ("deletedAt") WHERE "deletedAt" IS NOT NULL; 