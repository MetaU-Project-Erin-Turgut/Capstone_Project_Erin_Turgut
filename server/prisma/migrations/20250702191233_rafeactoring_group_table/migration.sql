/*
  Warnings:

  - You are about to drop the column `interest_id` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Group` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_interest_id_fkey";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "interest_id",
DROP COLUMN "latitude",
DROP COLUMN "longitude";
