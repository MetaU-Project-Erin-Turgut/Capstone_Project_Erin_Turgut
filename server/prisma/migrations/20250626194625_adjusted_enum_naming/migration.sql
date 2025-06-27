/*
  Warnings:

  - The values [PENDING,ACCEPTED,REJECTED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('Pending', 'Accepted', 'Rejected');
ALTER TABLE "Event_User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Event_User" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Event_User" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterTable
ALTER TABLE "Event_User" ALTER COLUMN "status" SET DEFAULT 'Pending';
