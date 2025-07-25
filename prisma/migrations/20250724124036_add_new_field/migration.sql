-- Example: Add a new field to User table without losing data
-- This is how you would add a new field safely

-- Add a new column with a default value
ALTER TABLE "User" ADD COLUMN "example_field" TEXT DEFAULT 'default_value';

-- Or add a nullable column (no default needed)
-- ALTER TABLE "User" ADD COLUMN "example_field" TEXT;

-- Or add a column with a computed default
-- ALTER TABLE "User" ADD COLUMN "example_field" TEXT DEFAULT 'computed_' || id;

-- Example: Add an index for better performance
-- CREATE INDEX "User_example_field_idx" ON "User"("example_field");

-- Example: Add a constraint
-- ALTER TABLE "User" ADD CONSTRAINT "User_example_field_check" CHECK (length("example_field") > 0);