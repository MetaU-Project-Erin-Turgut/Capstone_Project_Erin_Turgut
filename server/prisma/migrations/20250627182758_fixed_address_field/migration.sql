/*
  Warnings:

  - The values [Pending,Accepted,Rejected] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `User_Profile` table. All the data in the column will be lost.
  - Made the column `address` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
ALTER TABLE "Event_User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Event_User" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Event_User" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "address" SET NOT NULL;

-- AlterTable
ALTER TABLE "Event_User" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User_Profile" DROP COLUMN "address";
