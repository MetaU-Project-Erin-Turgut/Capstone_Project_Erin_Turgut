/*
  Warnings:

  - You are about to drop the column `interest_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_interest_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "interest_id";
